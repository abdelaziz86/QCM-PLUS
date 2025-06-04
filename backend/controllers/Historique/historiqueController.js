const { Historique, Question, Questionnaire } = require('../../models');

// ✅ 1. Démarrer un nouveau questionnaire
exports.startQuestionnaire = async (req, res) => {
    try {
        const { user_id, questionnaire_id } = req.body;

        // Récupérer toutes les questions de ce questionnaire
        const questions = await Question.findAll({
            where: { questionnaire_id },
            order: [['id', 'ASC']]
        });

        if (!questions.length) return res.status(400).json({ msg: "Aucune question trouvée." });

        const newHistorique = await Historique.create({
            user_id,
            questionnaire_id,
            question_actuelle_id: questions[0].id,
            nb_total_questions: questions.length
        });

        res.status(201).json({ msg: "Historique initialisé", historique: newHistorique });
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

// ✅ 2. Valider une réponse et passer à la question suivante
exports.validateQuestion = async (req, res) => {
    try {
        const { historique_id } = req.params;
        const { reponses } = req.body; // Ex: "1,0,0,1,0"

        const historique = await Historique.findByPk(historique_id);
        if (!historique) return res.status(404).json({ msg: "Historique introuvable" });

        const question = await Question.findByPk(historique.question_actuelle_id);
        if (!question) return res.status(404).json({ msg: "Question non trouvée" });

        // Comparaison des réponses
        const userRep = reponses.split(',').map(Number);
        const bonneRep = (question.bonne_reponse || '').split(',').map(Number);

        const isCorrect = JSON.stringify(userRep) === JSON.stringify(bonneRep);

        // Mise à jour du compteur si réponse correcte
        if (isCorrect) {
            historique.nb_bonnes_reponses += 1;
        }

        // Chercher la prochaine question
        const allQuestions = await Question.findAll({
            where: { questionnaire_id: historique.questionnaire_id },
            order: [['id', 'ASC']]
        });

        const currentIndex = allQuestions.findIndex(q => q.id === question.id);
        const nextQuestion = allQuestions[currentIndex + 1];

        if (nextQuestion) {
            // Continuer
            historique.question_actuelle_id = nextQuestion.id;
        } else {
            // Fin du questionnaire
            historique.termine = true;
            historique.date_fin = new Date();
            historique.question_actuelle_id = null;
        }

        await historique.save();

        res.json({
            msg: isCorrect ? "Bonne réponse" : "Mauvaise réponse",
            correcte: isCorrect,
            prochaine_question: nextQuestion ? nextQuestion.id : null,
            termine: historique.termine
        });

    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};



exports.getCurrentHistorique = async (req, res) => {
    try {
        const { user_id, questionnaire_id } = req.query;

        if (!user_id || !questionnaire_id) {
            return res.status(400).json({ msg: "user_id et questionnaire_id sont requis" });
        }

        const historique = await Historique.findOne({
            where: {
                user_id,
                questionnaire_id,
                termine: false,
            },
            include: [
                {
                    model: Question,
                    as: 'question_actuelle',
                },
            ],
        });

        if (!historique) {
            return res.status(404).json({ msg: "Aucun historique en cours trouvé pour ce stagiaire" });
        }

        res.json({
            historique
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

exports.getHistoriquesByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ msg: "user_id est requis" });
        }

        const historiques = await Historique.findAll({
            where: { user_id },
            include: [
                {
                    model: Questionnaire,
                    as: 'questionnaire',
                    attributes: ['id', 'nom', 'description'],
                },
            ],
            order: [['date_debut', 'DESC']],
        });

        res.json(historiques);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};
