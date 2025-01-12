const Admin = require('../Model/Admin');
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
