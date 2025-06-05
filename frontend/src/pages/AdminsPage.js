import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StagiairesPage.css';

const AdminsPage = () => {
    const [stagiaires, setStagiaires] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState({ nom: '', prenom: '', societe: '', email: '', password: '', confirmPassword: '', role: 'admin' });
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users?role=admin')
            .then(res => setStagiaires(res.data))
            .catch(err => console.error('Erreur chargement admins', err));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Est ce que vous etes sur de vouloir supprimer cet utilisateur ?')) {
            axios.delete(`http://localhost:5000/api/users/${id}`)
                .then(() => setStagiaires(prev => prev.filter(user => user.id !== id)))
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
                    setStagiaires(prev => prev.map(user => user.id === editingUser.id ? res.data.user : user));
                    resetDialog();
                })
                .catch(err => console.error('Erreur modification', err));
        } else {
            axios.post('http://localhost:5000/api/auth/register', formData)
                .then(res => {
                    axios.get('http://localhost:5000/api/users?role=admin')
                        .then(res => setStagiaires(res.data));
                    resetDialog();
                })
                .catch(err => console.error('Erreur création', err));
        }
    };

    const resetDialog = () => {
        setShowDialog(false);
        setEditingUser(null);
        setFormData({ nom: '', prenom: '', societe: '', email: '', password: '', confirmPassword: '', role: 'admin' });
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

    return (
        <div className="stagiaires-container">
            <div className="header">
                <h2>👥 Liste des Admins</h2>
                <button className="btn" onClick={() => setShowDialog(true)}>Créer</button>
            </div>

            <div className="stagiaires-list">
                {stagiaires.map(user => (
                    <div key={user.id} className="stagiaire-card">
                        <div className="stagiaire-info">
                            <h3>{user.nom} {user.prenom}</h3>
                            <p><strong>Société :</strong> {user.societe}</p>
                            <p><strong>Email :</strong> {user.email}</p>
                            <p><strong>Date de création :</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="stagiaire-actions">
                            <button className="btn-outline" onClick={() => openEditDialog(user)}>Modifier</button>
                            <button className="btn-danger" onClick={() => handleDelete(user.id)}>Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>

            {showDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <div className="dialog-header">
                            <h3>{editingUser ? 'Modifier Admin' : 'Créer un nouveau admin'}</h3>
                            <button className="btn-close" onClick={resetDialog}>X</button>
                        </div>
                        <div className="form-fields">
                            {['nom', 'prenom', 'societe', 'email'].map(field => (
                                <input
                                    key={field}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    type="text"
                                    value={formData[field]}
                                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                                />
                            ))}
                            <input
                                placeholder="Mot de passe"
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <input
                                placeholder="Confirmer le mot de passe"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            <button className="btn" onClick={handleSave}>{editingUser ? 'Modifier' : 'Créer'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminsPage;
