import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/StartQuestionnaire.css';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
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

                // After starting, redirect to the first question
                navigate(`/valider-question/${questionnaire.id}`);
            } catch (error) {
                console.error("Erreur lors du démarrage du questionnaire :", error);
                alert("Une erreur est survenue lors du démarrage du questionnaire.");
            }
        } else if (historique?.termine) {
            navigate('/historique');
        } else {
            // Resume in-progress questionnaire
            navigate(`/valider-question/${questionnaire.id}`);
        }
    };


    const handleGoToHistorique = () => {
        navigate('/historique');
    };

    const isFinished = historique?.termine;

    return (
        <div className="start-questionnaire-container">
            <h2 className="questionnaire-title">{questionnaire.nom}</h2>
            <p className="questionnaire-description">{questionnaire.description}</p>

            {isFinished ? (
                <>
                    <p className="already-finished-text">
                        ✅ Vous avez déjà terminé ce questionnaire.
                    </p>
                    <div className="start-questionnaire-buttons">
                        <button className="btn-historique" onClick={handleGoToHistorique}>
                            Consulter Historique
                        </button>
                    </div>
                </>
            ) : started === 0 ? (
                <>
                    <p className="prompt-text">
                        🟢 Est-ce que vous voulez commencer ce questionnaire maintenant ?
                    </p>
                    <div className="start-questionnaire-buttons">
                        <button className="btn-oui" onClick={handleStart}>Oui</button>
                        <button className="btn-non" onClick={() => navigate(-1)}>Non</button>
                    </div>
                </>
            ) : (
                <>
                    <p className="already-started-text">
                        ⚠️ Vous avez déjà commencé ce questionnaire.
                    </p>
                    <p className="progression">
                        Progression : Question {numero_question} sur {historique.nb_total_questions}
                    </p>
                    <p className="prompt-text">
                        Souhaitez-vous reprendre là où vous vous êtes arrêté ?
                    </p>
                    <div className="start-questionnaire-buttons">
                        <button className="btn-oui" onClick={handleStart}>Oui</button>
                        <button className="btn-retour" onClick={() => navigate(-1)}>Retour</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default StartQuestionnairePage;
