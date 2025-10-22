import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StagiairesPage.css';

// Import icons
import {
    FaUsers,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaBuilding,
    FaEnvelope,
    FaCalendar,
    FaUserShield
} from 'react-icons/fa';

const AdminsPage = () => {
    const [admins, setAdmins] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        societe: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin'
    });
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/users?role=admin')
            .then(res => {
                setAdmins(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Erreur chargement admins', err);
                setLoading(false);
            });
    };

    const handleDelete = (id, nom, prenom) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${prenom} ${nom} ?`)) {
            axios.delete(`http://localhost:5000/api/users/${id}`)
                .then(() => {
                    setAdmins(prev => prev.filter(user => user.id !== id));
                })
                .catch(err => console.error('Erreur suppression', err));
        }
    };

    const handleSave = () => {
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        if (editingUser) {
            axios.put(`http://localhost:5000/api/users/${editingUser.id}`, formData)
                .then(res => {
                    setAdmins(prev => prev.map(user => user.id === editingUser.id ? res.data.user : user));
                    resetDialog();
                })
                .catch(err => console.error('Erreur modification', err));
        } else {
            axios.post('http://localhost:5000/api/auth/register', formData)
                .then(() => {
                    fetchAdmins();
                    resetDialog();
                })
                .catch(err => console.error('Erreur création', err));
        }
    };

    const resetDialog = () => {
        setShowDialog(false);
        setEditingUser(null);
        setFormData({
            nom: '',
            prenom: '',
            societe: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'admin'
        });
    };

    const openEditDialog = (user) => {
        setEditingUser(user);
        setFormData({
            nom: user.nom,
            prenom: user.prenom,
            societe: user.societe,
            email: user.email,
            password: '',
            confirmPassword: '',
            role: user.role || 'admin'
        });
        setShowDialog(true);
    };

    if (loading) {
        return (
            <div className="stagiaires-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement des administrateurs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stagiaires-container">
            {/* Header with gradient background */}
            <header className="page-header-gradient">
                <div className="header-content">
                    <div className="header-text">
                        <h1><FaUserShield className="header-icon" /> Gestion des Administrateurs</h1>
                        <p>Gérez les comptes administrateurs de votre organisation</p>
                    </div>
                    <button className="btn-create" onClick={() => setShowDialog(true)}>
                        <FaPlus />
                        Nouvel Administrateur
                    </button>
                </div>
            </header>

            <div className="main-content">
                {admins.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <FaUserShield />
                        </div>
                        <h3>Aucun administrateur enregistré</h3>
                        <p>Commencez par créer votre premier administrateur</p>
                        <button className="btn-primary" onClick={() => setShowDialog(true)}>
                            Créer un administrateur
                        </button>
                    </div>
                ) : (
                    <div className="stagiaires-grid">
                        {admins.map(user => (
                            <div key={user.id} className="stagiaire-card">
                                <div className="card-header">
                                    <h3>{user.prenom} {user.nom}</h3>
                                    <div className="card-actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => openEditDialog(user)}
                                            title="Modifier"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(user.id, user.nom, user.prenom)}
                                            title="Supprimer"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="user-info">
                                        <div className="info-item">
                                            <FaBuilding className="info-icon" />
                                            <span>{user.societe || 'Non spécifiée'}</span>
                                        </div>
                                        <div className="info-item">
                                            <FaEnvelope className="info-icon" />
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="info-item">
                                            <FaCalendar className="info-icon" />
                                            <span>Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            {showDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <div className="dialog-header">
                            <h3>{editingUser ? 'Modifier l\'administrateur' : 'Créer un nouvel administrateur'}</h3>
                            <button className="btn-close" onClick={resetDialog}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="dialog-content">
                            <div className="form-grid">
                                {['nom', 'prenom', 'societe', 'email'].map(field => (
                                    <div key={field} className="form-group">
                                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        <input
                                            type="text"
                                            value={formData[field]}
                                            onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                                            placeholder={`Entrez le ${field}`}
                                        />
                                    </div>
                                ))}

                                <div className="form-group">
                                    <label>Mot de passe</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Entrez le mot de passe"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirmer le mot de passe</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Confirmez le mot de passe"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="dialog-actions">
                            <button className="btn-cancel" onClick={resetDialog}>
                                Annuler
                            </button>
                            <button className="btn-save" onClick={handleSave}>
                                {editingUser ? 'Modifier' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminsPage;