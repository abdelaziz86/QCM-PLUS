// src/pages/Logout.js
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Logout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        logout(); // Clear context + localStorage
        navigate('/login'); // Redirect to login page
    }, [logout, navigate]);

    return null; // No UI needed
};

export default Logout;
