const Family = require('../Model/Family');

exports.createFamily = async (req, res) => {
    try {
        const name = req.body.name;

        const existingFamily = await Family.findOne({
            $expr: { $eq: [{ $toLower: "$name" }, name.toLowerCase()] }
        });

        if (existingFamily) {
            return res.status(400).send({ success: false ,
                 error: 'Family name already exists'});
        }

        // Create a new family
        const family = new Family({ name });
        await family.save();
        res.status(201).send({
            success: true ,
            family: family,
            message : "Family Added Successfully"
        });
    } catch (err) {
        res.status(500).send({
            success: false ,
            error: err.message});
    }
};



exports.updateFamilyStats = async (req, res) => {
    const { id } = req.params;
    const { score, gamesPlayed, gamesWon } = req.body;
    try {
        const family = await Family.findById(id);
        if (!family) return res.status(404).send('Family not found');

        family.score += score || 0;
        family.gamesPlayed += gamesPlayed || 0;
        family.gamesWon += gamesWon || 0;

        await family.save();
        res.send(family);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getFamilies = async (req, res) => {
    try {
        const families = await Family.find();
        res.status(200).send({
            success: true,
            data: families
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}
