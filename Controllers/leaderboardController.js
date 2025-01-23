const Family = require('../Model/Family');

exports.getLeaderboard = async (req, res) => {
    try {
        // Fetch all families
        const families = await Family.find();

        if (!families || families.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No families found"
            });
        }

        // Calculate win percentage and sort
        const leaderboard = families.map((family) => {
            const winPercentage = family.gamesPlayed > 0 
                ? (family.gamesWon / family.gamesPlayed) * 100 
                : 0;
            return {
                name: family.name,
                gamesPlayed: family.gamesPlayed,
                gamesWon: family.gamesWon,
                score: family.score,
                winPercentage: parseFloat(winPercentage.toFixed(2)) // Limit to 2 decimal places
            };
        });

        // Sort by score first, then by win percentage
        leaderboard.sort((a, b) => {
            if (b.score === a.score) {
                return b.winPercentage - a.winPercentage;
            }
            return b.score - a.score;
        });

        res.status(200).send({
            success: true,
            leaderboard: leaderboard,
            message: "Leaderboard fetched successfully"
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            error: err.message
        });
    }
};
