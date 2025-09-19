import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../Spinner';
import { PageContainer } from '../../styles/common';

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Mostra o spinner enquanto está carregando a autenticação
    if (isLoading) {
        return (
            <PageContainer>
                <Spinner />
            </PageContainer>
        );
    }

    // Se não está autenticado, redireciona para o login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Se está autenticado, renderiza o conteúdo protegido
    return children;
}

export default ProtectedRoute; 