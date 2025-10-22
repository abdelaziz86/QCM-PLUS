import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/StartQuestionnaire.css';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import { FaPlay, FaRedo, FaHistory, FaTimes } from "react-icons/fa";

const StartQuestionnairePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { started, historique, numero_question, questionnaire } = location.state;

    const handleStart = async () => {
        if (started === 0) {
            try {
                await axios.post('http://localhost:5000/api/historique/start', {
                    user_id: user.id,
                    questionnaire_id: questionnaire.id,
                });
                navigate(`/valider-question/${questionnaire.id}`);
            } catch (error) {
                console.error("Erreur lors du démarrage du questionnaire :", error);
                alert("Une erreur est survenue lors du démarrage du questionnaire.");
            }
        } else if (historique?.termine) {
            navigate('/historique');
        } else {
            navigate(`/valider-question/${questionnaire.id}`);
        }
    };

    const handleGoToHistorique = () => {
        navigate('/historique');
    };

    const isFinished = historique?.termine;

    return (
        <div className="start-container">
            <div className="start-card">
                <div className="start-header">
                    <h2>{questionnaire.nom}</h2>
                    <p>{questionnaire.description}</p>
                </div>

                <div className="start-body">
                    {isFinished ? (
                        <>
                            <p className="finished-text">✅ Vous avez déjà terminé ce questionnaire.</p>
                            <div className="btn-group">
                                <button className="btn" onClick={handleGoToHistorique}>
                                    <FaHistory /> Consulter Historique
                                </button>
                            </div>
                        </>
                    ) : started === 0 ? (
                        <>
                            <p className="">  Voulez-vous commencer ce questionnaire maintenant ?</p>
                            <div className="btn-group">
                                <button className="btn" onClick={handleStart}>
                                    <FaPlay /> Commencer
                                </button>
                                <button className="btn" onClick={() => navigate(-1)}>
                                    <FaTimes /> Annuler
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="warning">⚠️ Vous avez déjà commencé ce questionnaire.</p>
                            <p className="progression">
                                Progression : Question {numero_question} sur {historique.nb_total_questions}
                            </p>
                            <p className="prompt">Souhaitez-vous reprendre là où vous vous êtes arrêté ?</p>
                            <div className="btn-group">
                                <button className="btn" onClick={handleStart}>
                                    <FaRedo /> Reprendre
                                </button>
                                <button className="btn" onClick={() => navigate(-1)}>
                                    <FaTimes /> Retour
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StartQuestionnairePage;
