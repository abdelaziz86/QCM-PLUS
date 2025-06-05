import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/QuestionnairesPage.css';
import { AuthContext } from '../context/AuthContext';

const QuestionnairesPage = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/questionnaires')
            .then(res => setQuestionnaires(res.data))
            .catch(err => console.error('Erreur de chargement des questionnaires', err));
    }, []);

    const handleStartClick = async (questionnaire) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const res = await axios.get(`http://localhost:5000/api/historique/current`, {
                params: {
                    user_id: user.id,
                    questionnaire_id: questionnaire.id
                }
            });

            navigate('/start-questionnaire', {
                state: {
                    started: res.data.started ?? 1,
                    historique: res.data.historique,
                    numero_question: res.data.numero_question,
                    questionnaire: res.data.questionnaire ?? questionnaire
                }
            });
        } catch (err) {
            if (err.response?.status === 404) {
                // Not started yet
                navigate('/start-questionnaire', {
                    state: {
                        started: 0,
                        questionnaire
                    }
                });
            } else {
                console.error('Erreur lors de la vérification du questionnaire', err);
            }
        }
    };

    return (
        <div className="questionnaires-container">
            <h2>Liste des questionnaires</h2>
            <div className="cards-grid">
                {questionnaires.map(q => (
                    <div key={q.id} className="questionnaire-card">
                        <h3>📋 {q.nom}</h3>
                        <p>{q.description}</p>
                        <button className="demarrer-button" onClick={() => handleStartClick(q)}>
                            🚀 Démarrer
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionnairesPage;
