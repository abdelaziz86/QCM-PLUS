import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

// Importing icons (you'll need to install react-icons: npm install react-icons)
import {
    FaHome,
    FaHistory,
    FaUser,
    FaUserGraduate,
    FaUserShield,
    FaSignInAlt,
    FaSignOutAlt,
    FaBars,
    FaTimes
} from 'react-icons/fa';

const Navbar = () => {
    const { isAuthenticated, role } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-brand">
                        <Link to="/" className="brand-link">
                            <span className="brand-text">QCM+</span>
                        </Link>
                    </div>

                    <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                        <div className="navbar-left">
                            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                <FaHome className="nav-icon" />
                                <span className="nav-text">Questionnaires</span>
                            </Link>
                            {isAuthenticated && role === 'stagiaire' && (
                                <Link to="/historique" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaHistory className="nav-icon" />
                                    <span className="nav-text">Historique</span>
                                </Link>
                            )}
                            {isAuthenticated && (
                                <Link to="/profil" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaUser className="nav-icon" />
                                    <span className="nav-text">Profil</span>
                                </Link>
                            )}
                            {isAuthenticated && (role === 'admin' || role === 'superadmin') && (
                                <Link to="/stagiaires" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaUserGraduate className="nav-icon" />
                                    <span className="nav-text">Stagiaires</span>
                                </Link>
                            )}
                            {isAuthenticated && role === 'superadmin' && (
                                <Link to="/admins" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaUserShield className="nav-icon" />
                                    <span className="nav-text">Admins</span>
                                </Link>
                            )}
                        </div>
                        <div className="navbar-right">
                            {!isAuthenticated ? (
                                <Link to="/login" className="nav-link login-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaSignInAlt className="nav-icon" />
                                    <span className="nav-text">Connexion</span>
                                </Link>
                            ) : (
                                <Link to="/logout" className="nav-link logout-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FaSignOutAlt className="nav-icon" />
                                    <span className="nav-text">Déconnexion</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>
            </nav>
            {isMobileMenuOpen && <div className="navbar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
        </>
    );
};

export default Navbar;