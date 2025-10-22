import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/QuestionnairesPage.css";
import { AuthContext } from "../context/AuthContext";
import {
    FileText,
    Pencil,
    Trash,
    ListChecks,
    Play,
    Plus,
    X,
    Clock
} from "lucide-react";

const QuestionnairesPage = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [formData, setFormData] = useState({ nom: "", description: "" });
    const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
    const [deletingQuestionnaire, setDeletingQuestionnaire] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/questionnaires")
            .then((res) => {
                const withTime = res.data.map((q) => ({
                    ...q,
                    avgTime: Math.floor(Math.random() * 11) + 10
                }));
                setQuestionnaires(withTime);
            })
            .catch((err) =>
                console.error("Erreur de chargement des questionnaires", err)
            );
    }, []);

    const handleStartClick = async (questionnaire) => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            const res = await axios.get(
                `http://localhost:5000/api/historique/current`,
                {
                    params: { user_id: user.id, questionnaire_id: questionnaire.id }
                }
            );
            navigate("/start-questionnaire", {
                state: {
                    started: res.data.started ?? 1,
                    historique: res.data.historique,
                    numero_question: res.data.numero_question,
                    questionnaire: res.data.questionnaire ?? questionnaire
                }
            });
        } catch (err) {
            if (err.response?.status === 404) {
                navigate("/start-questionnaire", { state: { started: 0, questionnaire } });
            } else {
                console.error("Erreur vérification questionnaire", err);
            }
        }
    };

    const openEditDialog = (q) => {
        setEditingQuestionnaire(q);
        setFormData({ nom: q.nom, description: q.description });
        setShowEditDialog(true);
    };

    const handleCreate = () => {
        axios
            .post("http://localhost:5000/api/questionnaires", formData)
            .then((res) => {
                setQuestionnaires((prev) => [
                    ...prev,
                    { ...res.data.questionnaire, avgTime: Math.floor(Math.random() * 11) + 10 }
                ]);
                setShowCreateDialog(false);
                setFormData({ nom: "", description: "" });
            })
            .catch((err) => console.error("Erreur création questionnaire", err));
    };

    const handleUpdate = () => {
        axios
            .put(
                `http://localhost:5000/api/questionnaires/${editingQuestionnaire.id}`,
                formData
            )
            .then((res) => {
                setQuestionnaires((prev) =>
                    prev.map((q) =>
                        q.id === editingQuestionnaire.id
                            ? { ...res.data.questionnaire, avgTime: q.avgTime }
                            : q
                    )
                );
                setShowEditDialog(false);
                setEditingQuestionnaire(null);
            })
            .catch((err) => console.error("Erreur mise à jour questionnaire", err));
    };

    const openDeleteDialog = (q) => {
        setDeletingQuestionnaire(q);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        axios
            .delete(`http://localhost:5000/api/questionnaires/${deletingQuestionnaire.id}`)
            .then(() => {
                setQuestionnaires((prev) =>
                    prev.filter((q) => q.id !== deletingQuestionnaire.id)
                );
                setShowDeleteDialog(false);
                setDeletingQuestionnaire(null);
            })
            .catch((err) => console.error("Erreur suppression questionnaire", err));
    };

    return (
        <div className="questionnaires-page">
            {/* Hero Section */}
            <header className="hero-section">
                <h1>Bienvenue sur QCM+</h1>
                <p>
                    Explorez, gérez et démarrez différents questionnaires adaptés à vos besoins.
                    Que vous soyez un administrateur ou un utilisateur, chaque questionnaire vous aide à progresser.
                </p>
                {(user?.role === "admin" || user?.role === "superadmin") && (
                    <button
                        className="btn main-btn"
                        onClick={() => {
                            setFormData({ nom: "", description: "" });
                            setShowCreateDialog(true);
                        }}
                    >
                        <Plus size={18} />
                        Créer un questionnaire
                    </button>
                )}
            </header>

            {/* Cards */}
            <div className="cards-container">
                {questionnaires.map((q) => (
                    <div key={q.id} className="card">
                        <div className="card-header">
                            <FileText size={22} className="card-icon" />
                            <h3>{q.nom}</h3>
                        </div>
                        <div className="card-body">
                            <p>{q.description}</p>
                            <p className="avg-time">
                                <Clock size={16} /> Temps moyen estimé : {q.avgTime} minutes
                            </p>
                        </div>
                        <div className="card-footer">
                            {user?.role === "admin" || user?.role === "superadmin" ? (
                                <>
                                    <button className="btn outline-btn" onClick={() => openEditDialog(q)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="btn outline-btn" onClick={() => openDeleteDialog(q)}>
                                        <Trash size={16} />
                                    </button>
                                    <button className="btn outline-btn" onClick={() => navigate(`/questions/${q.id}`)}>
                                        <ListChecks size={16} /> Questions
                                    </button>
                                </>
                            ) : (
                                <button className="btn main-btn" onClick={() => handleStartClick(q)}>
                                    <Play size={16} /> Démarrer
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dialogs */}
            {showEditDialog && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <div className="dialog-header">
                            <h3>Modifier le questionnaire</h3>
                            <button className="close-btn" onClick={() => setShowEditDialog(false)}>
                                <X />
                            </button>
                        </div>
                        <div className="dialog-content">
                            <input
                                type="text"
                                placeholder="Nom"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                className="dialog-input"
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="dialog-textarea"
                                rows="4"
                            />
                        </div>
                        <div className="dialog-actions">
                            <button className="btn outline-btn" onClick={() => setShowEditDialog(false)}>Annuler</button>
                            <button className="btn main-btn" onClick={handleUpdate}>Modifier</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteDialog && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <div className="dialog-header">
                            <h3>Supprimer le questionnaire</h3>
                            <button className="close-btn" onClick={() => setShowDeleteDialog(false)}>
                                <X />
                            </button>
                        </div>
                        <div className="dialog-content">
                            <p>Êtes-vous sûr de vouloir supprimer <strong>{deletingQuestionnaire?.nom}</strong> ?</p>
                        </div>
                        <div className="dialog-actions">
                            <button className="btn outline-btn" onClick={() => setShowDeleteDialog(false)}>Annuler</button>
                            <button className="btn danger-btn" onClick={handleDelete}>Supprimer</button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateDialog && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <div className="dialog-header">
                            <h3>Créer un questionnaire</h3>
                            <button className="close-btn" onClick={() => setShowCreateDialog(false)}>
                                <X />
                            </button>
                        </div>
                        <div className="dialog-content">
                            <input
                                type="text"
                                placeholder="Nom"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                className="dialog-input"
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="dialog-textarea"
                                rows="4"
                            />
                        </div>
                        <div className="dialog-actions">
                            <button className="btn outline-btn" onClick={() => setShowCreateDialog(false)}>Annuler</button>
                            <button className="btn main-btn" onClick={handleCreate}>Créer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionnairesPage;