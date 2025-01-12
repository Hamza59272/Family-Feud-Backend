const adminRouter = require("express").Router();
const { login } = require('../Controllers/adminController');

adminRouter.post('/login', login);

module.exports = adminRouter;
