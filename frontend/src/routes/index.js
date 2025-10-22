import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import QuestionnairesPage from '../pages/QuestionnairesPage';
import HistoriquePage from '../pages/HistoriquePage';
import ProfilPage from '../pages/ProfilPage';
import StagiairesPage from '../pages/StagiairesPage';
import NotFoundPage from '../pages/NotFoundPage';
import { AuthContext } from '../context/AuthContext';
import Logout from "../pages/Logout";
import ValiderQuestion from '../pages/ValiderQuestion'; // ✅ Import added
import StartQuestionnairePage from '../pages/StartQuestionnairePage'; // ✅ Import added
import QuestionsPage from '../pages/QuestionsPage'; // ✅ Import added
import AdminsPage from '../pages/AdminsPage'; // ✅ Import added
import DetailHistorique from '../pages/DetailHistorique'; // ✅ Import added

const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<QuestionnairesPage />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/historique" element={user?.role?.toLowerCase() === 'stagiaire' ? <HistoriquePage /> : <Navigate to="/login" />} />
            <Route path="/profil" element={user ? <ProfilPage /> : <Navigate to="/login" />} />
            <Route path="/stagiaires" element={(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin') ? <StagiairesPage /> : <Navigate to="/login" />} />
            <Route path="/admins" element={user?.role?.toLowerCase() === 'superadmin' ? <AdminsPage /> : <Navigate to="/login" />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/valider-question/:questionnaire_id" element={user ? <ValiderQuestion /> : <Navigate to="/login" />} /> {/* ✅ New route */}
            <Route path="/start-questionnaire" element={<StartQuestionnairePage />} />
            <Route path="/questions/:id" element={<QuestionsPage />} />
            <Route path="/historique/detail/:historique_id" element={<DetailHistorique />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
