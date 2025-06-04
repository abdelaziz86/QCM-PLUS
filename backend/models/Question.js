const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    questionnaire_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reponse_1: DataTypes.TEXT,
    reponse_2: DataTypes.TEXT,
    reponse_3: DataTypes.TEXT,
    reponse_4: DataTypes.TEXT,
    reponse_5: DataTypes.TEXT,
    bonne_reponse: DataTypes.TEXT
}, {
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Question;
