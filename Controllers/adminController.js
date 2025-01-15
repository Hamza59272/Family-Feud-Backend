const Admin = require('../Model/Admin');
const Survey = require('../Model/Survey');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).send({
            success: false,
            error: 'Invalid User'
        });

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(400).send({
            success: false,
            error: 'Invalid password'
        });

        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
        res.status(200).send({ 
            success: true,
            message : 'Login Successfully',
            token:  token 
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.handleAdminAction = async (req, res) => {
    const { questionId, answerToRevealId, reveal, strike, countStrike } = req.body;
    
    try {
        if (reveal) {
            // Find the question and the specific answer
            const question = await Survey.findById(questionId);
            if (!question) {
                return res.status(404).json({
                    success: false,
                    message: 'Question not found.',
                });
            }

            const answer = question.answers.id(answerToRevealId);
            if (!answer) {
                return res.status(404).json({
                    success: false,
                    message: 'Answer not found.',
                });
            }

            // Emit the event with answer details
            req.io.emit('revealAnswer', {
                questionId,
                answer: answer
            });

            return res.status(200).json({
                success: true,
                message: 'Answer revealed successfully.',
            });
        } else if (strike) {
            // Emit strike event
            req.io.emit('strike', { countStrike });

            return res.status(200).json({
                success: true,
                message: 'Strike broadcasted successfully.',
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid action.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the action.',
        });
    }
};