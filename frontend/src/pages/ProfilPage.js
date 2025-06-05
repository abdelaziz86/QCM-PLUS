import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProfilPage.css';
import { AuthContext } from '../context/AuthContext';
import { FaEdit, FaSave } from 'react-icons/fa';

const ProfilPage = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user?.id) {
            axios.get(`http://localhost:5000/api/users/${user.id}`)
                .then(res => {
                    setUserData(res.data);
                    setFormData(res.data);
                })
                .catch(err => console.error("Erreur lors du chargement du profil", err));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (password && password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/users/${user.id}`, formData);
            setPassword('');
            setConfirmPassword('');
            setUserData(formData);
            setIsEditing(false);
            alert("✅ Profil mis à jour !");
        } catch (err) {
            console.error("Erreur de mise à jour", err);
            alert("❌ Erreur de mise à jour");
        }
    };

    if (!userData) return <div className="profil-container">Chargement...</div>;

    return (
        <div className="profil-container">
            <h2>👋 Bienvenue {userData.prenom} !</h2>
            <div className="profil-card">
                <div className="profil-header">
                    <h3>Mon profil</h3>
                    {isEditing ? (
                        <button className="btn btn-save" onClick={handleSave}>
                            <FaSave className="btn-icon" /> Valider
                        </button>
                    ) : (
                        <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
                            <FaEdit className="btn-icon" /> Modifier
                        </button>
                    )}


                </div>
                <div className="profil-field"><strong>Nom :</strong>
                    {isEditing ? <input name="nom" value={formData.nom} onChange={handleChange} /> : userData.nom}
                </div>
                <div className="profil-field"><strong>Prénom :</strong>
                    {isEditing ? <input name="prenom" value={formData.prenom} onChange={handleChange} /> : userData.prenom}
                </div>
                <div className="profil-field"><strong>Société :</strong>
                    {isEditing ? <input name="societe" value={formData.societe} onChange={handleChange} /> : userData.societe}
                </div>
                <div className="profil-field"><strong>Email :</strong>
                    {isEditing ? <input name="email" value={formData.email} onChange={handleChange} /> : userData.email}
                </div>
                <div className="profil-field"><strong>Rôle :</strong> {userData.role}</div>
                {isEditing &&
                    <>
                        <div className="profil-field">
                            <strong>Mot de passe :</strong>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Laisser vide pour ne pas changer"
                            />
                        </div>
                        <div className="profil-field">
                            <label>Confirmer mot de passe :</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Répétez le mot de passe"
                            />
                        </div>
                    </>

                }
                <div className="profil-field"><strong>Créé le :</strong> {new Date(userData.created_at).toLocaleDateString()}</div>

            </div>
        </div>
    );
};

export default ProfilPage;
