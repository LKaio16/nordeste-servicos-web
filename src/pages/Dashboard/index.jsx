import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiUsers, FiHardDrive, FiFileText, FiRefreshCw } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { PageHeader, Title, Table, Th, Td, Tr, RefreshButton, HeaderActions } from '../../styles/common';
import Spinner from '../../components/Spinner';

const DashboardWrapper = styled.div`
    width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(Link)`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
`;

const CardIcon = styled.div`
  background-color: ${({ color }) => color || '#e2e8f0'};
  color: white;
  min-width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const CardInfo = styled.div`
  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    color: #4a5568;
    font-weight: 500;
  }
  p {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a202c;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartContainer = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const RecentActivityContainer = styled.div`
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const TableContainer = styled.div`
    overflow-x: auto;
`;

const DashboardTable = styled(Table)`
    width: 100%;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
`;

const SeeAllLink = styled(Link)`
    font-size: 0.9rem;
    font-weight: 500;
    color: #00529b;
`;

const StatusBadge = styled.span`
    padding: 0.25rem 0.6rem;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    background-color: ${({ status }) => {
        switch (status) {
            case 'CONCLUIDA': return '#d1fae5';
            case 'EM_ANDAMENTO': return '#fef3c7';
            case 'PENDENTE_PECAS': return '#fee2e2';
            default: return '#e5e7eb';
        }
    }};
    color: ${({ status }) => {
        switch (status) {
            case 'CONCLUIDA': return '#065f46';
            case 'EM_ANDAMENTO': return '#92400e';
            case 'PENDENTE_PECAS': return '#991b1b';
            default: return '#4b5563';
        }
    }};
`;

const ThMobileHidden = styled(Th)`
    @media (max-width: 768px) {
        display: none;
    }
`;

const TdMobileHidden = styled(Td)`
    @media (max-width: 768px) {
        display: none;
    }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;


function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            const data = await dashboardService.getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error("Erro ao buscar estatísticas do dashboard:", err);
            setError("Não foi possível carregar os dados do dashboard.");
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchStats();
            setIsLoading(false);
        }
        loadData();
    }, [fetchStats]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchStats();
        setIsRefreshing(false);
    };

    if (isLoading) return (
        <DashboardWrapper>
            <PageHeader>
                <Title>Dashboard</Title>
            </PageHeader>
            <LoadingContainer>
                <Spinner />
            </LoadingContainer>
        </DashboardWrapper>
    );

    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

    const pieChartData = stats ? Object.entries(stats.os.status).map(([name, value]) => ({ name, value })) : [];
    const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#ec4899'];

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

    return (
        <DashboardWrapper>
            <PageHeader>
                <Title>Dashboard</Title>
                <HeaderActions>
                    <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
                        <FiRefreshCw />
                        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                    </RefreshButton>
                </HeaderActions>
            </PageHeader>
            <StatsGrid>
                <StatCard to="/admin/os">
                    <CardIcon color="#3b82f6"><FiFileText /></CardIcon>
                    <CardInfo>
                        <h3>Ordens de Serviço</h3>
                        <p>{stats?.os.total ?? '0'}</p>
                    </CardInfo>
                </StatCard>
                <StatCard to="/admin/clientes">
                    <CardIcon color="#10b981"><FiUsers /></CardIcon>
                    <CardInfo>
                        <h3>Clientes Ativos</h3>
                        <p>{stats?.clientes.total ?? '0'}</p>
                    </CardInfo>
                </StatCard>
                <StatCard to="/admin/equipamentos">
                    <CardIcon color="#f97316"><FiHardDrive /></CardIcon>
                    <CardInfo>
                        <h3>Equipamentos</h3>
                        <p>{stats?.equipamentos.total ?? '0'}</p>
                    </CardInfo>
                </StatCard>
            </StatsGrid>

            <ChartsGrid>
                <ChartContainer>
                    <SectionTitle>OS por Status</SectionTitle>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
                <ChartContainer>
                    <SectionTitle>OS por Técnico</SectionTitle>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={stats?.tecnicos.osPorTecnico}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Ordens Atribuídas" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </ChartsGrid>

            <RecentActivityContainer>
                <SectionHeader>
                    <SectionTitle>Últimas Ordens de Serviço</SectionTitle>
                    <SeeAllLink to="/admin/os">Ver todas</SeeAllLink>
                </SectionHeader>
                <TableContainer>
                    <DashboardTable>
                        <thead>
                            <Tr>
                                <Th>Nº OS</Th>
                                <Th>Cliente</Th>
                                <ThMobileHidden>Técnico</ThMobileHidden>
                                <Th>Status</Th>
                                <ThMobileHidden>Data Abertura</ThMobileHidden>
                            </Tr>
                        </thead>
                        <tbody>
                            {stats?.os.recentes.map(os => (
                                <Tr key={os.id}>
                                    <Td><Link to={`/admin/os/detalhes/${os.id}`}>{os.numeroOS}</Link></Td>
                                    <Td>{os.cliente.nomeCompleto}</Td>
                                    <TdMobileHidden>{os.tecnicoAtribuido?.nome || 'N/A'}</TdMobileHidden>
                                    <Td><StatusBadge status={os.status}>{os.status.replace(/_/g, ' ')}</StatusBadge></Td>
                                    <TdMobileHidden>{formatDate(os.dataAbertura)}</TdMobileHidden>
                                </Tr>
                            ))}
                        </tbody>
                    </DashboardTable>
                </TableContainer>
            </RecentActivityContainer>
        </DashboardWrapper>
    );
}

export default DashboardPage; 