import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import orcamentoService from '../../services/orcamentoService';
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
    Tag,
    Popconfirm,
    Table,
    Descriptions,
    Statistic
} from 'antd';
import {
    DownloadOutlined,
    EditOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    UserOutlined,
    CalendarOutlined,
    DollarOutlined,
    FileTextOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Styled Components - Mesma estrutura das outras páginas
const PageContainer = styled.div`
  padding: 0 24px 24px 24px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 82, 155, 0.1);
    border: none;
  overflow: hidden;
  margin-bottom: 24px;
  
  .ant-card-head {
    background: linear-gradient(135deg, #00529b 0%, #003d73 100%);
    border-bottom: none;
    
    .ant-card-head-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }
  }
  
  .ant-card-body {
    padding: 32px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
`;

const TitleContainer = styled.div`
    display: flex;
  align-items: center;
  gap: 16px;
`;

const TitleStyled = styled(Title)`
  color: #00529b !important;
  margin: 0 !important;
  font-weight: 700 !important;
  font-size: 28px !important;
`;

const ActionButtons = styled(Space)`
  .ant-btn {
    border-radius: 8px;
    font-weight: 500;
    height: 44px;
    padding: 0 24px;
    font-size: 16px;
    border: 2px solid #d9d9d9;
    
    &.ant-btn-primary {
      background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
      border: 2px solid #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
        border-color: #40a9ff;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
      }
    }
    
    &.ant-btn-default {
      background: white;
      border: 2px solid #d9d9d9;
      color: #333;
      
      &:hover {
        background: #f5f5f5;
        border-color: #00529b;
        color: #00529b;
      }
    }
    
    &.ant-btn-dangerous {
      background: white;
      border: 2px solid #ff4d4f;
      color: #ff4d4f;
      
      &:hover {
        background: #fff2f0;
        border-color: #ff7875;
        color: #ff7875;
      }
    }
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  }
  
  .ant-table-thead > tr > th {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 2px solid #00529b;
    font-weight: 600;
    color: #00529b;
    padding: 16px 12px;
  }
  
  .ant-table-tbody > tr {
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 82, 155, 0.1);
    }
    
    > td {
      padding: 16px 12px;
      border-bottom: 1px solid #f0f0f0;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-direction: column;
  gap: 16px;
  
  .ant-typography {
    font-size: 18px;
    color: #666;
  }
`;

const StatusTag = styled(Tag)`
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: 500;
  border: none;
  font-size: 12px;
`;

const StatisticCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #e8e8e8;
  
  .ant-statistic-title {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .ant-statistic-content {
    color: #00529b;
    font-size: 24px;
    font-weight: 700;
  }
`;

function OrcamentoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orcamento, setOrcamento] = useState(null);
    const [itens, setItens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Função para extrair o valor do status
    const extractStatusValue = (status) => {
        if (!status) return 'N/A';

        // Se é string, retorna diretamente
        if (typeof status === 'string') {
            return status;
        }

        // Se é objeto, tenta diferentes propriedades
        if (typeof status === 'object') {
            return status.value ||
                status.nome ||
                status.descricao ||
                status.status ||
                status.name ||
                status.label ||
                status.text ||
                status.descricaoStatus ||
                status.nomeStatus ||
                Object.values(status).find(val => typeof val === 'string') ||
                'Status Desconhecido';
        }

        return String(status);
    };

    // Função para obter cor do status
    const getStatusColor = (status) => {
        const statusValue = extractStatusValue(status);
        const statusString = String(statusValue).toUpperCase();

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

    // Função para formatar data sem problemas de timezone
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        // Parse a data como string YYYY-MM-DD para evitar conversão de timezone
        return dayjs(dateString, 'YYYY-MM-DD').format('DD/MM/YYYY');
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const [orcamentoData, itensData] = await Promise.all([
                    orcamentoService.getOrcamentoById(id),
                    orcamentoService.getItensByOrcamentoId(id)
                ]);
                setOrcamento(orcamentoData);
                setItens(itensData);

                // Debug removido - status funcionando corretamente
            } catch (err) {
                message.error('Erro ao carregar detalhes do orçamento: ' + err.message);
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
            message.error('Erro ao excluir orçamento: ' + err.message);
        }
    };

    const handleDownload = async () => {
        try {
            await orcamentoService.downloadOrcamentoPdf(id);
            message.success('Download iniciado!');
        } catch (err) {
            message.error('Erro ao baixar PDF: ' + err.message);
        }
    };

    const handleEdit = () => {
        navigate(`/admin/orcamentos/editar/${id}`);
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Definição das colunas da tabela de itens
    const columns = [
        {
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'descricao',
            render: (text) => (
                <Text strong style={{ color: '#00529b' }}>
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
            render: (value) => (
                <Text>{value || 0}</Text>
            ),
        },
        {
            title: 'Preço Unitário',
            dataIndex: 'valorUnitario',
            key: 'valorUnitario',
            width: 140,
            align: 'right',
            render: (value) => (
                <Text strong style={{ color: '#52c41a' }}>
                    R$ {(value || 0).toFixed(2)}
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
                <Text strong style={{ color: '#00529b', fontSize: '16px' }}>
                    R$ {(value || 0).toFixed(2)}
                </Text>
            ),
        },
    ];

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <Text>Carregando detalhes do orçamento...</Text>
                </LoadingContainer>
            </PageContainer>
        );
    }

    if (!orcamento) {
        return (
            <PageContainer>
                <StyledCard>
                    <Text type="danger">Orçamento não encontrado.</Text>
                </StyledCard>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <HeaderContainer>
                <TitleContainer>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        style={{ fontSize: '20px', color: '#00529b' }}
                    />
                    <TitleStyled level={2}>
                        Detalhes do Orçamento #{orcamento.numeroOrcamento}
                    </TitleStyled>
                </TitleContainer>
                <ActionButtons>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleDownload}
                    >
                        Baixar PDF
                    </Button>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleEdit}
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="Excluir Orçamento"
                        description={`Deseja realmente excluir o orçamento #${orcamento.numeroOrcamento}?`}
                        onConfirm={handleDelete}
                        okText="Sim"
                        cancelText="Não"
                        okType="danger"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Excluir
                        </Button>
                    </Popconfirm>
                </ActionButtons>
            </HeaderContainer>

            {/* Informações Gerais */}
            <StyledCard title="Informações Gerais">
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
                                valueStyle={{ color: '#00529b', fontSize: '18px' }}
                            />
                        </StatisticCard>
                    </Col>
                    <Col xs={24} md={8}>
                        <StatisticCard>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '8px',
                                    color: '#00529b',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    <CheckCircleOutlined style={{ marginRight: '8px' }} />
                                    <span>Status</span>
                                </div>
                                <div style={{
                                    backgroundColor: '#fa8c16',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'inline-block'
                                }}>
                                    PENDENTE
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
                                        <span>Valor Total</span>
                                    </Space>
                                }
                                value={orcamento.valorTotal?.toFixed(2) || '0,00'}
                                prefix="R$"
                                valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                            />
                        </StatisticCard>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                        <StatisticCard>
                            <Statistic
                                title={
                                    <Space>
                                        <CalendarOutlined />
                                        <span>Data de Emissão</span>
                                    </Space>
                                }
                                value={formatDate(orcamento.dataEmissao)}
                                valueStyle={{ color: '#00529b', fontSize: '18px' }}
                            />
                        </StatisticCard>
                    </Col>
                    <Col xs={24} md={12}>
                        <StatisticCard>
                            <Statistic
                                title={
                                    <Space>
                                        <CalendarOutlined />
                                        <span>Data de Validade</span>
                                    </Space>
                                }
                                value={formatDate(orcamento.dataValidade)}
                                valueStyle={{ color: '#00529b', fontSize: '18px' }}
                            />
                        </StatisticCard>
                    </Col>
                </Row>
            </StyledCard>

            {/* Itens do Orçamento */}
            <StyledCard title="Itens do Orçamento">
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
                                    <Text strong style={{ fontSize: '16px', color: '#00529b' }}>
                                        Total Geral:
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                    <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                                        R$ {total.toFixed(2)}
                                    </Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        );
                    }}
                />
            </StyledCard>
        </PageContainer>
    );
}

export default OrcamentoDetailPage; 
