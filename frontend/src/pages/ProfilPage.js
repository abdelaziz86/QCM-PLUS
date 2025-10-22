import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProfilPage.css';
import { AuthContext } from '../context/AuthContext';
import {
    FaEdit,
    FaSave,
    FaTimes,
    FaUserCircle,
    FaEnvelope,
    FaBuilding,
    FaIdBadge,
    FaKey,
    FaCalendarAlt,
} from 'react-icons/fa';

const ProfilPage = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user?.id) {
            axios
                .get(`http://localhost:5000/api/users/${user.id}`)
                .then((res) => {
                    setUserData(res.data);
                    setFormData(res.data);
                })
                .catch((err) => console.error('Erreur lors du chargement du profil', err));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setFormData(userData);
        setPassword('');
        setConfirmPassword('');
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (password && password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }
        try {
            const payload = { ...formData };
            if (password) payload.password = password;

            await axios.put(`http://localhost:5000/api/users/${user.id}`, payload);
            setPassword('');
            setConfirmPassword('');
            setUserData(payload);
            setIsEditing(false);
            alert('✅ Profil mis à jour !');
        } catch (err) {
            console.error('Erreur de mise à jour', err);
            alert('❌ Erreur de mise à jour');
        }
    };

    const initials = (u) => {
        const fn = u?.prenom || '';
        const ln = u?.nom || '';
        return `${fn.charAt(0) || ''}${ln.charAt(0) || ''}`.toUpperCase();
    };

    if (!userData) return <div className="profil-container">Chargement...</div>;

    return (
        <div className="profil-container">
            <div className="profil-card">
                <div className="profil-header">
                    <div className="header-left">
                        <div className="avatar">
                            {userData.avatarUrl ? (
                                <img src={userData.avatarUrl} alt="avatar" />
                            ) : (
                                <div className="avatar-fallback">{initials(userData) || <FaUserCircle />}</div>
                            )}
                        </div>
                        <div className="header-texts">
                            <div className="welcome">
                                Bienvenue, <span className="user-name">{userData.prenom}</span>!
                            </div>
                            <div className="subtitle">Gérez vos informations personnelles</div>
                        </div>
                    </div>

                    <div className="header-actions">
                        {isEditing ? (
                            <>
                                <button className="btn btn-save" onClick={handleSave}>
                                    <FaSave className="btn-icon" /> Valider
                                </button>
                                <button className="btn btn-cancel" onClick={handleCancel}>
                                    <FaTimes className="btn-icon" /> Annuler
                                </button>
                            </>
                        ) : (
                            <button className="btn " onClick={() => setIsEditing(true)}>
                                <FaEdit className="btn-icon" /> Modifier
                            </button>
                        )}
                    </div>
                </div>

                <div className="profil-body">
                    <div className="profil-grid">
                        <div className="profil-field">
                            <div className="label">
                                <FaIdBadge className="label-icon" /> Nom
                            </div>
                            <div className="value">
                                {isEditing ? (
                                    <input name="nom" value={formData.nom || ''} onChange={handleChange} />
                                ) : (
                                    userData.nom
                                )}
                            </div>
                        </div>

                        <div className="profil-field">
                            <div className="label">
                                <FaUserCircle className="label-icon" /> Prénom
                            </div>
                            <div className="value">
                                {isEditing ? (
                                    <input name="prenom" value={formData.prenom || ''} onChange={handleChange} />
                                ) : (
                                    userData.prenom
                                )}
                            </div>
                        </div>

                        <div className="profil-field">
                            <div className="label">
                                <FaBuilding className="label-icon" /> Société
                            </div>
                            <div className="value">
                                {isEditing ? (
                                    <input name="societe" value={formData.societe || ''} onChange={handleChange} />
                                ) : (
                                    userData.societe
                                )}
                            </div>
                        </div>

                        <div className="profil-field">
                            <div className="label">
                                <FaEnvelope className="label-icon" /> Email
                            </div>
                            <div className="value">
                                {isEditing ? (
                                    <input name="email" value={formData.email || ''} onChange={handleChange} />
                                ) : (
                                    userData.email
                                )}
                            </div>
                        </div>

                        <div className="profil-field">
                            <div className="label">
                                <FaIdBadge className="label-icon" /> Rôle
                            </div>
                            <div className="value">{userData.role}</div>
                        </div>

                        {isEditing && (
                            <>
                                <div className="profil-field">
                                    <div className="label">
                                        <FaKey className="label-icon" /> Mot de passe
                                    </div>
                                    <div className="value">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Laisser vide pour ne pas changer"
                                        />
                                    </div>
                                </div>

                                <div className="profil-field">
                                    <div className="label">
                                        <FaKey className="label-icon" /> Confirmer mot de passe
                                    </div>
                                    <div className="value">
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Répétez le mot de passe"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="profil-field">
                            <div className="label">
                                <FaCalendarAlt className="label-icon" /> Compte créé le
                            </div>
                            <div className="value">{new Date(userData.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilPage;
