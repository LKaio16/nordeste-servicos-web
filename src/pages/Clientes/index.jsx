import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    PlusOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    EyeOutlined,
    MailOutlined,
    PhoneOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import * as clienteService from '../../services/clienteService';
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Spin,
    Table,
    Popconfirm,
    Tooltip,
    Avatar,
    Tag
} from 'antd';

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
    cursor: pointer;
    
    &:hover {
      background: linear-gradient(135deg, #f8f9ff 0%, #e6f7ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 82, 155, 0.1);
    }
  }
  
  .ant-table-tbody > tr > td {
    padding: 16px 12px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &.ant-btn-primary {
    background: #00529b;
    border-color: #00529b;
    
    &:hover {
      background: #0066cc;
      border-color: #0066cc;
      transform: translateY(-1px);
    }
  }
  
  &.ant-btn-default {
    border-color: #d9d9d9;
    
    &:hover {
      border-color: #00529b;
      color: #00529b;
    }
  }
  
  &.ant-btn-dangerous {
    border-color: #ff4d4f;
    color: #ff4d4f;
    
    &:hover {
      background: #ff4d4f;
      border-color: #ff4d4f;
      color: white;
    }
  }
`;

const ClientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .client-name {
    color: #00529b;
    font-weight: 600;
    font-size: 16px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .email {
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .phone {
    color: #00529b;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    }
`;


const Clientes = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const fetchClientes = useCallback(async () => {
        try {
            const data = await clienteService.getAllClientes();
            setClientes(data);
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
            message.error('Não foi possível carregar a lista de clientes.');
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchClientes();
            setIsLoading(false);
        }
        loadData();
    }, [fetchClientes]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchClientes();
        setIsRefreshing(false);
    };

    const handleRowClick = (record) => {
        navigate(`/admin/clientes/detalhes/${record.id}`);
    };

    const handleEdit = (id) => {
        navigate(`/admin/clientes/editar/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await clienteService.deleteCliente(id);
            setClientes(prev => prev.filter(c => c.id !== id));
            message.success('Cliente excluído com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar cliente:', err);
            const errorMessage = err.response?.data?.message || 'Falha ao excluir o cliente. Verifique se ele não está associado a equipamentos ou ordens de serviço.';
            message.error(errorMessage);
        }
    };

    const handleDownloadExcel = async () => {
        setIsDownloading(true);
        try {
            const blob = await clienteService.downloadClientesExcel();

            // Criar URL para o blob
            const url = window.URL.createObjectURL(blob);

            // Criar elemento de link temporário para download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'clientes.xlsx';
            document.body.appendChild(link);
            link.click();

            // Limpar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            message.success('Arquivo Excel baixado com sucesso!');
        } catch (err) {
            console.error('Erro ao baixar Excel:', err);
            message.error('Falha ao baixar o arquivo Excel.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Definição das colunas da tabela
    const columns = [
        {
            title: 'Cliente',
            key: 'cliente',
            render: (_, record) => (
                <ClientInfo>
                    <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: '#00529b' }} />
                    <div>
                        <div className="client-name">{record.nomeCompleto}</div>
                        {record.email && (
                            <div className="email">
                                <Space size="small">
                                    <MailOutlined />
                                    {record.email}
                                </Space>
                            </div>
                        )}
                    </div>
                </ClientInfo>
            ),
        },
        {
            title: 'Contato',
            dataIndex: 'telefonePrincipal',
            key: 'contato',
            render: (telefone) => (
                <ContactInfo>
                    {telefone && (
                        <div className="phone">
                            <Space size="small">
                                <PhoneOutlined />
                                {telefone}
                            </Space>
                        </div>
                    )}
                </ContactInfo>
            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 120,
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
                                handleEdit(record.id);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Excluir Cliente"
                        description={`Deseja realmente excluir o cliente "${record.nomeCompleto}"?`}
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
                        <UserOutlined />
                        <span>Clientes</span>
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
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadExcel}
                        loading={isDownloading}
                    >
                        Exportar Excel
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/clientes/novo')}
                    >
                        Novo Cliente
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            <StyledCard>
                <StyledTable
                    columns={columns}
                    dataSource={clientes}
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
                            `${range[0]}-${range[1]} de ${total} clientes`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    locale={{
                        emptyText: 'Nenhum cliente encontrado',
                    }}
                />
            </StyledCard>
        </PageContainer>
    );
};

export default Clientes; 
