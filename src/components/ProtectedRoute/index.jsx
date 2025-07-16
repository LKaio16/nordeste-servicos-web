import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Opcional: verificação de perfil/role
    // if (requiredRole && user?.perfil !== requiredRole) {
    //     return <Navigate to="/admin/unauthorized" replace />;
    // }

    return children;
};

export default ProtectedRoute; 