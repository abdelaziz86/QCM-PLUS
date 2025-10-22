import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ValiderQuestion.css';

// Import icons
import { FaChevronLeft, FaCheck, FaTimes } from 'react-icons/fa';

const DetailHistorique = () => {
    const { historique_id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchHistoriqueDetaille = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/historique/detail/${historique_id}`);
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Erreur chargement historique détaillé', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoriqueDetaille();
    }, [historique_id]);

    const handleBack = () => {
        navigate('/historique');
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < data.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="valider-question-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (!data) return <div className="valider-question-container">Erreur de chargement</div>;

    const { historique, questionnaire, questions } = data;
    const currentQuestionData = questions[currentQuestionIndex];
    const question = currentQuestionData.question;

    // Convertir la réponse utilisateur en tableau de sélections
    const userSelections = currentQuestionData.reponse_utilisateur.split(',').map(Number);

    // Convertir la bonne réponse en tableau
    const correctSelections = (question.bonne_reponse || '').split(',').map(Number);

    return (
        <div className="valider-question-container">
            {/* Header with gradient background */}
            <div className="questionnaire-header">
                <button className="btn-back" onClick={handleBack}>
                    <FaChevronLeft />
                    Retour à l'historique
                </button>
                <div className="header-content">
                    <h1>Résultats: {questionnaire.nom}</h1>
                    <p className="questionnaire-description">{questionnaire.description}</p>
                </div>
                <div className="progress-indicator">
                    Score: {historique.nb_bonnes_reponses}/{historique.nb_total_questions}
                    ({Math.round((historique.nb_bonnes_reponses / historique.nb_total_questions) * 100)}%)
                </div>
            </div>

            <div className="question-content">
                <div className="question-card">
                    {/* Navigation entre questions */}
                    <div className="detail-navigation">
                        <button
                            className="nav-btn"
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            <FaChevronLeft />
                            Question précédente
                        </button>

                        <div className="question-counter">
                            Question {currentQuestionIndex + 1} sur {questions.length}
                        </div>

                        <button
                            className="nav-btn"
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === questions.length - 1}
                        >
                            Question suivante
                            <FaChevronLeft style={{ transform: 'rotate(180deg)' }} />
                        </button>
                    </div>

                    <div className="question-text">
                        <div className="question-number">Question {currentQuestionIndex + 1}</div>
                        <h2>{question.description}</h2>
                    </div>

                    <div className="answers-section">
                        <h3>Vos réponses :</h3>
                        <div className="answers-list">
                            {[1, 2, 3, 4, 5].map(i => {
                                const key = `reponse_${i}`;
                                const reponse = question[key];
                                const isSelected = userSelections[i - 1] === 1;
                                const isCorrect = correctSelections[i - 1] === 1;

                                if (!reponse) return null;

                                return (
                                    <div key={i} className={`answer-option ${isSelected ? 'selected' : ''}`}>
                                        <label className="answer-label">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                readOnly
                                            />
                                            <span className={`checkmark ${isSelected ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
                                                {isSelected && (
                                                    isCorrect ? <FaCheck className="check-icon" /> : <FaTimes className="check-icon" />
                                                )}
                                            </span>
                                            <span className="answer-text">{reponse}</span>
                                            {isSelected && (
                                                <span className="result-indicator">
                                                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                                </span>
                                            )}
                                            {!isSelected && isCorrect && (
                                                <span className="result-indicator correct-missed">
                                                    ✓ Réponse correcte manquée
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Résumé de la question */}
                    <div className={`question-summary ${currentQuestionData.est_correcte ? 'correct' : 'incorrect'}`}>
                        <div className="summary-icon">
                            {currentQuestionData.est_correcte ? <FaCheck /> : <FaTimes />}
                        </div>
                        <div className="summary-content">
                            <h4>{currentQuestionData.est_correcte ? 'Bonne réponse!' : 'Réponse incorrecte'}</h4>
                            <p>Vous avez répondu le {new Date(currentQuestionData.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailHistorique;