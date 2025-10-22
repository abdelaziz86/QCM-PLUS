import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/HistoriquePage.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Importing icons
import {
    FaHistory,
    FaClipboardList,
    FaCalendarAlt,
    FaChartLine,
    FaCheckCircle,
    FaPlayCircle,
    FaTrophy,
    FaClock
} from 'react-icons/fa';

const HistoriquePage = () => {
    const { user } = useContext(AuthContext);
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            axios.get(`http://localhost:5000/api/historique/user/${user.id}`)
                .then(res => {
                    setHistorique(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Erreur lors du chargement de l'historique", err);
                    setLoading(false);
                });
        }
    }, [user]);

    const getProgressPercentage = (done, total) => {
        return Math.round((done / total) * 100);
    };

    if (loading) {
        return (
            <div className="historique-container">
                <div className="loading-spinner">Chargement de l'historique...</div>
            </div>
        );
    }

    return (
        <div className="historique-container">
            <div className="page-header">
                <h2>Mon Historique de Questionnaires</h2>
                <p>Retrouvez tous vos questionnaires passés et en cours</p>
            </div>

            {historique.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <FaClipboardList />
                    </div>
                    <h3>Aucun questionnaire commencé</h3>
                    <p>Commencez votre premier questionnaire pour voir votre historique ici.</p>
                    <button className="btn-primary" onClick={() => navigate('/')}>
                        Explorer les questionnaires
                    </button>
                </div>
            ) : (
                <div className="historique-list">
                    {historique.map((item) => {
                        // Pour un questionnaire terminé, on considère que toutes les questions sont complétées
                        const questionsCompleted = item.termine
                            ? item.nb_total_questions
                            : item.numero_question - 1; // -1 car on commence à 1

                        const progressPercentage = getProgressPercentage(questionsCompleted, item.nb_total_questions);

                        // Calculer le score (bonnes réponses)
                        const scorePercentage = getProgressPercentage(item.nb_bonnes_reponses, item.nb_total_questions);
                        const score = item.termine
                            ? `${scorePercentage}%`
                            : 'En cours...';

                        return (
                            <div key={item.id} className="historique-card">
                                <div className="card-header">
                                    <h3>{item.questionnaire.nom}</h3>
                                    <div className={`status-badge ${item.termine ? 'completed' : 'in-progress'}`}>
                                        {item.termine ? (
                                            <>
                                                <FaCheckCircle className="status-icon" />
                                                Terminé
                                            </>
                                        ) : (
                                            <>
                                                <FaClock className="status-icon" />
                                                En cours
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="card-content">
                                    <p className="questionnaire-description">{item.questionnaire.description}</p>

                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <div className="stat-icon">
                                                <FaCalendarAlt />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-label">Début</span>
                                                <span className="stat-value">{new Date(item.date_debut).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="stat-item">
                                            <div className="stat-icon">
                                                <FaChartLine />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-label">Progression</span>
                                                <span className="stat-value">
                                                    {item.termine
                                                        ? `${item.nb_total_questions} / ${item.nb_total_questions}`
                                                        : `${item.numero_question - 1} / ${item.nb_total_questions}`
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div className="stat-item">
                                            <div className="stat-icon">
                                                <FaCheckCircle />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-label">Bonnes réponses</span>
                                                <span className="stat-value">{item.nb_bonnes_reponses} / {item.nb_total_questions}</span>
                                            </div>
                                        </div>

                                        <div className="stat-item">
                                            <div className="stat-icon">
                                                <FaTrophy />
                                            </div>
                                            <div className="stat-info">
                                                <span className="stat-label">Score</span>
                                                <span className="stat-value">{score}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="progress-container">
                                        <div className="progress-label">
                                            <span>Progression globale</span>
                                            <span>{progressPercentage}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    {!item.termine && (
                                        <button
                                            className="btn-resume"
                                            onClick={() => navigate(`/valider-question/${item.questionnaire_id}`)}
                                        >
                                            <FaPlayCircle className="btn-icon" />
                                            Reprendre
                                        </button>
                                    )}
                                    {progressPercentage === 100 && ( // ⬅️ Seulement si 100% complété
                                        <button
                                            className="btn-details"
                                            onClick={() => navigate(`/historique/detail/${item.id}`)}
                                        >
                                            Voir les détails
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HistoriquePage;