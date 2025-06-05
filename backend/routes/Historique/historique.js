const express = require('express');
const router = express.Router();
const historiqueController = require('../../controllers/historique/historiqueController');

router.post('/start', historiqueController.startQuestionnaire);
router.post('/validate/:user_id/:questionnaire_id', historiqueController.validateQuestion);
router.get('/current', historiqueController.getCurrentHistorique);
router.get('/user/:user_id', historiqueController.getHistoriquesByUser);

module.exports = router;
