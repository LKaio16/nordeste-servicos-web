import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Calendar,
    Modal,
    List
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined,
    DownloadOutlined,
    PlusOutlined,
    EyeOutlined,
    UserOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CalendarFilled
} from '@ant-design/icons';
import styled from 'styled-components';
import * as osService from '../../services/osService';

const { Title, Text } = Typography;

// Styled Components
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
  align-items: center;
  gap: 8px;
  
  .client-name {
    font-weight: 500;
    color: #00529b;
  }
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
`;

const TechInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  
  .tech-name {
    color: #00529b;
    font-weight: 500;
  }
`;

const OrdensServicoPage = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateOS, setSelectedDateOS] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Função para tratar imagens base64
    const getImageSrc = (imageData) => {
        if (!imageData) return null;

        // Se já é uma URL completa, retorna como está
        if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
            return imageData;
        }

        // Se é base64, adiciona o prefixo data:image
        if (imageData.startsWith('data:image/')) {
            return imageData;
        }

        // Se é base64 sem prefixo, adiciona o prefixo
        if (imageData.startsWith('/9j/') || imageData.startsWith('iVBORw0KGgo') || imageData.startsWith('R0lGOD')) {
            return `data:image/jpeg;base64,${imageData}`;
        }

        return imageData;
    };

    const fetchOrdensServico = useCallback(async (page = 0, size = 20, search = '') => {
        try {
            const data = await osService.getAllOrdensServico(search, page, size);
            setOrdensServico(data);
            
            // Lógica melhorada para estimar o total
            if (data.length < size) {
                // Se retornou menos que o tamanho da página, é a última página
                setPagination(prev => ({ 
                    ...prev, 
                    total: page * size + data.length 
                }));
            } else {
                // Se retornou exatamente o tamanho da página, pode haver mais
                // Estimamos que há pelo menos mais uma página
                setPagination(prev => ({ 
                    ...prev, 
                    total: (page + 2) * size // Estimativa: assume pelo menos mais uma página
                }));
            }
        } catch (err) {
            message.error("Falha ao carregar as Ordens de Serviço.");
            console.error("Erro ao buscar ordens de serviço:", err);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const page = pagination.current - 1; // Ant Design usa 1-based, API usa 0-based
            await fetchOrdensServico(page, pagination.pageSize, searchTerm);
            setIsLoading(false);
        }
        loadData();
    }, [pagination.current, pagination.pageSize, searchTerm, fetchOrdensServico]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        const page = pagination.current - 1;
        await fetchOrdensServico(page, pagination.pageSize, searchTerm);
        setIsRefreshing(false);
    };

    const handleTableChange = (newPagination) => {
        setPagination({
            ...pagination,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };

    const handleViewDetails = (id) => {
        navigate(`/admin/os/detalhes/${id}`);
    };

    const handleRowClick = (record) => {
        handleViewDetails(record.id);
    };

    const handleEdit = (id) => {
        navigate(`/admin/os/editar/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await osService.deleteOrdemServico(id);
            setOrdensServico(prev => prev.filter(o => o.id !== id));
            message.success('Ordem de serviço excluída com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar ordem de serviço:', err);
            message.error("Falha ao excluir a Ordem de Serviço.");
        }
    };

    const handleDownloadPdf = async (id) => {
        try {
            await osService.downloadOsPdf(id);
            message.success('Download iniciado!');
        } catch (err) {
            console.error('Erro ao baixar PDF:', err);
            message.error("Falha ao baixar o PDF.");
        }
    };

    // Função para obter OS de uma data específica
    const getOSByDate = (date) => {
        const dateStr = date.format('YYYY-MM-DD');
        return ordensServico.filter(os => {
            const osDate = new Date(os.dataAbertura).toISOString().split('T')[0];
            return osDate === dateStr;
        });
    };

    // Função para renderizar o calendário
    const renderCalendar = () => {
        const dateCellRender = (value) => {
            const listData = getOSByDate(value);
            return (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {listData.map((os) => (
                        <li key={os.id} style={{ marginBottom: 2 }}>
                            <Tag
                                color={getStatusColor(os.status)}
                                style={{ fontSize: '10px', padding: '1px 4px' }}
                            >
                                OS #{os.id}
                            </Tag>
                        </li>
                    ))}
                </ul>
            );
        };

        return (
            <Calendar
                dateCellRender={dateCellRender}
                onSelect={(date) => {
                    const listData = getOSByDate(date);
                    setSelectedDate(date);
                    setSelectedDateOS(listData);
                    setShowCalendar(true);
                }}
            />
        );
    };

    // Função para renderizar a lista de OS do dia selecionado
    const renderOSList = () => {
        if (!selectedDate || selectedDateOS.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Nenhuma ordem de serviço encontrada para esta data.</p>
                </div>
            );
        }

        return (
            <List
                dataSource={selectedDateOS}
                renderItem={(os) => (
                    <List.Item
                        actions={[
                            <Button
                                type="primary"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => {
                                    setShowCalendar(false);
                                    handleViewDetails(os.id);
                                }}
                            >
                                Ver Detalhes
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    size="small"
                                    src={getImageSrc(os.cliente?.fotoPerfil)}
                                    icon={!getImageSrc(os.cliente?.fotoPerfil) && <UserOutlined />}
                                    style={{
                                        backgroundColor: getImageSrc(os.cliente?.fotoPerfil) ? 'transparent' : '#00529b'
                                    }}
                                />
                            }
                            title={
                                <div>
                                    <span style={{ fontWeight: 'bold', color: '#00529b' }}>
                                        OS #{os.id}
                                    </span>
                                    <StatusTag
                                        color={getStatusColor(os.status)}
                                        style={{ marginLeft: '8px' }}
                                    >
                                        {os.status}
                                    </StatusTag>
                                </div>
                            }
                            description={
                                <div>
                                    <div><strong>Cliente:</strong> {os.cliente?.nomeCompleto || 'N/A'}</div>
                                    {os.tecnicoAtribuido?.nome && (
                                        <div><strong>Técnico:</strong> {os.tecnicoAtribuido.nome}</div>
                                    )}
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        );
    };

    // Função para obter a cor do status
    const getStatusColor = (status) => {
        switch (status) {
            case 'EM_ABERTO':
                return 'blue';
            case 'EM_ANDAMENTO':
                return 'orange';
            case 'CONCLUIDA':
                return 'green';
            case 'CANCELADA':
                return 'red';
            default:
                return 'default';
        }
    };

    // Configuração das colunas da tabela
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a, b) => a.id - b.id,
            render: (id) => (
                <Badge
                    count={id}
                    overflowCount={999999}
                    style={{
                        backgroundColor: '#00529b',
                        fontSize: '12px',
                        fontWeight: '600'
                    }}
                />
            ),
        },
        {
            title: 'Cliente',
            dataIndex: ['cliente', 'nomeCompleto'],
            key: 'cliente',
            render: (text, record) => {
                const clientImageSrc = getImageSrc(record.cliente?.fotoPerfil);
                return (
                    <ClientInfo>
                        <Avatar
                            size="small"
                            src={clientImageSrc}
                            icon={!clientImageSrc && <UserOutlined />}
                            style={{
                                backgroundColor: clientImageSrc ? 'transparent' : '#00529b'
                            }}
                        />
                        <span className="client-name">{text || 'N/A'}</span>
                    </ClientInfo>
                );
            },
        },
        {
            title: 'Data de Abertura',
            dataIndex: 'dataAbertura',
            key: 'dataAbertura',
            responsive: ['md'],
            render: (date) => (
                <DateInfo>
                    <CalendarOutlined />
                    <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
                </DateInfo>
            ),
            sorter: (a, b) => new Date(a.dataAbertura) - new Date(b.dataAbertura),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <StatusTag color={getStatusColor(status)}>
                    {status}
                </StatusTag>
            ),
            filters: [
                { text: 'EM_ABERTO', value: 'EM_ABERTO' },
                { text: 'EM_ANDAMENTO', value: 'EM_ANDAMENTO' },
                { text: 'CONCLUIDA', value: 'CONCLUIDA' },
                { text: 'CANCELADA', value: 'CANCELADA' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Técnico',
            dataIndex: ['tecnicoAtribuido', 'nome'],
            key: 'tecnico',
            responsive: ['md'],
            render: (text, record) => {
                const techImageSrc = getImageSrc(record.tecnicoAtribuido?.fotoPerfil);
                return (
                    <TechInfo>
                        <Avatar
                            size="small"
                            src={techImageSrc}
                            icon={!techImageSrc && <UserOutlined />}
                            style={{
                                backgroundColor: techImageSrc ? 'transparent' : '#52c41a'
                            }}
                        />
                        <span className="tech-name">{text || 'N/A'}</span>
                    </TechInfo>
                );
            },
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
                                handleViewDetails(record.id);
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
                                handleEdit(record.id);
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
                                handleDownloadPdf(record.id);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Excluir Ordem de Serviço"
                        description={`Deseja realmente excluir a OS #${record.id}?`}
                        onConfirm={(e) => {
                            e?.stopPropagation();
                            handleDelete(record.id);
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

    return (
        <PageContainer>
            <HeaderContainer>
                <TitleStyled level={2}>
                    <Space>
                        <CalendarOutlined />
                        <span>Ordens de Serviço</span>
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
                        icon={<CalendarFilled />}
                        onClick={() => setShowCalendar(true)}
                    >
                        Calendário
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/os/novo')}
                    >
                        Nova Ordem de Serviço
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            <StyledCard>
                <StyledTable
                    columns={columns}
                    dataSource={ordensServico}
                    rowKey="id"
                    loading={isLoading}
                    onChange={handleTableChange}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                        style: { cursor: 'pointer' }
                    })}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} de ${total || '?'} ordens de serviço`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        style: {
                            marginTop: '24px',
                            textAlign: 'center'
                        }
                    }}
                    scroll={{ x: 1000 }}
                    size="middle"
                />
            </StyledCard>

            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarFilled style={{ color: '#00529b' }} />
                        <span>Calendário de Ordens de Serviço</span>
                    </div>
                }
                open={showCalendar}
                onCancel={() => setShowCalendar(false)}
                footer={null}
                width={800}
                style={{ top: 20 }}
            >
                <div style={{ marginBottom: '20px' }}>
                    {renderCalendar()}
                </div>

                {selectedDate && (
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e8e8e8'
                    }}>
                        <Title level={4} style={{ margin: '0 0 16px 0', color: '#00529b' }}>
                            Ordens de Serviço - {selectedDate.format('DD/MM/YYYY')}
                        </Title>
                        {renderOSList()}
                    </div>
                )}
            </Modal>
        </PageContainer>
    );
};

export default OrdensServicoPage; 
