import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import {
    Button,
    Space,
    Typography,
    Table,
    Tag,
    Spin,
    Row,
    Col,
    Statistic
} from 'antd';
import {
    DashboardOutlined,
    ReloadOutlined,
    FileTextOutlined,
    UserOutlined,
    ToolOutlined,
    RightOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const NORDESTE = '#203d7b';
const NORDESTE_LIGHT = 'rgba(32, 61, 123, 0.08)';

const PageContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
    padding: 0;
`;

const HeaderSection = styled.div`
    margin-bottom: 28px;
`;

const HeaderCard = styled.div`
    background: linear-gradient(135deg, ${NORDESTE} 0%, #2d5aa0 100%);
    border-radius: 16px;
    padding: 28px 32px;
    box-shadow: 0 8px 24px rgba(32, 61, 123, 0.25);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
`;

const HeaderLeft = styled.div`
    h1 {
        margin: 0 0 4px 0;
        color: white;
        font-size: 28px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    p {
        margin: 0;
        color: rgba(255, 255, 255, 0.85);
        font-size: 15px;
    }
`;

const StatCard = styled(Link)`
    display: block;
    text-decoration: none;
    color: inherit;
    height: 100%;
    
    .stat-card-inner {
        height: 100%;
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(0, 0, 0, 0.04);
        transition: all 0.25s ease;
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: ${props => props.$color || NORDESTE};
            border-radius: 4px 4px 0 0;
        }
        
        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            background: ${props => props.$color ? `${props.$color}18` : `${NORDESTE}18`};
            color: ${props => props.$color || NORDESTE};
            font-size: 22px;
        }
        
        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: ${props => props.$color || NORDESTE};
            margin-bottom: 4px;
            line-height: 1.2;
        }
        
        .stat-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
        }
    }
    
    &:hover .stat-card-inner {
        transform: translateY(-4px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    }
`;

const ChartCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
    height: 100%;
    min-height: 380px;
    
    h3 {
        margin: 0 0 20px 0;
        color: ${NORDESTE};
        font-size: 18px;
        font-weight: 600;
    }
`;

const TableCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    
    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
        
        h3 {
            margin: 0;
            color: ${NORDESTE};
            font-size: 18px;
            font-weight: 600;
        }
        
        .ver-todas {
            color: ${NORDESTE};
            font-weight: 500;
            font-size: 14px;
            text-decoration: none;
            padding: 6px 14px;
            border-radius: 8px;
            background: ${NORDESTE_LIGHT};
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            
            &:hover {
                background: rgba(32, 61, 123, 0.15);
            }
        }
    }
    
    .ant-table-thead > tr > th {
        background: #f8fafc !important;
        color: ${NORDESTE} !important;
        font-weight: 600 !important;
        font-size: 13px !important;
        padding: 14px 16px !important;
    }
    
    .ant-table-tbody > tr > td {
        padding: 14px 16px !important;
        font-size: 14px !important;
    }
    
    .ant-table-tbody > tr:hover > td {
        background: ${NORDESTE_LIGHT} !important;
    }
`;

const RefreshBtn = styled(Button)`
    background: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    color: white !important;
    
    &:hover {
        background: rgba(255, 255, 255, 0.3) !important;
        border-color: rgba(255, 255, 255, 0.6) !important;
        color: white !important;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 20px;
    
    .ant-spin-dot-item {
        background-color: ${NORDESTE} !important;
    }
`;

const { Text } = Typography;

const COLORS = ['#203d7b', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            const data = await dashboardService.getDashboardStats();
            setStats(data);
            setError(null);
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
        };
        loadData();
    }, [fetchStats]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchStats();
        setIsRefreshing(false);
    };

    if (isLoading) {
        return (
            <PageContainer>
                <HeaderSection>
                    <HeaderCard>
                        <HeaderLeft>
                            <h1><DashboardOutlined /> Dashboard</h1>
                            <p>Carregando...</p>
                        </HeaderLeft>
                    </HeaderCard>
                </HeaderSection>
                <LoadingContainer>
                    <Spin size="large" />
                    <Text style={{ color: '#64748b', fontSize: 16 }}>Carregando dados do dashboard...</Text>
                </LoadingContainer>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <HeaderSection>
                    <HeaderCard>
                        <HeaderLeft>
                            <h1><DashboardOutlined /> Dashboard</h1>
                        </HeaderLeft>
                    </HeaderCard>
                </HeaderSection>
                <ChartCard style={{ marginTop: 24 }}>
                    <Text type="danger" style={{ fontSize: 16 }}>Erro: {error}</Text>
                </ChartCard>
            </PageContainer>
        );
    }

    const pieChartData = stats ? Object.entries(stats.os.status).map(([name, value]) => ({ name, value })) : [];
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR') : 'N/A';

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONCLUIDA': return 'success';
            case 'EM_ANDAMENTO': return 'processing';
            case 'PENDENTE_PECAS': return 'warning';
            case 'EM_ABERTO': return 'default';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Nº OS',
            dataIndex: 'numeroOS',
            key: 'numeroOS',
            render: (text, record) => (
                <Link to={`/admin/os/detalhes/${record.id}`} style={{
                    color: NORDESTE,
                    fontWeight: 600,
                    textDecoration: 'none'
                }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Cliente',
            dataIndex: ['cliente', 'nomeCompleto'],
            key: 'cliente',
            render: (text) => <Text style={{ fontWeight: 500 }}>{text || '–'}</Text>,
        },
        {
            title: 'Técnico',
            dataIndex: ['tecnicoAtribuido', 'nome'],
            key: 'tecnico',
            render: (text) => <Text type="secondary">{text || 'N/A'}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ borderRadius: 6 }}>
                    {status?.replace(/_/g, ' ') || '–'}
                </Tag>
            ),
        },
        {
            title: 'Data Abertura',
            dataIndex: 'dataAbertura',
            key: 'dataAbertura',
            render: (date) => <Text type="secondary">{formatDate(date)}</Text>,
        },
    ];

    return (
        <PageContainer>
            <HeaderSection>
                <HeaderCard>
                    <HeaderLeft>
                        <h1>
                            <DashboardOutlined />
                            Dashboard
                        </h1>
                        <p>
                            Olá, {user?.nome || 'Usuário'}! Aqui está o resumo do sistema.
                        </p>
                    </HeaderLeft>
                    <RefreshBtn
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        loading={isRefreshing}
                    >
                        Atualizar
                    </RefreshBtn>
                </HeaderCard>
            </HeaderSection>

            <Row gutter={[24, 24]} style={{ marginBottom: 28 }}>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard to="/admin/os" $color="#3b82f6">
                        <div className="stat-card-inner">
                            <div className="stat-icon"><FileTextOutlined /></div>
                            <div className="stat-value">{stats?.os?.total ?? 0}</div>
                            <div className="stat-label">Ordens de Serviço</div>
                        </div>
                    </StatCard>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard to="/admin/clientes" $color="#10b981">
                        <div className="stat-card-inner">
                            <div className="stat-icon"><UserOutlined /></div>
                            <div className="stat-value">{stats?.clientes?.total ?? 0}</div>
                            <div className="stat-label">Clientes Ativos</div>
                        </div>
                    </StatCard>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard to="/admin/equipamentos" $color="#f59e0b">
                        <div className="stat-card-inner">
                            <div className="stat-icon"><ToolOutlined /></div>
                            <div className="stat-value">{stats?.equipamentos?.total ?? 0}</div>
                            <div className="stat-label">Equipamentos</div>
                        </div>
                    </StatCard>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: 28 }}>
                <Col xs={24} lg={12}>
                    <ChartCard>
                        <h3>OS por Status</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [value, 'Ordens']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Col>
                <Col xs={24} lg={12}>
                    <ChartCard>
                        <h3>OS por Técnico</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={stats?.tecnicos?.osPorTecnico || []}
                                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: 8 }} />
                                <Bar dataKey="Ordens Atribuídas" fill={NORDESTE} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Col>
            </Row>

            <TableCard>
                <div className="table-header">
                    <h3>Últimas Ordens de Serviço</h3>
                    <Link to="/admin/os" className="ver-todas">
                        Ver todas <RightOutlined />
                    </Link>
                </div>
                <Table
                    columns={columns}
                    dataSource={stats?.os?.recentes || []}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                />
            </TableCard>
        </PageContainer>
    );
}

export default DashboardPage;
