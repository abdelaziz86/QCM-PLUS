const { Questionnaire, Question } = require('../../models');

// ✅ Create a new questionnaire
exports.createQuestionnaire = async (req, res) => {
    try {
        const { nom, description } = req.body;

        if (!nom) return res.status(400).json({ msg: "Le nom est requis." });

        const questionnaire = await Questionnaire.create({ nom, description });

        res.status(201).json({ msg: "Questionnaire créé avec succès.", questionnaire });
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

// ✅ Get all questionnaires
exports.getAllQuestionnaires = async (req, res) => {
    try {
        const questionnaires = await Questionnaire.findAll({
            include: {
                model: Question,
                as: 'questions',
            },
            order: [['created_at', 'DESC']],
        });

        res.json(questionnaires);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

// ✅ Get one questionnaire by ID
exports.getQuestionnaireById = async (req, res) => {
    try {
        const { id } = req.params;

        const questionnaire = await Questionnaire.findByPk(id, {
            include: {
                model: Question,
                as: 'questions',
            },
        });

        if (!questionnaire) return res.status(404).json({ msg: "Questionnaire introuvable." });

        res.json(questionnaire);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

// ✅ Update questionnaire
exports.updateQuestionnaire = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description } = req.body;

        const questionnaire = await Questionnaire.findByPk(id);
        if (!questionnaire) return res.status(404).json({ msg: "Questionnaire introuvable." });

        await questionnaire.update({
            nom: nom || questionnaire.nom,
            description: description || questionnaire.description,
        });

        res.json({ msg: "Questionnaire mis à jour.", questionnaire });
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};

// ✅ Delete questionnaire
exports.deleteQuestionnaire = async (req, res) => {
    try {
        const { id } = req.params;

        const questionnaire = await Questionnaire.findByPk(id);
        if (!questionnaire) return res.status(404).json({ msg: "Questionnaire introuvable." });

        await questionnaire.destroy();

        res.json({ msg: "Questionnaire supprimé." });
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur", err });
    }
};
