import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import './styles/theme.css';

const App = () => {
    return (
        <Router>
            <Navbar />
            <AppRoutes />
        </Router>
    );
};

export default App;
