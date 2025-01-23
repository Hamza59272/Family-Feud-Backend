const adminRouter = require("express").Router();
const { login ,handleAdminAction,switchFamily,revealAll } = require('../Controllers/adminController');
const { getLeaderboard } = require("../Controllers/leaderboardController");

adminRouter.post('/login', login);
adminRouter.post('/action', handleAdminAction);
adminRouter.post('/switch-family', switchFamily);
adminRouter.post('/reveal-all', revealAll);
adminRouter.get('/get-leaderboard', getLeaderboard);

module.exports = adminRouter;
