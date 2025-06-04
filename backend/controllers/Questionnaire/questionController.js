const { Question, Questionnaire } = require('../../models');

// ✅ Create a question
exports.createQuestion = async (req, res) => {
    try {
        const { questionnaire_id } = req.params;
        const {
            description,
            reponse_1,
            reponse_2,
            reponse_3,
            reponse_4,
            reponse_5,
            bonne_reponse
        } = req.body;

        if (!description) {
            return res.status(400).json({ msg: "La description de la question est requise." });
        }

        const questionnaire = await Questionnaire.findByPk(questionnaire_id);
        if (!questionnaire) {
            return res.status(404).json({ msg: "Questionnaire introuvable." });
        }

        const question = await Question.create({
            questionnaire_id,
            description,
            reponse_1,
            reponse_2,
            reponse_3,
            reponse_4,
            reponse_5,
            bonne_reponse
        });

        res.status(201).json({ msg: "Question créée avec succès.", question });
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

// ✅ Get all questions for a questionnaire
exports.getQuestionsByQuestionnaire = async (req, res) => {
    try {
        const { questionnaire_id } = req.params;

        const questions = await Question.findAll({
            where: { questionnaire_id },
            order: [['created_at', 'ASC']]
        });

        res.json(questions);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

// ✅ Get a single question by ID
exports.getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByPk(id);
        if (!question) return res.status(404).json({ msg: "Question introuvable." });

        res.json(question);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

// ✅ Update a question
exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const question = await Question.findByPk(id);
        if (!question) return res.status(404).json({ msg: "Question introuvable." });

        await question.update(data);

        res.json({ msg: "Question mise à jour.", question });
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

// ✅ Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByPk(id);
        if (!question) return res.status(404).json({ msg: "Question introuvable." });

        await question.destroy();
        res.json({ msg: "Question supprimée." });
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};
