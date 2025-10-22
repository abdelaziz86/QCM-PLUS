const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/questionnaire/questionController');

// For a specific questionnaire
router.post('/:questionnaire_id', questionController.createQuestion);
router.get('/questionnaire/:questionnaire_id', questionController.getQuestionsByQuestionnaire);

// For individual questions
router.get('/:id', questionController.getQuestionById);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);
router.post('/bulk/:questionnaire_id', questionController.bulkInsertQuestions);

module.exports = router;
