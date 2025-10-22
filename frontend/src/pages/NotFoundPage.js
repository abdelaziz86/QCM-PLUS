import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/NotFound.css";

// Import icons
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-icon">
                    <FaExclamationTriangle />
                </div>

                <h1 className="not-found-title">404</h1>

                <h2 className="not-found-subtitle">Page non trouvée</h2>

                <p className="not-found-message">
                    Désolé, la page que vous recherchez semble introuvable.
                    Elle a peut-être été déplacée, supprimée ou n'a jamais existé.
                </p>

                <div className="not-found-suggestions">
                    <h3>Que pouvez-vous faire ?</h3>
                    <ul>
                        <li>Vérifiez l'URL pour d'éventuelles erreurs de frappe</li>
                        <li>Retournez à la page précédente</li>
                        <li>Visitez notre page d'accueil</li>
                        <li>Contactez notre support si le problème persiste</li>
                    </ul>
                </div>

                <div className="not-found-actions">
                    <button
                        className="not-found-btn primary"
                        onClick={handleGoBack}
                    >
                        <FaSearch />
                        Retour en arrière
                    </button>

                    <button
                        className="not-found-btn secondary"
                        onClick={handleGoHome}
                    >
                        <FaHome />
                        Page d'accueil
                    </button>
                </div>

                <div className="not-found-search">
                    <p>Ou essayez une recherche :</p>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Rechercher sur le site..."
                            className="search-input"
                        />
                        <button className="search-btn">
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>

            <div className="not-found-background">
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                <div className="bg-shape shape-3"></div>
            </div>
        </div>
    );
};

export default NotFoundPage;