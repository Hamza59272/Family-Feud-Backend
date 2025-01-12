const surveyRouter = require("express").Router();
const { getSurveys,uploadSurveys,addQuestions } = require('../Controllers/surveyController');
const multer = require('multer');


const upload = multer({ dest: 'uploads/' });

surveyRouter.get('/get-surveys', getSurveys);
surveyRouter.post('/upload-Surveys', upload.single('file'), uploadSurveys);
surveyRouter.post('/add-questions', addQuestions);

module.exports = surveyRouter;
