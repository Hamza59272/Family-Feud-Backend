const gameRouter = require("express").Router();
const {
    startGame,
    newQuestion,
    endGame
} = require('../Controllers/gameController');

gameRouter.post('/start-game', startGame);
gameRouter.post('/new-question', newQuestion);
gameRouter.post('/end-game', endGame);

module.exports = gameRouter;