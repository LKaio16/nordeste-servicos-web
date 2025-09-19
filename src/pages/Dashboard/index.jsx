import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import {
    Card,
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
    CalendarOutlined
} from '@ant-design/icons';

// Styled Components - Seguindo o padrão das outras páginas
const PageContainer = styled.div`
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 24px;
`;

const HeaderContainer = styled.div`
    background: white;
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 24px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TitleStyled = styled(Typography.Title)`
    margin: 0 !important;
    color: #00529b !important;
    font-size: 28px !important;
    font-weight: 600 !important;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
`;

const StyledCard = styled(Card)`
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: none;
    overflow: hidden;
    margin-bottom: 24px;
    
    .ant-card-body {
        padding: 24px;
    }
`;

const StatCard = styled(Link)`
    display: block;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
    
    .ant-card {
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: none;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: ${props => props.color || '#00529b'};
        }
        
        &:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }
    }
    
    .ant-statistic {
        .ant-statistic-title {
            font-size: 14px !important;
            font-weight: 500 !important;
            color: #666 !important;
            margin-bottom: 8px !important;
        }
        
        .ant-statistic-content {
            font-size: 28px !important;
            font-weight: 600 !important;
            color: ${props => props.color || '#00529b'} !important;
        }
    }
`;

const ChartCard = styled(Card)`
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: none;
    min-height: 400px;
    
    .ant-card-body {
        padding: 24px;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
`;

const SectionTitle = styled(Typography.Title)`
    margin: 0 0 20px 0 !important;
    color: #00529b !important;
    font-size: 20px !important;
    font-weight: 600 !important;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    flex-direction: column;
    gap: 24px;
`;

// Estilos globais para a tabela do dashboard
const GlobalTableStyles = styled.div`
    .dashboard-table {
        .ant-table-thead > tr > th {
            background-color: #f8f9fa !important;
            border-bottom: 1px solid #e8e8e8 !important;
            padding: 12px 8px !important;
            font-weight: 600 !important;
            color: #00529b !important;
        }
        
        .ant-table-tbody > tr > td {
            padding: 12px 8px !important;
            border-bottom: 1px solid #f0f0f0 !important;
        }
        
        .ant-table-tbody > tr:hover > td {
            background-color: #f8f9fa !important;
        }
        
        .ant-table-tbody > tr:last-child > td {
            border-bottom: none !important;
        }
    }
`;

const { Title, Text } = Typography;


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

    if (isLoading) {
        return (
            <PageContainer>
                <HeaderContainer>
                    <TitleStyled level={2}>
                        <Space>
                            <DashboardOutlined />
                            <span>Dashboard</span>
                        </Space>
                    </TitleStyled>
                </HeaderContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <Text style={{ fontSize: '18px', color: '#666' }}>Carregando dados do dashboard...</Text>
                </LoadingContainer>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <HeaderContainer>
                    <TitleStyled level={2}>
                        <Space>
                            <DashboardOutlined />
                            <span>Dashboard</span>
                        </Space>
                    </TitleStyled>
                </HeaderContainer>
                <StyledCard>
                    <Text type="danger" style={{ fontSize: '16px' }}>Erro: {error}</Text>
                </StyledCard>
            </PageContainer>
        );
    }

    const pieChartData = stats ? Object.entries(stats.os.status).map(([name, value]) => ({ name, value })) : [];
    const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#ec4899'];

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

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
            title: <span style={{ fontSize: '14px', fontWeight: 600, color: '#00529b' }}>Nº OS</span>,
            dataIndex: 'numeroOS',
            key: 'numeroOS',
            render: (text, record) => (
                <Link to={`/admin/os/detalhes/${record.id}`} style={{
                    color: '#00529b',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#f0f8ff',
                    transition: 'all 0.2s ease'
                }}>
                    {text}
                </Link>
            ),
        },
        {
            title: <span style={{ fontSize: '14px', fontWeight: 600, color: '#00529b' }}>Cliente</span>,
            dataIndex: ['cliente', 'nomeCompleto'],
            key: 'cliente',
            render: (text) => (
                <Text style={{
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: 500
                }}>{text}</Text>
            ),
        },
        {
            title: <span style={{ fontSize: '14px', fontWeight: 600, color: '#00529b' }}>Técnico</span>,
            dataIndex: ['tecnicoAtribuido', 'nome'],
            key: 'tecnico',
            render: (text) => (
                <Text style={{
                    fontSize: '13px',
                    color: text ? '#666' : '#999'
                }}>
                    {text || 'N/A'}
                </Text>
            ),
        },
        {
            title: <span style={{ fontSize: '14px', fontWeight: 600, color: '#00529b' }}>Status</span>,
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    color={getStatusColor(status)}
                    style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '2px 8px',
                        borderRadius: '12px'
                    }}
                >
                    {status.replace(/_/g, ' ')}
                </Tag>
            ),
        },
        {
            title: <span style={{ fontSize: '14px', fontWeight: 600, color: '#00529b' }}>Data Abertura</span>,
            dataIndex: 'dataAbertura',
            key: 'dataAbertura',
            render: (date) => (
                <Text style={{
                    fontSize: '13px',
                    color: '#666'
                }}>
                    {formatDate(date)}
                </Text>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '24px',
                border: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{ margin: 0, color: '#00529b', fontSize: '28px', fontWeight: 600 }}>
                    <DashboardOutlined style={{ marginRight: '12px' }} />
                    Dashboard
                </h2>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    loading={isRefreshing}
                >
                    Atualizar
                </Button>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={8}>
                    <Link to="/admin/os" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card style={{
                            borderRadius: '16px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            border: 'none',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: '#3b82f6'
                            }} />
                            <Statistic
                                title="Ordens de Serviço"
                                value={stats?.os?.total ?? 0}
                                prefix={<FileTextOutlined style={{ color: '#3b82f6', fontSize: '20px' }} />}
                                valueStyle={{ color: '#3b82f6', fontSize: '28px', fontWeight: 600 }}
                            />
                        </Card>
                    </Link>
                </Col>
                <Col xs={24} sm={8}>
                    <Link to="/admin/clientes" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card style={{
                            borderRadius: '16px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            border: 'none',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: '#10b981'
                            }} />
                            <Statistic
                                title="Clientes Ativos"
                                value={stats?.clientes?.total ?? 0}
                                prefix={<UserOutlined style={{ color: '#10b981', fontSize: '20px' }} />}
                                valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: 600 }}
                            />
                        </Card>
                    </Link>
                </Col>
                <Col xs={24} sm={8}>
                    <Link to="/admin/equipamentos" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card style={{
                            borderRadius: '16px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            border: 'none',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: '#f97316'
                            }} />
                            <Statistic
                                title="Equipamentos"
                                value={stats?.equipamentos?.total ?? 0}
                                prefix={<ToolOutlined style={{ color: '#f97316', fontSize: '20px' }} />}
                                valueStyle={{ color: '#f97316', fontSize: '28px', fontWeight: 600 }}
                            />
                        </Card>
                    </Link>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} lg={12}>
                    <Card style={{
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        border: 'none',
                        minHeight: '400px'
                    }}>
                        <h4 style={{
                            color: '#00529b',
                            fontSize: '20px',
                            fontWeight: 600,
                            marginBottom: '20px'
                        }}>OS por Status</h4>
                        <ResponsiveContainer width="100%" height={300}>
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
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card style={{
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        border: 'none',
                        minHeight: '400px'
                    }}>
                        <h4 style={{
                            color: '#00529b',
                            fontSize: '20px',
                            fontWeight: 600,
                            marginBottom: '20px'
                        }}>OS por Técnico</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={stats?.tecnicos?.osPorTecnico}
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
                    </Card>
                </Col>
            </Row>

            <Card style={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: 'none'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <h4 style={{
                        color: '#00529b',
                        fontSize: '20px',
                        fontWeight: 600,
                        margin: 0
                    }}>Últimas Ordens de Serviço</h4>
                    <Link to="/admin/os" style={{
                        color: '#00529b',
                        fontWeight: 500,
                        fontSize: '14px',
                        textDecoration: 'none',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#f0f8ff',
                        transition: 'all 0.2s ease'
                    }}>Ver todas</Link>
                </div>
                <Table
                    columns={columns}
                    dataSource={stats?.os?.recentes}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    style={{
                        fontSize: '14px'
                    }}
                />
            </Card>
        </div>
    );
}

export default DashboardPage; 
