import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/HistoriquePage.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HistoriquePage = () => {
    const { user } = useContext(AuthContext);
    const [historique, setHistorique] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        if (user?.id) {
            axios.get(`http://localhost:5000/api/historique/user/${user.id}`)
                .then(res => setHistorique(res.data))
                .catch(err => console.error("Erreur lors du chargement de l'historique", err));

        }
    }, [user]);

    const getProgressPercentage = (done, total) => {
        return Math.round((done / total) * 100);
    };

    return (
        <div className="historique-container">
            <h2>📜 Mon Historique de Questionnaires</h2>
            {historique.length === 0 ? (
                <p>Aucun questionnaire commencé pour le moment.</p>
            ) : (
                <div className="historique-list">
                    {historique.map((item) => {

                        const questionsDone = item.numero_question - item.nb_questions_restantes;
                        const progress = getProgressPercentage(item.nb_bonnes_reponses, item.nb_total_questions);
                        const score = item.termine
                            ? `${getProgressPercentage(item.nb_bonnes_reponses, item.nb_total_questions)}%`
                            : '🕐 En cours...';

                        return (
                            <div key={item.id} className="historique-item">
                                <div className="questionnaire-info">
                                    <h3>📝 {item.questionnaire.nom}</h3>
                                    <p>{item.questionnaire.description}</p>
                                    <br></br>
                                    <p><strong>📅 Début :</strong> {new Date(item.date_debut).toLocaleString()}</p>
                                    <p><strong>📈 Progression :</strong> {item.numero_question}  / {item.nb_total_questions}</p>
                                    <p><strong>✅ Bonnes Réponses :</strong> {item.nb_bonnes_reponses}  / {item.nb_total_questions}</p>
                                    <p><strong>🎯 Score :</strong> {score}</p>
                                </div>
                                <div className="historique-status">
                                    {item.termine ? (
                                        <span className="status done">✅ Terminé</span>
                                    ) : (
                                        <button className="btn-resume" onClick={() => navigate(`/valider-question/${item.questionnaire_id}`)}>
                                            Reprendre
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
