import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    ArrowLeftOutlined,
    PlusOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    EyeOutlined
} from '@ant-design/icons';
import * as usuarioService from '../../services/usuarioService';
import {
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Card,
    Typography,
    Tooltip,
    Avatar,
    Tag,
    Spin
} from 'antd';

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

const TitleStyled = styled(Typography.Title)`
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .ant-table-thead > tr > th {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 2px solid #00529b;
    color: #00529b;
    font-weight: 600;
    font-size: 14px;
    text-align: center;
  }
  
  .ant-table-tbody > tr {
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 82, 155, 0.1);
    }
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 12px;
    vertical-align: middle;
  }
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  font-weight: 500;
  height: 32px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.ant-btn-primary {
    background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
    border: none;
    
    &:hover {
      background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
      transform: translateY(-1px);
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .user-details {
    display: flex;
    flex-direction: column;
    
    .user-name {
      font-weight: 600;
      color: #00529b;
      font-size: 14px;
    }
    
    .user-email {
      font-size: 12px;
      color: #666;
    }
  }
`;

const ProfileTag = styled(Tag)`
  border-radius: 6px;
  font-weight: 500;
  font-size: 12px;
  padding: 4px 8px;
  border: none;
  
  &.admin {
    background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
    color: white;
  }
  
  &.tecnico {
    background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
    color: white;
  }
`;

function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const navigate = useNavigate();

    const fetchUsuarios = useCallback(async () => {
        try {
            const data = await usuarioService.getAllUsuarios();
            setUsuarios(data);
        } catch (err) {
            message.error('Erro ao carregar usuários.');
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchUsuarios();
            setIsLoading(false);
        }
        loadData();
    }, [fetchUsuarios]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchUsuarios();
        setIsRefreshing(false);
    };

    const handleRowClick = (record) => {
        navigate(`/admin/usuarios/detalhes/${record.id}`);
    };

    const handleDelete = async (id) => {
        try {
            await usuarioService.deleteUsuario(id);
            message.success('Usuário excluído com sucesso!');
            setUsuarios(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            message.error('Erro ao excluir usuário.');
        }
    };

    const getProfileColor = (perfil) => {
        switch (perfil) {
            case 'ADMIN':
                return 'red';
            case 'TECNICO':
                return 'green';
            default:
                return 'default';
        }
    };

    const getProfileText = (perfil) => {
        switch (perfil) {
            case 'ADMIN':
                return 'Admin';
            case 'TECNICO':
                return 'Técnico';
            default:
                return perfil;
        }
    };

    const columns = [
        {
            title: 'Usuário',
            dataIndex: 'nome',
            key: 'nome',
            width: 300,
            render: (text, record) => (
                <UserInfo>
                    <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: '#00529b' }}
                    />
                    <div className="user-details">
                        <div className="user-name">{record.nome}</div>
                        <div className="user-email">{record.email}</div>
                    </div>
                </UserInfo>
            ),
        },
        {
            title: 'Perfil',
            dataIndex: 'perfil',
            key: 'perfil',
            width: 120,
            render: (perfil) => (
                <ProfileTag color={getProfileColor(perfil)}>
                    {getProfileText(perfil)}
                </ProfileTag>
            ),
            filters: [
                { text: 'Admin', value: 'ADMIN' },
                { text: 'Técnico', value: 'TECNICO' },
            ],
            onFilter: (value, record) => record.perfil === value,
        },
        {
            title: 'Crachá',
            dataIndex: 'cracha',
            key: 'cracha',
            width: 120,
            render: (cracha) => cracha || '-',
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Ver detalhes">
                        <ActionButton
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/admin/usuarios/detalhes/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Editar">
                        <ActionButton
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/usuarios/editar/${record.id}`)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Excluir Usuário"
                        description={`Deseja realmente excluir o usuário "${record.nome}"?`}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sim"
                        cancelText="Não"
                        okType="danger"
                    >
                        <Tooltip title="Excluir">
                            <ActionButton
                                danger
                                icon={<DeleteOutlined />}
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
                        <span>Usuários</span>
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
                        onClick={() => navigate('/admin/usuarios/novo')}
                    >
                        Novo Usuário
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            <StyledCard>
                <StyledTable
                    columns={columns}
                    dataSource={usuarios}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} usuários`,
                    }}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                        style: { cursor: 'pointer' }
                    })}
                    locale={{
                        emptyText: 'Nenhum usuário encontrado'
                    }}
                />
            </StyledCard>
        </PageContainer>
    );
}

export default UsuariosPage; 
