const adminRouter = require("express").Router();
const { login ,handleAdminAction } = require('../Controllers/adminController');

adminRouter.post('/login', login);
adminRouter.post('/action', handleAdminAction);

module.exports = adminRouter;
