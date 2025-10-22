const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reponse = sequelize.define('Reponse', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    historique_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reponse_utilisateur: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    est_correcte: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'reponses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Reponse;