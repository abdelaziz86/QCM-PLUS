import React, { useEffect, useState } from 'react';
import '../styles/QuestionsPage.css';
import { useParams } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaQuestionCircle } from 'react-icons/fa';

const QuestionsPage = () => {
    const { id } = useParams();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestionnaire();
    }, [id]);

    const fetchQuestionnaire = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/questionnaires/${id}`);
            const data = await res.json();
            setQuestionnaire(data);
        } catch (error) {
            console.error('Error fetching questionnaire:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseBonneReponse = (bonne_reponse) => {
        if (!bonne_reponse) return [];
        if (bonne_reponse.includes(',')) {
            return bonne_reponse.split(',').map(val => val.trim() === '1');
        }
        const index = parseInt(bonne_reponse);
        return isNaN(index) ? [] : Array(5).fill(false).map((_, i) => i + 1 === index);
    };

    const handleModifier = (question) => {
        setCurrentQuestion({ ...question });
        setSelectedAnswers(parseBonneReponse(question.bonne_reponse));
        setIsAddMode(false);
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentQuestion({
            description: '',
            reponse_1: '',
            reponse_2: '',
            reponse_3: '',
            reponse_4: '',
            reponse_5: '',
            bonne_reponse: '0,0,0,0,0'
        });
        setSelectedAnswers([false, false, false, false, false]);
        setIsAddMode(true);
        setShowModal(true);
    };

    const handleCheckboxChange = (index) => {
        setSelectedAnswers(prev =>
            prev.map((val, i) => (i === index ? !val : val))
        );
    };

    const handleInputChange = (e, index) => {
        const field = `reponse_${index + 1}`;
        setCurrentQuestion(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleDescriptionChange = (e) => {
        setCurrentQuestion(prev => ({
            ...prev,
            description: e.target.value
        }));
    };

    const handleCloseModal = () => {
        setCurrentQuestion(null);
        setSelectedAnswers([]);
        setShowModal(false);
        setIsAddMode(false);
    };

    const handleSave = async () => {
        const bonne_reponse = selectedAnswers.map(a => (a ? 1 : 0)).join(',');
        const body = {
            ...currentQuestion,
            bonne_reponse,
        };

        try {
            if (isAddMode) {
                await fetch(`http://localhost:5000/api/question/${id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
            } else {
                await fetch(`http://localhost:5000/api/question/${currentQuestion.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
            }

            await fetchQuestionnaire();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving question:', error);
        }
    };

    const handleDeleteConfirm = (id) => {
        setQuestionToDelete(id);
    };

    const handleDelete = async () => {
        try {
            await fetch(`http://localhost:5000/api/question/${questionToDelete}`, {
                method: 'DELETE'
            });
            await fetchQuestionnaire();
            setQuestionToDelete(null);
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    if (loading) {
        return (
            <div className="questions-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement du questionnaire...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="questions-container">
            {questionnaire ? (
                <>
                    {/* Header with gradient background */}
                    <header className="page-header-gradient">
                        <div className="header-content">
                            <div className="header-text">
                                <h1><FaQuestionCircle className="header-icon" /> {questionnaire.nom}</h1>
                                <p>{questionnaire.description}</p>
                            </div>
                            <button className="btn-create" onClick={handleAdd}>
                                <FaPlus />
                                Ajouter Question
                            </button>
                        </div>
                    </header>

                    <div className="main-content">
                        {questionnaire.questions.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <FaQuestionCircle />
                                </div>
                                <h3>Aucune question disponible</h3>
                                <p>Commencez par créer votre première question</p>
                                <button className="btn-primary" onClick={handleAdd}>
                                    Créer une question
                                </button>
                            </div>
                        ) : (
                            <div className="questions-grid">
                                {questionnaire.questions.map((question, index) => {
                                    const reps = [
                                        question.reponse_1,
                                        question.reponse_2,
                                        question.reponse_3,
                                        question.reponse_4,
                                        question.reponse_5
                                    ];
                                    const correct = parseBonneReponse(question.bonne_reponse);

                                    return (
                                        <div key={question.id} className="question-card">
                                            <div className="card-header">
                                                <h3>Question {index + 1}</h3>
                                                <div className="card-actions">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleModifier(question)}
                                                        title="Modifier"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDeleteConfirm(question.id)}
                                                        title="Supprimer"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="card-body">
                                                <p className="question-description">{question.description}</p>
                                                <div className="responses-list">
                                                    {reps.map((rep, i) =>
                                                        rep ? (
                                                            <div
                                                                key={i}
                                                                className={`response-item ${correct[i] ? 'correct' : ''}`}
                                                            >
                                                                {rep}
                                                            </div>
                                                        ) : null
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Add/Edit Modal */}
                    {showModal && currentQuestion && (
                        <div className="dialog-overlay">
                            <div className="dialog-box">
                                <div className="dialog-header">
                                    <h3>{isAddMode ? 'Ajouter une question' : 'Modifier la question'}</h3>
                                    <button className="btn-close" onClick={handleCloseModal}>
                                        <FaTimes />
                                    </button>
                                </div>

                                <div className="dialog-content">
                                    <div className="form-group">
                                        <label>Énoncé de la question</label>
                                        <input
                                            type="text"
                                            value={currentQuestion.description}
                                            onChange={handleDescriptionChange}
                                            placeholder="Entrez l'énoncé de la question"
                                            className="description-input"
                                        />
                                    </div>

                                    <div className="form-grid">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="form-group response-input-group">
                                                <div className="checkbox-container">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAnswers[i] || false}
                                                        onChange={() => handleCheckboxChange(i)}
                                                        id={`correct-${i}`}
                                                    />
                                                    <label htmlFor={`correct-${i}`} className="checkbox-label">
                                                        Réponse correcte
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={currentQuestion[`reponse_${i + 1}`] || ''}
                                                    onChange={(e) => handleInputChange(e, i)}
                                                    placeholder={`Réponse ${i + 1}`}
                                                    className="response-input"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="dialog-actions">
                                    <button className="btn-cancel" onClick={handleCloseModal}>
                                        Annuler
                                    </button>
                                    <button className="btn-save" onClick={handleSave}>
                                        <FaSave className="btn-icon" />
                                        {isAddMode ? 'Créer' : 'Modifier'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {questionToDelete && (
                        <div className="dialog-overlay">
                            <div className="dialog-box">
                                <div className="dialog-header">
                                    <h3>Confirmer la suppression</h3>
                                    <button className="btn-close" onClick={() => setQuestionToDelete(null)}>
                                        <FaTimes />
                                    </button>
                                </div>

                                <div className="dialog-content">
                                    <p>Êtes-vous sûr de vouloir supprimer cette question ?</p>
                                </div>

                                <div className="dialog-actions">
                                    <button className="btn-cancel" onClick={() => setQuestionToDelete(null)}>
                                        Annuler
                                    </button>
                                    <button className="btn-delete-confirm" onClick={handleDelete}>
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">
                        <FaQuestionCircle />
                    </div>
                    <h3>Questionnaire non trouvé</h3>
                    <p>Le questionnaire que vous recherchez n'existe pas ou a été supprimé.</p>
                </div>
            )}
        </div>
    );
};

export default QuestionsPage;