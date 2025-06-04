const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Historique = sequelize.define('Historique', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    questionnaire_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question_actuelle_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nb_bonnes_reponses: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    nb_total_questions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    termine: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    date_debut: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    date_fin: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'historique',
    timestamps: false
});

module.exports = Historique;
