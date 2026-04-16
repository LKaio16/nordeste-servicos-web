import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import {
    PieChart, Pie, Cell, Tooltip as RTooltip, Legend,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { Table, Tag, Spin } from 'antd';
import {
    ReloadOutlined,
    FileTextOutlined,
    TeamOutlined,
    ToolOutlined,
    RightOutlined,
    ArrowRightOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
    SyncOutlined,
    WarningFilled,
    PieChartOutlined,
    BarChartOutlined,
    PlusOutlined,
    CalendarOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const countUp = keyframes`
    from { opacity: 0; transform: translateY(10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Page = styled.div`
    padding-bottom: 32px;
    animation: ${fadeIn} 0.3s ease both;
`;

const Hero = styled.div`
    background: linear-gradient(145deg, #0c2d6b 0%, #1a4494 40%, #1e5bb5 70%, #2b6fc2 100%);
    margin: -24px -32px 0;
    padding: 36px 36px 100px;
    position: relative;
    overflow: hidden;
    animation: ${slideDown} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;

    &::before {
        content: '';
        position: absolute;
        top: -80px;
        right: -40px;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.04);
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -120px;
        left: 20%;
        width: 500px;
        height: 300px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.03);
    }

    @media (max-width: 768px) {
        margin: -16px -16px 0;
        padding: 24px 20px 90px;
    }
`;

const HeroInner = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
`;

const HeroLeft = styled.div`
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
`;

const HeroTitle = styled.h1`
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
`;

const HeroSub = styled.p`
    margin: 8px 0 0;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
`;

const HeroDate = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    padding: 5px 14px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
`;

const HeroActions = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
`;

const HeroBtn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;

    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const RefreshBtn = styled(HeroBtn)`
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
    }
`;

const NewOSBtn = styled(HeroBtn)`
    background: #fff;
    color: #1a4494;

    &:hover {
        background: #f0f7ff;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
`;

const Content = styled.div`
    margin-top: -68px;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
        margin-top: -60px;
    }
`;

const MetricsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 22px;

    @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const MetricCard = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(12, 45, 107, 0.1), 0 1px 3px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(26, 68, 148, 0.06);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    position: relative;
    overflow: hidden;
    animation: ${scaleIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: ${p => p.$d || '0s'};

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, ${p => p.$tint || 'rgba(26, 68, 148, 0.02)'}, transparent);
        pointer-events: none;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 40px rgba(12, 45, 107, 0.15);

        .metric-arrow {
            background: #1a4494;
            color: #fff;
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

const MetricTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
`;

const MetricIconBox = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    background: ${p => p.$bg};
    color: ${p => p.$c};
    box-shadow: 0 2px 8px ${p => p.$shadow || 'rgba(0,0,0,0.06)'};
`;

const MetricArrow = styled.div.attrs({ className: 'metric-arrow' })`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #f0f4fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #1a4494;
    opacity: 0.6;
    transform: translateX(-4px);
    transition: all 0.25s ease;
`;

const MetricValue = styled.div`
    font-size: 40px;
    font-weight: 800;
    color: #0c2d6b;
    line-height: 1;
    letter-spacing: -1.5px;
    margin-bottom: 5px;
    position: relative;
    animation: ${countUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
`;

const MetricLabel = styled.div`
    font-size: 14px;
    color: #6b86b8;
    font-weight: 600;
`;

const GridRow = styled.div`
    display: grid;
    grid-template-columns: ${p => p.$cols || '1fr 1fr'};
    gap: 18px;
    margin-bottom: 22px;

    @media (max-width: 960px) { grid-template-columns: 1fr; }
`;

const Panel = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: ${p => p.$p || '24px'};
    box-shadow: 0 2px 10px rgba(12, 45, 107, 0.06);
    border: 1px solid rgba(26, 68, 148, 0.06);
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: ${p => p.$d || '0.15s'};
`;

const PanelHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eef2f9;
`;

const PanelTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: #0c2d6b;
    }
`;

const PanelTitleIcon = styled.div`
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background: ${p => p.$bg || '#eef2f9'};
    color: ${p => p.$c || '#1a4494'};
`;

const PanelBadge = styled.span`
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    background: #eef2f9;
    color: #1a4494;
`;

const StatusList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StatusRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border-radius: 12px;
    background: ${p => p.$bg};
    border: 1px solid ${p => p.$border || 'transparent'};
    transition: transform 0.15s;
    animation: ${fadeUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: ${p => p.$delay || '0.5s'};

    &:hover { transform: translateX(3px); }
`;

const StatusIconWrap = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background: ${p => p.$bg};
    color: ${p => p.$c};
`;

const StatusLabel = styled.span`
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
`;

const ProgressTrack = styled.div`
    width: 90px;
    height: 6px;
    border-radius: 6px;
    background: #eef2f9;
    overflow: hidden;

    @media (max-width: 560px) { display: none; }
`;

const ProgressFill = styled.div`
    height: 100%;
    border-radius: 6px;
    background: ${p => p.$c};
    width: ${p => p.$w}%;
    transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
`;

const StatusCount = styled.span`
    font-size: 22px;
    font-weight: 800;
    color: #0c2d6b;
    min-width: 32px;
    text-align: right;
`;

const TablePanel = styled(Panel)`
    .ant-table {
        .ant-table-thead > tr > th {
            background: #f8faff !important;
            border-bottom: 2px solid #eef2f9 !important;
            color: #6b86b8 !important;
            font-weight: 700 !important;
            font-size: 11px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.7px !important;
            padding: 10px 14px !important;
        }
        .ant-table-tbody > tr > td {
            padding: 13px 14px !important;
            border-bottom: 1px solid #f5f8fd !important;
            font-size: 14px !important;
        }
        .ant-table-tbody > tr:hover > td {
            background: #f8faff !important;
        }
    }
`;

const TableHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
`;

const SeeAll = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #1a4494;
    text-decoration: none;
    padding: 7px 16px;
    border-radius: 8px;
    background: #eef2f9;
    transition: all 0.2s;

    &:hover { background: #1a4494; color: #fff; }
`;

const OsLink = styled(Link)`
    font-weight: 700;
    color: #0c2d6b;
    text-decoration: none;
    &:hover { color: #1a4494; text-decoration: underline; }
`;

const LoadWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    gap: 16px;
    .ant-spin-dot-item { background-color: #1a4494 !important; }
`;

const QuickActions = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 22px;

    @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const QuickAction = styled(Link)`
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    background: #fff;
    border: 1.5px solid #eef2f9;
    border-radius: 14px;
    transition: border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
    animation: ${fadeUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: ${p => p.$d || '0.1s'};

    &:hover {
        border-color: #1a4494;
        background: #f0f4fa;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(12, 45, 107, 0.08);
    }
`;

const QAIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    background: linear-gradient(135deg, #1a4494, #2b6fc2);
    color: #fff;
    flex-shrink: 0;
`;

const QAText = styled.div`
    font-size: 13px;
    font-weight: 600;
    color: #0c2d6b;
    line-height: 1.3;
`;

const STATUS_CONFIG = {
    CONCLUIDA: {
        label: 'Concluídas', color: '#1a8a5c',
        bg: '#f0faf5', border: '#d1f0e0', iconBg: '#ddf5e8',
        icon: <CheckCircleFilled />
    },
    EM_ANDAMENTO: {
        label: 'Em Andamento', color: '#1a4494',
        bg: '#eef4ff', border: '#c7daf5', iconBg: '#d6e6fa',
        icon: <SyncOutlined />
    },
    PENDENTE_PECAS: {
        label: 'Pend. Peças', color: '#b8860b',
        bg: '#fefaf0', border: '#f0e4b8', iconBg: '#faf0d0',
        icon: <WarningFilled />
    },
    EM_ABERTO: {
        label: 'Em Aberto', color: '#5a7099',
        bg: '#f4f7fb', border: '#dde4f0', iconBg: '#e4eaf4',
        icon: <ClockCircleFilled />
    },
};

const PIE_COLORS = ['#1a8a5c', '#1a4494', '#c8960b', '#7a93b8'];

const tagColor = (s) => {
    if (s === 'CONCLUIDA') return 'success';
    if (s === 'EM_ANDAMENTO') return 'processing';
    if (s === 'PENDENTE_PECAS') return 'warning';
    return 'default';
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—';

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
            console.error('Erro dashboard:', err);
            setError('Não foi possível carregar os dados.');
        }
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await fetchStats();
            setIsLoading(false);
        })();
    }, [fetchStats]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchStats();
        setIsRefreshing(false);
    };

    const todayStr = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    if (isLoading) {
        return (
            <Page>
                <Hero>
                    <HeroInner>
                        <HeroLeft>
                            <HeroTitle>Dashboard</HeroTitle>
                            <HeroSub>Carregando dados...</HeroSub>
                        </HeroLeft>
                    </HeroInner>
                </Hero>
                <Content><LoadWrap><Spin size="large" /></LoadWrap></Content>
            </Page>
        );
    }

    if (error) {
        return (
            <Page>
                <Hero>
                    <HeroInner>
                        <HeroLeft><HeroTitle>Dashboard</HeroTitle></HeroLeft>
                    </HeroInner>
                </Hero>
                <Content>
                    <Panel style={{ textAlign: 'center', padding: 48 }}>
                        <p style={{ color: '#b91c1c', marginBottom: 16, fontSize: 15 }}>{error}</p>
                        <RefreshBtn onClick={handleRefresh}>
                            <ReloadOutlined /> Tentar novamente
                        </RefreshBtn>
                    </Panel>
                </Content>
            </Page>
        );
    }

    const statusEntries = stats ? Object.entries(stats.os.status) : [];
    const totalOS = stats?.os?.total || 1;
    const pieData = statusEntries.map(([k, v]) => ({ name: STATUS_CONFIG[k]?.label || k, value: v }));
    const firstName = user?.nome?.split(' ')[0] || 'Usuário';

    const columns = [
        {
            title: 'Nº OS',
            dataIndex: 'numeroOS',
            key: 'numeroOS',
            width: 100,
            render: (t, r) => <OsLink to={`/admin/os/detalhes/${r.id}`}>{t}</OsLink>,
        },
        {
            title: 'Cliente',
            dataIndex: ['cliente', 'nomeCompleto'],
            key: 'cliente',
            render: (t) => <span style={{ fontWeight: 500, color: '#1e293b' }}>{t || '—'}</span>,
        },
        {
            title: 'Técnico',
            dataIndex: ['tecnicoAtribuido', 'nome'],
            key: 'tecnico',
            render: (t) => <span style={{ color: '#6b86b8' }}>{t || '—'}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s) => (
                <Tag color={tagColor(s)} style={{ borderRadius: 6, fontWeight: 600, fontSize: 11 }}>
                    {s?.replace(/_/g, ' ') || '—'}
                </Tag>
            ),
        },
        {
            title: 'Data',
            dataIndex: 'dataAbertura',
            key: 'data',
            render: (d) => <span style={{ color: '#94a3b8', fontSize: 13 }}>{fmtDate(d)}</span>,
        },
    ];

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <HeroTitle>Olá, {firstName}</HeroTitle>
                        <HeroSub>Painel de controle — Nordeste Serviços</HeroSub>
                        <HeroDate>
                            <CalendarOutlined /> {todayStr}
                        </HeroDate>
                    </HeroLeft>
                    <HeroActions>
                        <NewOSBtn as={Link} to="/admin/os/novo" style={{ textDecoration: 'none' }}>
                            <PlusOutlined /> Nova OS
                        </NewOSBtn>
                        <RefreshBtn onClick={handleRefresh} disabled={isRefreshing}>
                            <ReloadOutlined spin={isRefreshing} />
                            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                        </RefreshBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <MetricsRow>
                    <MetricCard to="/admin/os" $d="0.1s" $tint="rgba(26, 68, 148, 0.03)">
                        <MetricTop>
                            <MetricIconBox $bg="linear-gradient(135deg, #1a4494, #2b6fc2)" $c="#fff" $shadow="rgba(26, 68, 148, 0.2)">
                                <FileTextOutlined />
                            </MetricIconBox>
                            <MetricArrow><ArrowRightOutlined /></MetricArrow>
                        </MetricTop>
                        <MetricValue>{stats?.os?.total ?? 0}</MetricValue>
                        <MetricLabel>Ordens de Serviço</MetricLabel>
                    </MetricCard>

                    <MetricCard to="/admin/clientes" $d="0.18s" $tint="rgba(26, 68, 148, 0.02)">
                        <MetricTop>
                            <MetricIconBox $bg="linear-gradient(135deg, #1558a8, #3d8bd4)" $c="#fff" $shadow="rgba(21, 88, 168, 0.2)">
                                <TeamOutlined />
                            </MetricIconBox>
                            <MetricArrow><ArrowRightOutlined /></MetricArrow>
                        </MetricTop>
                        <MetricValue>{stats?.clientes?.total ?? 0}</MetricValue>
                        <MetricLabel>Clientes</MetricLabel>
                    </MetricCard>

                    <MetricCard to="/admin/equipamentos" $d="0.26s" $tint="rgba(26, 68, 148, 0.02)">
                        <MetricTop>
                            <MetricIconBox $bg="linear-gradient(135deg, #1a6bad, #4fa3d9)" $c="#fff" $shadow="rgba(26, 107, 173, 0.2)">
                                <ToolOutlined />
                            </MetricIconBox>
                            <MetricArrow><ArrowRightOutlined /></MetricArrow>
                        </MetricTop>
                        <MetricValue>{stats?.equipamentos?.total ?? 0}</MetricValue>
                        <MetricLabel>Equipamentos</MetricLabel>
                    </MetricCard>
                </MetricsRow>

                <QuickActions>
                    <QuickAction to="/admin/os/novo" $d="0.3s">
                        <QAIcon><FileTextOutlined /></QAIcon>
                        <QAText>Nova Ordem<br />de Serviço</QAText>
                    </QuickAction>
                    <QuickAction to="/admin/clientes/novo" $d="0.36s">
                        <QAIcon><TeamOutlined /></QAIcon>
                        <QAText>Novo<br />Cliente</QAText>
                    </QuickAction>
                    <QuickAction to="/admin/orcamentos/novo" $d="0.42s">
                        <QAIcon><AppstoreOutlined /></QAIcon>
                        <QAText>Novo<br />Orçamento</QAText>
                    </QuickAction>
                    <QuickAction to="/admin/equipamentos/novo" $d="0.48s">
                        <QAIcon><ToolOutlined /></QAIcon>
                        <QAText>Novo<br />Equipamento</QAText>
                    </QuickAction>
                </QuickActions>

                <GridRow $cols="5fr 7fr">
                    <Panel $d="0.45s">
                        <PanelHeader>
                            <PanelTitle>
                                <PanelTitleIcon $bg="#eef2f9" $c="#1a4494">
                                    <PieChartOutlined />
                                </PanelTitleIcon>
                                <h3>Status das OS</h3>
                            </PanelTitle>
                            <PanelBadge>{stats?.os?.total ?? 0} total</PanelBadge>
                        </PanelHeader>

                        <StatusList>
                            {statusEntries.map(([key, value], idx) => {
                                const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.EM_ABERTO;
                                const pct = totalOS > 0 ? Math.round((value / totalOS) * 100) : 0;
                                return (
                                    <StatusRow key={key} $bg={cfg.bg} $border={cfg.border} $delay={`${0.5 + idx * 0.06}s`}>
                                        <StatusIconWrap $bg={cfg.iconBg} $c={cfg.color}>
                                            {cfg.icon}
                                        </StatusIconWrap>
                                        <StatusLabel>{cfg.label}</StatusLabel>
                                        <ProgressTrack>
                                            <ProgressFill $c={cfg.color} $w={pct} />
                                        </ProgressTrack>
                                        <StatusCount>{value}</StatusCount>
                                    </StatusRow>
                                );
                            })}
                        </StatusList>

                        <div style={{ marginTop: 20 }}>
                            <ResponsiveContainer width="100%" height={190}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={48}
                                        outerRadius={74}
                                        paddingAngle={3}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RTooltip
                                        contentStyle={{
                                            borderRadius: 10,
                                            border: '1px solid #eef2f9',
                                            boxShadow: '0 8px 24px rgba(12,45,107,0.12)',
                                            fontSize: 13
                                        }}
                                        formatter={(v) => [v, 'Ordens']}
                                    />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: 12, color: '#6b86b8', fontWeight: 500 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Panel>

                    <Panel $d="0.52s">
                        <PanelHeader>
                            <PanelTitle>
                                <PanelTitleIcon $bg="#eef2f9" $c="#1a4494">
                                    <BarChartOutlined />
                                </PanelTitleIcon>
                                <h3>OS por Técnico</h3>
                            </PanelTitle>
                            <PanelBadge>Distribuição</PanelBadge>
                        </PanelHeader>

                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={stats?.tecnicos?.osPorTecnico || []}
                                margin={{ top: 4, right: 12, left: -16, bottom: 0 }}
                                barCategoryGap="20%"
                            >
                                <defs>
                                    <linearGradient id="blueBar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1a4494" />
                                        <stop offset="100%" stopColor="#2b6fc2" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f9" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#6b86b8', fontSize: 12, fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#a8b8d0', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <RTooltip
                                    contentStyle={{
                                        borderRadius: 10,
                                        border: '1px solid #eef2f9',
                                        boxShadow: '0 8px 24px rgba(12,45,107,0.12)',
                                        fontSize: 13,
                                        fontWeight: 500
                                    }}
                                    cursor={{ fill: 'rgba(26, 68, 148, 0.04)' }}
                                />
                                <Bar
                                    dataKey="Ordens Atribuídas"
                                    fill="url(#blueBar)"
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={48}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Panel>
                </GridRow>

                <TablePanel $d="0.58s" $p="24px">
                    <TableHead>
                        <PanelTitle>
                            <PanelTitleIcon>
                                <FileTextOutlined />
                            </PanelTitleIcon>
                            <h3>Últimas Ordens de Serviço</h3>
                        </PanelTitle>
                        <SeeAll to="/admin/os">
                            Ver todas <RightOutlined style={{ fontSize: 10 }} />
                        </SeeAll>
                    </TableHead>
                    <Table
                        columns={columns}
                        dataSource={stats?.os?.recentes || []}
                        rowKey="id"
                        pagination={false}
                        size="middle"
                    />
                </TablePanel>
            </Content>
        </Page>
    );
}

export default DashboardPage;
