const sequelize = require('../config/db');
const { Sequelize } = require('sequelize');

// Import models
const User = require('./User');
const Questionnaire = require('./Questionnaire');
const Question = require('./Question');
const Historique = require('./Historique');
const Reponse = require('./Reponse'); // ⬅️ NOUVEAU MODÈLE

// Define associations

// Questionnaire ↔ Questions
Questionnaire.hasMany(Question, {
    foreignKey: 'questionnaire_id',
    as: 'questions',
    onDelete: 'CASCADE',
});

Question.belongsTo(Questionnaire, {
    foreignKey: 'questionnaire_id',
    as: 'questionnaire',
});

// User ↔ Historique
User.hasMany(Historique, {
    foreignKey: 'user_id',
    as: 'historiques',
    onDelete: 'CASCADE',
});
Historique.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

// Questionnaire ↔ Historique
Questionnaire.hasMany(Historique, {
    foreignKey: 'questionnaire_id',
    as: 'historiques',
    onDelete: 'CASCADE',
});
Historique.belongsTo(Questionnaire, {
    foreignKey: 'questionnaire_id',
    as: 'questionnaire',
});

// Question ↔ Historique (current question)
Question.hasMany(Historique, {
    foreignKey: 'question_actuelle_id',
    as: 'historiques_en_cours',
    onDelete: 'SET NULL',
});
Historique.belongsTo(Question, {
    foreignKey: 'question_actuelle_id',
    as: 'question_actuelle',
});

// ⭐ NOUVELLES ASSOCIATIONS POUR RÉPONSES

// Historique ↔ Reponses
Historique.hasMany(Reponse, {
    foreignKey: 'historique_id',
    as: 'reponses',
    onDelete: 'CASCADE', // Si on supprime l'historique, on supprime les réponses
});
Reponse.belongsTo(Historique, {
    foreignKey: 'historique_id',
    as: 'historique',
});

// Question ↔ Reponses
Question.hasMany(Reponse, {
    foreignKey: 'question_id',
    as: 'reponses_utilisateurs',
    onDelete: 'CASCADE', // Si on supprime la question, on supprime les réponses
});
Reponse.belongsTo(Question, {
    foreignKey: 'question_id',
    as: 'question',
});

// Combine into db object
const db = {
    sequelize,
    Sequelize,
    User,
    Questionnaire,
    Question,
    Historique,
    Reponse // ⬅️ AJOUTÉ À L'OBJET DB
};

// Sync models
db.sequelize.sync({ alter: true })
    .then(() => console.log('✅ All models synced with DB'))
    .catch(err => console.error('❌ Model sync error:', err));

module.exports = db;