import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ValiderQuestion.css';
import { AuthContext } from '../context/AuthContext';

// Import icons
import {
    FaCheck,
    FaChevronRight,
    FaChevronLeft,
    FaTrophy,
    FaChartBar,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaHistory,
    FaClipboardList
} from 'react-icons/fa';

const ValiderQuestion = () => {
    const { user } = useContext(AuthContext);
    const { questionnaire_id } = useParams();
    const navigate = useNavigate();

    const [historique, setHistorique] = useState(null);
    const [checked, setChecked] = useState([0, 0, 0, 0, 0]);
    const [feedback, setFeedback] = useState(null);
    const [validerDisabled, setValiderDisabled] = useState(false);
    const [suivantDisabled, setSuivantDisabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [showResults, setShowResults] = useState(false);
    const [resultsData, setResultsData] = useState(null);

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/historique/current?user_id=${user.id}&questionnaire_id=${questionnaire_id}`);
            setHistorique(res.data);
            setChecked([0, 0, 0, 0, 0]);
            setFeedback(null);
            setValiderDisabled(false);
            setSuivantDisabled(true);
            setShowResults(false);
            setLoading(false);
        } catch (err) {
            console.error('Erreur chargement question', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id && questionnaire_id) {
            fetchQuestion();
        }
    }, [user, questionnaire_id]);

    const handleCheckboxChange = (index) => {
        setChecked(prev => {
            const updated = [...prev];
            updated[index] = updated[index] ? 0 : 1;
            return updated;
        });
    };

    const handleSubmit = async () => {
        try {
            const reponses = checked.join(',');
            const res = await axios.post(`http://localhost:5000/api/historique/validate/${user.id}/${questionnaire_id}`, { reponses });

            setFeedback(res.data);
            setValiderDisabled(true);
            setSuivantDisabled(false);

            // Si c'est la dernière question, récupérer les données complètes pour les résultats
            if (res.data.termine) {
                const resultsRes = await axios.get(`http://localhost:5000/api/historique/detail/${res.data.historique_id}`);
                setResultsData(resultsRes.data);
            }
        } catch (err) {
            console.error('Erreur validation', err);
        }
    };

    const handleNext = async () => {
        if (feedback?.termine) {
            setShowResults(true);
        } else {
            await fetchQuestion();
        }
    };

    const handleBack = () => {
        navigate('/historique');
    };

    const handleViewHistorique = () => {
        navigate('/historique');
    };

    const handleViewDetails = () => {
        navigate(`/historique/detail/${resultsData.historique.id}`);
    };

    // Calcul des statistiques pour la page de résultats
    const calculateStats = () => {
        if (!resultsData) return null;

        const { historique, questions } = resultsData;
        const scorePercentage = Math.round((historique.nb_bonnes_reponses / historique.nb_total_questions) * 100);
        const timeSpent = Math.round((new Date(historique.date_fin) - new Date(historique.date_debut)) / 1000 / 60); // en minutes

        return {
            score: historique.nb_bonnes_reponses,
            total: historique.nb_total_questions,
            percentage: scorePercentage,
            timeSpent: timeSpent,
            correctAnswers: historique.nb_bonnes_reponses,
            wrongAnswers: historique.nb_total_questions - historique.nb_bonnes_reponses
        };
    };

    const stats = resultsData ? calculateStats() : null;

    if (loading) {
        return (
            <div className="valider-question-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement de la question...</p>
                </div>
            </div>
        );
    }

    if (showResults && stats) {
        return (
            <div className="valider-question-container">
                {/* Header avec fond gradient */}
                <div className="questionnaire-header">
                    <button className="btn-back" onClick={handleBack}>
                        <FaChevronLeft />
                        Retour
                    </button>
                    <div className="header-content">
                        <h1>Résultats du questionnaire</h1>
                        <p className="questionnaire-description">{resultsData.questionnaire.nom}</p>
                    </div>
                    <div className="progress-indicator">
                        Questionnaire terminé
                    </div>
                </div>

                <div className="question-content">
                    <div className="results-card">
                        {/* Carte de score principale */}
                        <div className={`results-score-main ${stats.percentage >= 70 ? 'success' : stats.percentage >= 50 ? 'warning' : 'danger'}`}>
                            <div className="results-score-circle">
                                <FaTrophy className="results-trophy-icon" />
                                <div className="results-score-percentage">{stats.percentage}%</div>
                            </div>
                            <div className="results-score-text">
                                <h2>Félicitations !</h2>
                                <p>Vous avez terminé le questionnaire</p>
                                <div className="results-score-detail">
                                    {stats.score} / {stats.total} bonnes réponses
                                </div>
                            </div>
                        </div>

                        {/* Statistiques détaillées */}
                        <div className="results-stats-grid">
                            <div className="results-stat-item">
                                <div className="results-stat-icon correct">
                                    <FaCheckCircle />
                                </div>
                                <div className="results-stat-info">
                                    <span className="results-stat-value">{stats.correctAnswers}</span>
                                    <span className="results-stat-label">Réponses correctes</span>
                                </div>
                            </div>

                            <div className="results-stat-item">
                                <div className="results-stat-icon wrong">
                                    <FaTimesCircle />
                                </div>
                                <div className="results-stat-info">
                                    <span className="results-stat-value">{stats.wrongAnswers}</span>
                                    <span className="results-stat-label">Réponses incorrectes</span>
                                </div>
                            </div>

                            <div className="results-stat-item">
                                <div className="results-stat-icon time">
                                    <FaClock />
                                </div>
                                <div className="results-stat-info">
                                    <span className="results-stat-value">{stats.timeSpent} min</span>
                                    <span className="results-stat-label">Temps passé</span>
                                </div>
                            </div>

                            <div className="results-stat-item">
                                <div className="results-stat-icon chart">
                                    <FaChartBar />
                                </div>
                                <div className="results-stat-info">
                                    <span className="results-stat-value">{stats.percentage}%</span>
                                    <span className="results-stat-label">Taux de réussite</span>
                                </div>
                            </div>
                        </div>

                        {/* Barre de progression détaillée */}
                        <div className="results-progress-breakdown">
                            <h3>Détail des résultats</h3>
                            <div className="results-progress-bars">
                                <div className="results-progress-item">
                                    <span>Correctes</span>
                                    <div className="results-progress-bar">
                                        <div
                                            className="results-progress-fill correct"
                                            style={{ width: `${(stats.correctAnswers / stats.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span>{stats.correctAnswers}</span>
                                </div>
                                <div className="results-progress-item">
                                    <span>Incorrectes</span>
                                    <div className="results-progress-bar">
                                        <div
                                            className="results-progress-fill wrong"
                                            style={{ width: `${(stats.wrongAnswers / stats.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span>{stats.wrongAnswers}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="results-actions">
                            <button className="results-btn-primary" onClick={handleViewDetails}>
                                <FaClipboardList />
                                Voir le détail des réponses
                            </button>
                            <button className="results-btn-secondary" onClick={handleViewHistorique}>
                                <FaHistory />
                                Voir mon historique
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!historique) return <div className="valider-question-container">Erreur de chargement</div>;

    const { question_actuelle } = historique.historique;
    const numero = historique.numero_question;
    const totalQuestions = historique.questionnaire.nb_total_questions;

    return (
        <div className="valider-question-container">
            {/* Header avec fond gradient */}
            <div className="questionnaire-header">
                <button className="btn-back" onClick={handleBack}>
                    <FaChevronLeft />
                    Retour
                </button>
                <div className="header-content">
                    <h1>{historique.questionnaire.nom}</h1>
                    <p className="questionnaire-description">{historique.questionnaire.description}</p>
                </div>
                <div className="progress-indicator">
                    Question {numero} sur {totalQuestions}
                </div>
            </div>

            <div className="question-content">
                <div className="question-card">
                    <div className="question-text">
                        <div className="question-number">Question {numero}</div>
                        <h2>{question_actuelle.description}</h2>
                    </div>

                    <div className="answers-section">
                        <h3>Sélectionnez une ou plusieurs réponses :</h3>
                        <div className="answers-list">
                            {[1, 2, 3, 4, 5].map(i => {
                                const key = `reponse_${i}`;
                                const reponse = question_actuelle[key];
                                return reponse ? (
                                    <div key={i} className="answer-option">
                                        <label className="answer-label">
                                            <input
                                                type="checkbox"
                                                checked={!!checked[i - 1]}
                                                onChange={() => handleCheckboxChange(i - 1)}
                                                disabled={validerDisabled}
                                            />
                                            <span className="checkmark"></span>
                                            <span className="answer-text">{reponse}</span>
                                        </label>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>

                    {feedback && (
                        <div className={`feedback-message ${feedback.correcte ? 'success' : 'error'}`}>
                            <div className="feedback-icon">
                                {feedback.correcte ? '✓' : '✗'}
                            </div>
                            <div className="feedback-content">
                                <h4>{feedback.correcte ? 'Bonne réponse!' : 'Réponse incorrecte'}</h4>
                                <p>{feedback.msg}</p>
                            </div>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button
                            className="btn-valider"
                            onClick={handleSubmit}
                            disabled={validerDisabled}
                        >
                            <FaCheck />
                            Valider la réponse
                        </button>

                        <button
                            className="btn-suivant"
                            onClick={handleNext}
                            disabled={suivantDisabled}
                        >
                            {feedback?.termine ? 'Voir les résultats' : 'Question suivante'}
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValiderQuestion;