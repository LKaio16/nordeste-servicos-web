import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import dayjs from 'dayjs';
import orcamentoService from '../../services/orcamentoService';
import * as contaService from '../../services/contaService';
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Spin,
    Row,
    Col,
    Divider,
    Popconfirm,
    Table,
    Descriptions,
    Statistic
} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    DollarOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    CreditCardOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { FiArrowLeft, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';

const { Title, Text } = Typography;

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
`;
const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const Page = styled.div`
    padding-bottom: 32px;
    animation: ${fadeIn} 0.3s ease both;
`;

const Hero = styled.div`
    background: linear-gradient(145deg, #0c2d6b 0%, #1a4494 40%, #1e5bb5 70%, #2b6fc2 100%);
    margin: -24px -32px 0;
    padding: 32px 36px 72px;
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
    @media (max-width: 768px) {
        margin: -16px -16px 0;
        padding: 24px 20px 64px;
    }
`;

const HeroInner = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
`;

const HeroLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const BackBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    svg {
        width: 18px;
        height: 18px;
    }
`;

const HeroInfo = styled.div`
    h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.3px;
    }
    p {
        margin: 4px 0 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
    }
`;

const HeroActions = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
`;

const Btn = styled.button`
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
    white-space: nowrap;
    svg {
        width: 16px;
        height: 16px;
    }
`;

const PrimaryBtn = styled(Btn)`
    background: #fff;
    color: #1a4494;
    &:hover {
        background: #f0f7ff;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
    }
`;

const GhostBtn = styled(Btn)`
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const DangerGhostBtn = styled(Btn)`
    background: rgba(220, 38, 38, 0.15);
    color: #fca5a5;
    border: 1px solid rgba(220, 38, 38, 0.3);
    &:hover {
        background: rgba(220, 38, 38, 0.25);
        color: #fff;
    }
`;

const Content = styled.div`
    margin-top: -44px;
    position: relative;
    z-index: 2;
`;

const Section = styled.div`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(12, 45, 107, 0.06);
    border: 1px solid rgba(26, 68, 148, 0.06);
    margin-bottom: 18px;
    overflow: hidden;
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: ${(p) => p.$d || '0.15s'};
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 24px;
    border-bottom: 1px solid #eef2f9;
    svg {
        width: 18px;
        height: 18px;
        color: #1a4494;
    }
    h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: #0c2d6b;
    }
`;

const SectionBody = styled.div`
    padding: 24px;
`;

const LoadWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    flex-direction: column;
    gap: 16px;
    .ant-spin-dot-item {
        background-color: #1a4494 !important;
    }
`;

const StyledTable = styled(Table)`
    .ant-table {
        border-radius: 12px;
        overflow: hidden;
    }

    .ant-table-thead > tr > th {
        background: #f8faff;
        border-bottom: 2px solid #eef2f9;
        font-weight: 600;
        color: #1a4494;
        padding: 16px 12px;
    }

    .ant-table-tbody > tr {
        transition: background 0.15s;
        &:hover > td {
            background: #f8faff;
        }
        > td {
            padding: 16px 12px;
            border-bottom: 1px solid #f5f8fd;
        }
    }
`;

const StatisticCard = styled(Card)`
    text-align: center;
    border-radius: 12px;
    border: 1px solid #eef2f9;

    &:hover {
        border-color: #1a4494;
        box-shadow: 0 4px 12px rgba(26, 68, 148, 0.08);
    }

    .ant-statistic-title {
        color: #6b86b8;
        font-size: 14px;
        margin-bottom: 8px;
    }

    .ant-statistic-content {
        color: #0c2d6b;
        font-size: 24px;
        font-weight: 700;
    }
`;

const AntGhostWrap = styled.span`
    .ant-btn {
        border-radius: 10px;
        font-weight: 600;
        height: 40px;
        display: inline-flex;
        align-items: center;
    }
`;

function OrcamentoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orcamento, setOrcamento] = useState(null);
    const [itens, setItens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [criandoConta, setCriandoConta] = useState(false);

    const extractStatusValue = (status) => {
        if (!status) return 'N/A';
        if (typeof status === 'string') return status;
        if (typeof status === 'object') {
            return (
                status.value ||
                status.nome ||
                status.descricao ||
                status.status ||
                status.name ||
                status.label ||
                status.text ||
                Object.values(status).find((val) => typeof val === 'string') ||
                'Status desconhecido'
            );
        }
        return String(status);
    };

    const getStatusColor = (status) => {
        const statusString = String(extractStatusValue(status)).toUpperCase();
        switch (statusString) {
            case 'PENDENTE':
                return 'orange';
            case 'APROVADO':
                return 'green';
            case 'REJEITADO':
                return 'red';
            case 'CANCELADO':
                return 'gray';
            default:
                return 'blue';
        }
    };

    const statusBadgeBg = (status) => {
        const c = getStatusColor(status);
        if (c === 'orange') return '#fa8c16';
        if (c === 'green') return '#52c41a';
        if (c === 'red') return '#ff4d4f';
        if (c === 'gray') return '#8c8c8c';
        return '#1890ff';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dayjs(dateString, 'YYYY-MM-DD').format('DD/MM/YYYY');
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const [orcamentoData, itensData] = await Promise.all([
                    orcamentoService.getOrcamentoById(id),
                    orcamentoService.getItensByOrcamentoId(id),
                ]);
                setOrcamento(orcamentoData);
                setItens(itensData);
            } catch (err) {
                message.error('Erro ao carregar detalhes do orçamento: ' + (err.message || 'Erro desconhecido'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleDelete = async () => {
        try {
            await orcamentoService.deleteOrcamento(id);
            message.success('Orçamento excluído com sucesso!');
            navigate('/admin/orcamentos');
        } catch (err) {
            message.error('Erro ao excluir orçamento: ' + (err.message || 'Erro desconhecido'));
        }
    };

    const handleDownload = async () => {
        try {
            await orcamentoService.downloadOrcamentoPdf(id);
            message.success('Download iniciado!');
        } catch (err) {
            message.error('Erro ao baixar PDF: ' + (err.message || 'Erro desconhecido'));
        }
    };

    const handleCriarContaReceber = async () => {
        if (!orcamento || orcamento.valorTotal == null) {
            message.warning('Orçamento sem valor total. Edite o orçamento antes de criar a conta.');
            return;
        }
        setCriandoConta(true);
        try {
            const dataVencimento = orcamento.dataValidade
                ? dayjs(orcamento.dataValidade).format('YYYY-MM-DD')
                : dayjs().add(30, 'day').format('YYYY-MM-DD');
            const payload = {
                tipo: 'RECEBER',
                clienteId: orcamento.clienteId || null,
                fornecedorId: null,
                descricao: `Orçamento #${orcamento.numeroOrcamento || orcamento.id}`,
                valor: Number(orcamento.valorTotal),
                valorPago: null,
                dataVencimento,
                dataPagamento: null,
                status: 'PENDENTE',
                categoria: null,
                categoriaFinanceira: null,
                subcategoria: null,
                formaPagamento: null,
                observacoes: orcamento.observacoesCondicoes ? `Ref. orçamento ${orcamento.numeroOrcamento || id}` : null,
            };
            const contaCriada = await contaService.createConta(payload);
            message.success('Conta a receber criada com sucesso!');
            navigate(`/admin/contas/editar/${contaCriada.id}`);
        } catch (err) {
            message.error(err.message || 'Erro ao criar conta a receber.');
        } finally {
            setCriandoConta(false);
        }
    };

    const formatCurrency = (val) => {
        if (val == null || val === undefined) return '0,00';
        const formatted = Math.abs(val).toFixed(2);
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };

    const columns = [
        {
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'descricao',
            render: (text) => (
                <Text strong style={{ color: '#1a4494' }}>
                    {text || 'N/A'}
                </Text>
            ),
        },
        {
            title: 'Quantidade',
            dataIndex: 'quantidade',
            key: 'quantidade',
            width: 120,
            align: 'center',
            render: (value) => <Text>{value || 0}</Text>,
        },
        {
            title: 'Preço Unitário',
            dataIndex: 'valorUnitario',
            key: 'valorUnitario',
            width: 140,
            align: 'right',
            render: (value) => (
                <Text strong style={{ color: '#52c41a' }}>
                    R$ {formatCurrency(value)}
                </Text>
            ),
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            key: 'subtotal',
            width: 140,
            align: 'right',
            render: (value) => (
                <Text strong style={{ color: '#1a4494', fontSize: '16px' }}>
                    R$ {formatCurrency(value)}
                </Text>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Page>
                <Hero>
                    <HeroInner>
                        <HeroInfo>
                            <h1>Orçamento</h1>
                        </HeroInfo>
                    </HeroInner>
                </Hero>
                <Content>
                    <LoadWrap>
                        <Spin size="large" />
                        <span style={{ color: '#6b86b8', fontWeight: 600 }}>Carregando...</span>
                    </LoadWrap>
                </Content>
            </Page>
        );
    }

    if (!orcamento) {
        return (
            <Page>
                <Hero>
                    <HeroInner>
                        <HeroInfo>
                            <h1>Orçamento não encontrado</h1>
                        </HeroInfo>
                    </HeroInner>
                </Hero>
                <Content>
                    <Section $d="0.1s">
                        <SectionBody style={{ textAlign: 'center' }}>
                            <ExclamationCircleOutlined style={{ fontSize: 48, color: '#dc2626', marginBottom: 16 }} />
                            <Title level={3} type="danger" style={{ marginTop: 0 }}>
                                Orçamento não encontrado
                            </Title>
                            <Text>Verifique o ID na URL.</Text>
                        </SectionBody>
                    </Section>
                </Content>
            </Page>
        );
    }

    const statusText = extractStatusValue(orcamento.status);

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <BackBtn type="button" onClick={() => navigate(-1)}>
                            <FiArrowLeft />
                        </BackBtn>
                        <HeroInfo>
                            <h1>Orçamento #{orcamento.numeroOrcamento}</h1>
                            <p>
                                {orcamento.nomeCliente || 'Cliente'} · {statusText}
                            </p>
                        </HeroInfo>
                    </HeroLeft>
                    <HeroActions>
                        <AntGhostWrap>
                            <Button
                                icon={<CreditCardOutlined />}
                                onClick={handleCriarContaReceber}
                                loading={criandoConta}
                                style={{
                                    background: 'rgba(255,255,255,0.12)',
                                    color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                }}
                            >
                                Conta a receber
                            </Button>
                        </AntGhostWrap>
                        <GhostBtn type="button" onClick={handleDownload}>
                            <FiDownload /> PDF
                        </GhostBtn>
                        <PrimaryBtn type="button" onClick={() => navigate(`/admin/orcamentos/editar/${id}`)}>
                            <FiEdit2 /> Editar
                        </PrimaryBtn>
                        <Popconfirm
                            title="Excluir orçamento"
                            description={`Excluir o orçamento #${orcamento.numeroOrcamento}?`}
                            onConfirm={handleDelete}
                            okText="Sim"
                            cancelText="Não"
                            okType="danger"
                        >
                            <DangerGhostBtn type="button">
                                <FiTrash2 /> Excluir
                            </DangerGhostBtn>
                        </Popconfirm>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <Section $d="0.1s">
                    <SectionHeader>
                        <FileTextOutlined />
                        <h3>Informações gerais</h3>
                    </SectionHeader>
                    <SectionBody>
                        <Row gutter={[24, 16]}>
                            <Col xs={24} md={8}>
                                <StatisticCard>
                                    <Statistic
                                        title={
                                            <Space>
                                                <UserOutlined />
                                                <span>Cliente</span>
                                            </Space>
                                        }
                                        value={orcamento.nomeCliente || 'N/A'}
                                        valueStyle={{ color: '#1a4494', fontSize: '18px' }}
                                    />
                                </StatisticCard>
                            </Col>
                            <Col xs={24} md={8}>
                                <StatisticCard>
                                    <div style={{ textAlign: 'center' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: 8,
                                                color: '#1a4494',
                                                fontSize: 14,
                                                fontWeight: 600,
                                            }}
                                        >
                                            <CheckCircleOutlined style={{ marginRight: 8 }} />
                                            <span>Status</span>
                                        </div>
                                        <div
                                            style={{
                                                backgroundColor: statusBadgeBg(orcamento.status),
                                                color: 'white',
                                                padding: '8px 16px',
                                                borderRadius: 20,
                                                fontSize: 14,
                                                fontWeight: 500,
                                                display: 'inline-block',
                                            }}
                                        >
                                            {statusText}
                                        </div>
                                    </div>
                                </StatisticCard>
                            </Col>
                            <Col xs={24} md={8}>
                                <StatisticCard>
                                    <Statistic
                                        title={
                                            <Space>
                                                <DollarOutlined />
                                                <span>Valor total</span>
                                            </Space>
                                        }
                                        value={formatCurrency(orcamento.valorTotal)}
                                        prefix="R$"
                                        valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                                    />
                                </StatisticCard>
                            </Col>
                        </Row>

                        <Divider style={{ borderColor: '#eef2f9' }} />

                        <Row gutter={[24, 16]}>
                            <Col xs={24} md={12}>
                                <StatisticCard>
                                    <Statistic
                                        title={
                                            <Space>
                                                <CalendarOutlined />
                                                <span>Data de emissão</span>
                                            </Space>
                                        }
                                        value={formatDate(orcamento.dataEmissao)}
                                        valueStyle={{ color: '#1a4494', fontSize: '18px' }}
                                    />
                                </StatisticCard>
                            </Col>
                            <Col xs={24} md={12}>
                                <StatisticCard>
                                    <Statistic
                                        title={
                                            <Space>
                                                <CalendarOutlined />
                                                <span>Data de validade</span>
                                            </Space>
                                        }
                                        value={formatDate(orcamento.dataValidade)}
                                        valueStyle={{ color: '#1a4494', fontSize: '18px' }}
                                    />
                                </StatisticCard>
                            </Col>
                        </Row>
                    </SectionBody>
                </Section>

                <Section $d="0.2s">
                    <SectionHeader>
                        <FileTextOutlined />
                        <h3>Itens do orçamento</h3>
                    </SectionHeader>
                    <SectionBody>
                        <StyledTable
                            columns={columns}
                            dataSource={itens}
                            rowKey="id"
                            pagination={false}
                            locale={{
                                emptyText: 'Nenhum item encontrado para este orçamento',
                            }}
                            summary={(pageData) => {
                                const total = pageData.reduce((sum, item) => sum + (item.subtotal || 0), 0);
                                return (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3}>
                                            <Text strong style={{ fontSize: 16, color: '#1a4494' }}>
                                                Total geral:
                                            </Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={3}>
                                            <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                                                R$ {formatCurrency(total)}
                                            </Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                );
                            }}
                        />
                    </SectionBody>
                </Section>
            </Content>
        </Page>
    );
}

export default OrcamentoDetailPage;
