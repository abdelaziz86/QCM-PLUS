import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
    const { isAuthenticated, role } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/">Questionnaires</Link>
                {isAuthenticated && role === 'stagiaire' && <Link to="/historique">Historique</Link>}
                {isAuthenticated && <Link to="/profil">Profil</Link>}
                {isAuthenticated && (role === 'admin' || role === 'superadmin') && <Link to="/stagiaires">Stagiaires</Link>}
                {isAuthenticated && role === 'superadmin' && <Link to="/admins">Admins</Link>}
            </div>
            <div className="navbar-right">
                {!isAuthenticated
                    ? <Link to="/login">Login</Link>
                    : <Link to="/logout">Logout</Link>
                }
            </div>
        </nav>
    );
};

export default Navbar;
