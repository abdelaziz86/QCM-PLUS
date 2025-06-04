const sequelize = require('../config/db');
const { Sequelize } = require('sequelize');

// Import models
const User = require('./User');
const Questionnaire = require('./Questionnaire');
const Question = require('./Question');
const Historique = require('./Historique'); // ⬅️ NEW

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

// Historique ↔ User
User.hasMany(Historique, {
    foreignKey: 'user_id',
    as: 'historiques',
    onDelete: 'CASCADE',
});
Historique.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

// Historique ↔ Questionnaire
Questionnaire.hasMany(Historique, {
    foreignKey: 'questionnaire_id',
    as: 'historiques',
    onDelete: 'CASCADE',
});
Historique.belongsTo(Questionnaire, {
    foreignKey: 'questionnaire_id',
    as: 'questionnaire',
});

// Historique ↔ Question (current question)
Question.hasMany(Historique, {
    foreignKey: 'question_actuelle_id',
    as: 'historiques',
    onDelete: 'SET NULL',
});
Historique.belongsTo(Question, {
    foreignKey: 'question_actuelle_id',
    as: 'question_actuelle',
});

// Combine into db object
const db = {
    sequelize,
    Sequelize,
    User,
    Questionnaire,
    Question,
    Historique // ⬅️ Added to db
};

// Sync models
db.sequelize.sync({ alter: true }) // change to { force: true } to reset tables
    .then(() => console.log('✅ All models synced with DB'))
    .catch(err => console.error('❌ Model sync error:', err));

module.exports = db;
