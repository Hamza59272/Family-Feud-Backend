const Survey = require('../Model/Survey');
const parseExcel = require('../helpers/excelParser');
const fs = require('fs');
const path = require('path');

exports.uploadSurveys = async (req, res, next) => {

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        const surveys = parseExcel(req.file.path);

        await Survey.insertMany(surveys);

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error while deleting file:', err.message);
            } else {
                console.log('Uploaded file successfully deleted.');
            }
        });

        res.status(201).json({
            success: true,
            message: 'Surveys uploaded successfully',
        });
    } catch (err) {

        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error while deleting file during error handling:', unlinkErr.message);
                }
            });
        }
        res.status(500).json({
            success: false,
            error: err,
        });
    }
};


exports.getSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find();
        res.send({
            success: true,
            data: surveys
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            error: err.message
        });
    }
};

exports.addQuestions = async (req, res) => {
    try {
        const questions = req.body.questions; // Array of questions

        // Validate input
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).send({
                success: false,
                error: 'Invalid input. Provide an array of questions.'
            });
        }

        // Save each question in the database
        const savedQuestions = await Survey.insertMany(questions);
        res.status(201).send({
            success: true,
            message: 'Questions added successfully',
            data: savedQuestions,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            error: err.message
        });
    }
};
