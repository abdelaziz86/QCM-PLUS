import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as needed

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Get the login function from context

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            // Use the login function from context instead of setUser
            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            alert(err.response?.data?.msg || 'Erreur de connexion');
        }
    };

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleLogin}>
                <h2>Connexion</h2>
                <input
                    type="email"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default LoginPage;