const Survey = require('../Model/Survey');
const Family = require('../Model/Family');

exports.startGame = async (req, res) => {
    const { family1, family2 } = req.body;

    if (!family1 || !family2) {
        return res.status(400).send({
            success: false,
            message: 'Both family IDs are required.',
        });
    }

    try {
        // Check if both families exist
        const families = await Family.find({ _id: { $in: [family1, family2] } });
        if (families.length !== 2) {
            return res.status(404).send({
                success: false,
                message: 'One or both families not found.',
            });
        }

        // Find a question not played by either family
        const question = await Survey.findOne({
            playedBy: { $nin: [family1, family2] },
        });

        if (!question) {
            return res.status(404).send({
                success: false,
                message: 'No questions available that have not been played by these families.',
            });
        }

        req.io.emit('startGame', {
            question: {
                id: question._id,
                text: question.question,
                answers: question.answers,
            },
            families: families
        });

        res.status(200).send({
            success: true,
            question: {
                id: question._id,
                text: question.question,
                answers: question.answers,
            },
            families: families
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
};
exports.newQuestion = async (req, res) => {
    const { family1, family2, questionId } = req.body;

    if (!family1 || !family2 || !questionId) {
        return res.status(400).send({
            success: false,
            message: 'family1 ID, family2 ID, and question ID are required.',
        });
    }

    try {
        // Check if both families exist
        const families = await Family.find({ _id: { $in: [family1, family2] } });
        if (families.length !== 2) {
            return res.status(404).send({
                success: false,
                message: 'One or both families not found.',
            });
        }

        // Find the specified question
        const currentQuestion = await Survey.findById(questionId);
        if (!currentQuestion) {
            return res.status(404).send({
                success: false,
                message: 'Question not found.',
            });
        }

        // Add the family IDs to the playedBy field if not already present
        if (!currentQuestion.playedBy.includes(family1)) {
            currentQuestion.playedBy.push(family1);
        }
        if (!currentQuestion.playedBy.includes(family2)) {
            currentQuestion.playedBy.push(family2);
        }
        await currentQuestion.save();

        // Fetch a new question that hasn't been played by these families
        const newQuestion = await Survey.findOne({
            playedBy: { $nin: [family1, family2] },
        });

        if (!newQuestion) {
            return res.status(404).send({
                success: false,
                message: 'No more questions available that haven’t been played by these families.',
            });
        }

        req.io.emit('newQuestion', {
            question: {
                id: newQuestion._id,
                text: newQuestion.question,
                answers: newQuestion.answers,
            },
            families : families
        });

        res.status(200).send({
            success: true,
            question: {
                id: newQuestion._id,
                text: newQuestion.question,
                answers: newQuestion.answers,
            },
            families : families
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
};
exports.endGame = async (req, res) => {
    const { question, familyWonId, familyLoseId, familyWonScore, familyLoseScore } = req.body;

    // Validate input
    if (!question || !familyWonId || !familyLoseId || familyWonScore == null || familyLoseScore == null) {
        return res.status(400).send({
            success: false,
            message: 'Missing required fields: question, familyWonId, familyLoseId, familyWonScore, familyLoseScore.',
        });
    }

    try {
        // Find the question
        const currentQuestion = await Survey.findById(question);
        if (!currentQuestion) {
            return res.status(404).send({
                success: false,
                message: 'Question not found.',
            });
        }

        // Add the family IDs to the playedBy field if not already present
        if (!currentQuestion.playedBy.includes(familyWonId)) {
            currentQuestion.playedBy.push(familyWonId);
        }
        if (!currentQuestion.playedBy.includes(familyLoseId)) {
            currentQuestion.playedBy.push(familyLoseId);
        }
        await currentQuestion.save();

        // Fetch and update the winning family
        const familyWon = await Family.findById(familyWonId);
        if (!familyWon) {
            return res.status(404).send({
                success: false,
                message: 'Winning family not found.',
            });
        }

        familyWon.gamesPlayed += 1;
        familyWon.gamesWon += 1;
        familyWon.score += familyWonScore;
        await familyWon.save();

        // Fetch and update the losing family
        const familyLose = await Family.findById(familyLoseId);
        if (!familyLose) {
            return res.status(404).send({
                success: false,
                message: 'Losing family not found.',
            });
        }

        familyLose.gamesPlayed += 1;
        familyLose.score += familyLoseScore;
        await familyLose.save();

        req.io.emit('endGame', {
            familyWon: {
                id: familyWon._id,
                Name: familyWon.name,
                score: familyWonScore,
            },
            familyLose: {
                id: familyLose._id,
                Name: familyLose.name,
                score: familyLoseScore,
            }
        });

        res.status(200).send({
            success: true,
            message: 'Game ended and scores updated successfully.',
            data: {
                familyWon: {
                    id: familyWon._id,
                    gamesPlayed: familyWon.gamesPlayed,
                    gamesWon: familyWon.gamesWon,
                    score: familyWon.score,
                },
                familyLose: {
                    id: familyLose._id,
                    gamesPlayed: familyLose.gamesPlayed,
                    gamesWon: familyLose.gamesWon,
                    score: familyLose.score,
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
};
exports.quitGame = async (req, res) => {

    try {

        req.io.emit('quitGame', {
            deleteLocalData : true
        });

        res.status(200).send({
            success: true,
            message: 'Game has been successfully quitted',
            data: {
                deleteLocalData : true
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
};