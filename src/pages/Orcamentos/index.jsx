import { useState, useEffect, useCallback } from 'react';
import orcamentoService from '../../services/orcamentoService';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiDownload, FiRefreshCw, FiUser, FiDollarSign } from 'react-icons/fi';
import {
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Card,
    Typography,
    Tag,
    Tooltip,
    Spin,
    Badge,
    Avatar,
    ConfigProvider
} from 'antd';
import {
    FileTextOutlined,
    ReloadOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    UserOutlined,
    DollarOutlined,
    EyeOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

// Styled Components - Mesma estrutura da página de OS
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
    padding: 0 24px 24px 24px;
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
  color: #333;
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
    height: 40px;
    padding: 0 20px;
    
    &.ant-btn-primary {
      background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
      }
    }
    
    &.ant-btn-default {
      background: white;
      border: 1px solid #d9d9d9;
      color: #333;
      
      &:hover {
        background: #f5f5f5;
        border-color: #00529b;
        color: #00529b;
      }
    }
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
  }
  
  .ant-table-thead > tr > th {
    background: #fff;
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
    }
    
    > td {
      padding: 16px 12px;
      border-bottom: 1px solid #f0f0f0;
    }
  }
  
  .ant-table-pagination {
    margin-top: 24px;
    text-align: center;
  }
`;

const StatusTag = styled(Tag)`
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: 500;
  border: none;
  font-size: 12px;
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ClientInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  
  .ant-avatar {
    flex-shrink: 0;
  }
  
  .client-name {
    font-weight: 500;
    color: #00529b;
  }
`;

const ValueInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #52c41a;
`;

function OrcamentosPage() {
    const [orcamentos, setOrcamentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Função para obter cor do status
    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
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

    // Função para tratar imagens base64
    const getImageSrc = (imageData) => {
        if (!imageData) return null;
        if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
            return imageData;
        }
        if (imageData.startsWith('data:image/')) {
            return imageData;
        }
        if (imageData.startsWith('/9j/') || imageData.startsWith('iVBORw0KGgo') || imageData.startsWith('R0lGOD')) {
            return `data:image/jpeg;base64,${imageData}`;
        }
        return imageData;
    };

    const fetchOrcamentos = useCallback(async () => {
        try {
            const data = await orcamentoService.getAllOrcamentos();
            setOrcamentos(data);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchOrcamentos();
            setIsLoading(false);
        }
        loadData();
    }, [fetchOrcamentos]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchOrcamentos();
        setIsRefreshing(false);
    };

    const handleRowClick = (record) => {
        navigate(`/admin/orcamentos/detalhes/${record.id}`);
    };

    const handleDelete = async (orcamento) => {
        try {
            await orcamentoService.deleteOrcamento(orcamento.id);
            setOrcamentos(prev => prev.filter(o => o.id !== orcamento.id));
            message.success('Orçamento excluído com sucesso!');
        } catch (deleteError) {
            message.error('Erro ao excluir orçamento: ' + deleteError.message);
        }
    };

    const handleDownload = async (orcamento) => {
        try {
            await orcamentoService.downloadOrcamentoPdf(orcamento.id);
            message.success('Download iniciado!');
        } catch (downloadError) {
            message.error('Erro ao baixar PDF: ' + downloadError.message);
        }
    };

    // Definição das colunas da tabela
    const columns = [
        {
            title: 'Número',
            dataIndex: 'numeroOrcamento',
            key: 'numeroOrcamento',
            width: 160,
            render: (text) => (
                <Typography.Text strong style={{ color: '#00529b' }}>
                    #{text}
                </Typography.Text>
            ),
        },
        {
            title: 'Cliente',
            dataIndex: 'nomeCliente',
            key: 'nomeCliente',
            width: 200,
            render: (text, record) => (
                <ClientInfo>
                    <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        style={{ backgroundColor: '#00529b' }}
                    />
                    <span className="client-name">{text || 'N/A'}</span>
                </ClientInfo>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <StatusTag color={getStatusColor(status)}>
                    {status}
                </StatusTag>
            ),
            filters: [
                { text: 'Pendente', value: 'PENDENTE' },
                { text: 'Aprovado', value: 'APROVADO' },
                { text: 'Rejeitado', value: 'REJEITADO' },
                { text: 'Cancelado', value: 'CANCELADO' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Valor Total',
            dataIndex: 'valorTotal',
            key: 'valorTotal',
            width: 140,
            render: (value) => {
                const formatCurrency = (val) => {
                    if (val == null || val === undefined) return '0,00';
                    const formatted = Math.abs(val).toFixed(2);
                    const parts = formatted.split('.');
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    return parts.join(',');
                };
                return (
                    <ValueInfo>
                        <DollarOutlined />
                        <span>R$ {formatCurrency(value)}</span>
                    </ValueInfo>
                );
            },
            sorter: (a, b) => a.valorTotal - b.valorTotal,
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 180,
            render: (_, record) => (
                <Space size="small" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Ver detalhes">
                        <ActionButton
                            type="primary"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Editar">
                        <ActionButton
                            type="default"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/orcamentos/editar/${record.id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Baixar PDF">
                        <ActionButton
                            type="default"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(record);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Excluir Orçamento"
                        description={`Deseja realmente excluir o orçamento #${record.numeroOrcamento}?`}
                        onConfirm={(e) => {
                            e?.stopPropagation();
                            handleDelete(record);
                        }}
                        okText="Sim"
                        cancelText="Não"
                        okType="danger"
                    >
                        <Tooltip title="Excluir">
                            <ActionButton
                                type="default"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    if (error) {
        return (
            <PageContainer>
                <StyledCard>
                    <Typography.Text type="danger">{error}</Typography.Text>
                </StyledCard>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <HeaderContainer>
                <TitleStyled level={2}>
                    <Space>
                        <FileTextOutlined />
                        <span>Orçamentos</span>
                    </Space>
                </TitleStyled>
                <ActionButtons>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        loading={isRefreshing}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/orcamentos/novo')}
                    >
                        Novo Orçamento
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            <StyledCard>
                <StyledTable
                    columns={columns}
                    dataSource={orcamentos}
                    rowKey="id"
                    loading={isLoading}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                        style: { cursor: 'pointer' }
                    })}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} de ${total} orçamentos`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    locale={{
                        emptyText: 'Nenhum orçamento encontrado',
                    }}
                />
            </StyledCard>
        </PageContainer>
    );
}

export default OrcamentosPage; 
