import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import ClienteCreate from './pages/ClienteCreate';
import ClienteEdit from './pages/ClienteEdit';
import ClienteDetail from './pages/ClienteDetail';
import Equipamentos from './pages/Equipamentos';
import EquipamentoCreate from './pages/EquipamentoCreate';
import EquipamentoEdit from './pages/EquipamentoEdit';
import EquipamentoDetail from './pages/EquipamentoDetail';
import Orcamentos from './pages/Orcamentos';
import OrcamentoCreate from './pages/OrcamentoCreate';
import OrcamentoEdit from './pages/OrcamentoEdit';
import OrcamentoDetail from './pages/OrcamentoDetail';
import OrdensServico from './pages/OrdensServico';
import OrdemServicoCreate from './pages/OrdemServicoCreate';
import OrdemServicoEdit from './pages/OrdemServicoEdit';
import OrdemServicoDetail from './pages/OrdemServicoDetail';
import Usuarios from './pages/Usuarios';
import UsuarioCreate from './pages/UsuarioCreate';
import UsuarioEdit from './pages/UsuarioEdit';
import UsuarioDetail from './pages/UsuarioDetail';
import TiposServico from './pages/Servicos';
import ServicoCreate from './pages/ServicoCreate';
import ServicoEdit from './pages/ServicoEdit';
import PerfilPage from './pages/Perfil';
import PecasPage from './pages/Pecas';
import PecaCreate from './pages/PecaCreate';
import PecaEdit from './pages/PecaEdit';
import PecaDetail from './pages/PecaDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ErrorBoundary>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00529b',
              borderRadius: 8,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
          }}
        >
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />

                  <Route path="clientes" element={<Clientes />} />
                  <Route path="clientes/novo" element={<ClienteCreate />} />
                  <Route path="clientes/editar/:id" element={<ClienteEdit />} />
                  <Route path="clientes/detalhes/:id" element={<ClienteDetail />} />

                  <Route path="equipamentos" element={<Equipamentos />} />
                  <Route path="equipamentos/novo" element={<EquipamentoCreate />} />
                  <Route path="equipamentos/editar/:id" element={<EquipamentoEdit />} />
                  <Route path="equipamentos/detalhes/:id" element={<EquipamentoDetail />} />

                  <Route path="orcamentos" element={<Orcamentos />} />
                  <Route path="orcamentos/novo" element={<OrcamentoCreate />} />
                  <Route path="orcamentos/editar/:id" element={<OrcamentoEdit />} />
                  <Route path="orcamentos/detalhes/:id" element={<OrcamentoDetail />} />

                  <Route path="os" element={<OrdensServico />} />
                  <Route path="os/novo" element={<OrdemServicoCreate />} />
                  <Route path="os/editar/:id" element={<OrdemServicoEdit />} />
                  <Route path="os/detalhes/:id" element={<OrdemServicoDetail />} />

                  <Route path="usuarios" element={<Usuarios />} />
                  <Route path="usuarios/novo" element={<UsuarioCreate />} />
                  <Route path="usuarios/editar/:id" element={<UsuarioEdit />} />
                  <Route path="usuarios/detalhes/:id" element={<UsuarioDetail />} />

                  <Route path="servicos" element={<TiposServico />} />
                  <Route path="servicos/novo" element={<ServicoCreate />} />
                  <Route path="servicos/editar/:id" element={<ServicoEdit />} />

                  <Route path="pecas" element={<PecasPage />} />
                  <Route path="pecas/novo" element={<PecaCreate />} />
                  <Route path="pecas/editar/:id" element={<PecaEdit />} />
                  <Route path="pecas/detalhes/:id" element={<PecaDetail />} />

                  <Route path="perfil" element={<PerfilPage />} />

                  {/* Fallback para rotas não encontradas dentro de /admin */}
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>

                {/* Redireciona a rota raiz para o login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Fallback global para rotas não encontradas */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ConfigProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
