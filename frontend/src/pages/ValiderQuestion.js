import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ValiderQuestion.css';
import { AuthContext } from '../context/AuthContext';

const ValiderQuestion = () => {
    const { user } = useContext(AuthContext);
    const { questionnaire_id } = useParams();
    const navigate = useNavigate();

    const [historique, setHistorique] = useState(null);
    const [checked, setChecked] = useState([0, 0, 0, 0, 0]);
    const [feedback, setFeedback] = useState(null); // holds message + correcte + termine
    const [validerDisabled, setValiderDisabled] = useState(false);
    const [suivantDisabled, setSuivantDisabled] = useState(true);

    const fetchQuestion = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/historique/current?user_id=${user.id}&questionnaire_id=${questionnaire_id}`);
            setHistorique(res.data);
            setChecked([0, 0, 0, 0, 0]);
            setFeedback(null);
            setValiderDisabled(false);
            setSuivantDisabled(true);
            console.log(res.data);
        } catch (err) {
            console.error('Erreur chargement question', err);
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
        } catch (err) {
            console.error('Erreur validation', err);
        }
    };

    const handleNext = async () => {
        if (feedback?.termine) {
            navigate('/historique');
        } else {
            await fetchQuestion();
        }
    };

    if (!historique) return <div className="valider-question-container">Chargement...</div>;

    const { question_actuelle } = historique.historique;
    const numero = historique.numero_question;

    return (
        <div className="valider-question-container">
            <h2>{historique.questionnaire.nom}</h2>
            <p className="questionnaire-description">{historique.questionnaire.description}</p>

            <div className="question-header">
                <button
                    className="btn-suivant"
                    onClick={handleNext}
                    disabled={suivantDisabled}
                >
                    ➡️ Suivant
                </button>
                <div className="question-text">
                    <strong>Question {numero} :</strong> {question_actuelle.description}
                </div>
            </div>



            <div className="answers-list">
                {[1, 2, 3, 4, 5].map(i => {
                    const key = `reponse_${i}`;
                    const reponse = question_actuelle[key];
                    return reponse ? (
                        <div key={i} className="answer-option">
                            <input
                                type="checkbox"
                                id={`reponse-${i}`}
                                checked={!!checked[i - 1]}
                                onChange={() => handleCheckboxChange(i - 1)}
                                disabled={validerDisabled}
                            />
                            <label htmlFor={`reponse-${i}`} className="answer-label">
                                {reponse}
                            </label>
                        </div>
                    ) : null;
                })}
            </div>

            {feedback && (
                <div className={`feedback-msg ${feedback.correcte ? 'success' : 'error'}`}>
                    {feedback.msg}
                </div>
            )}

            <div className="action-buttons">
                <button
                    className="btn-valider"
                    onClick={handleSubmit}
                    disabled={validerDisabled}
                >
                    ✅ Valider
                </button>
            </div>
        </div>
    );
};

export default ValiderQuestion;
