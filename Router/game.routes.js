const gameRouter = require("express").Router();
const {
    startGame,
    newQuestion,
    endGame,
    quitGame
} = require('../Controllers/gameController');

gameRouter.post('/start-game', startGame);
gameRouter.post('/new-question', newQuestion);
gameRouter.post('/end-game', endGame);
gameRouter.get('/quit-game', quitGame);

module.exports = gameRouter;