const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Questionnaire = sequelize.define('Questionnaire', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'questionnaires',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Questionnaire;
