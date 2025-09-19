import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    IdcardOutlined,
    MailOutlined,
    TeamOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import * as usuarioService from '../../services/usuarioService';
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Spin,
    Row,
    Col,
    Tag,
    Popconfirm,
    Avatar
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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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
    
    &.ant-btn-dangerous {
      border-color: #ff4d4f;
      color: #ff4d4f;
      
      &:hover {
        background: #ff4d4f;
        border-color: #ff4d4f;
        color: white;
      }
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
  
  .ant-spin {
    .ant-spin-text {
      font-size: 18px;
      color: #00529b;
      font-weight: 500;
    }
  }
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #00529b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8e8e8;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  
  .info-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  .info-value {
    font-size: 16px;
    color: #333;
    font-weight: 600;
  }
`;

const ProfileCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #00529b;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  
  .profile-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .profile-value {
    font-size: 18px;
    color: #00529b;
    font-weight: 700;
  }
`;

function UsuarioDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsuarioDetails = async () => {
            try {
                const usuarioData = await usuarioService.getUsuarioById(id);
                setUsuario(usuarioData);
            } catch (err) {
                message.error('Falha ao carregar os detalhes do usuário.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsuarioDetails();
    }, [id]);

    const handleDelete = async () => {
        try {
            await usuarioService.deleteUsuario(id);
            message.success('Usuário excluído com sucesso!');
            navigate('/admin/usuarios');
        } catch (err) {
            console.error('Erro ao deletar usuário:', err);
            message.error('Falha ao deletar usuário.');
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
                return 'Administrador';
            case 'TECNICO':
                return 'Técnico';
            default:
                return perfil;
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <Typography.Text>Carregando dados do usuário...</Typography.Text>
                </LoadingContainer>
            </PageContainer>
        );
    }

    if (!usuario) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Typography.Text>Usuário não encontrado.</Typography.Text>
                </LoadingContainer>
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
                        onClick={() => navigate(-1)}
                        style={{ fontSize: '18px', color: '#00529b' }}
                    />
                    <TitleStyled level={2}>
                        <Space>
                            <UserOutlined />
                            <span>Detalhes do Usuário</span>
                        </Space>
                    </TitleStyled>
                </TitleContainer>
                <ActionButtons>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/usuarios/editar/${id}`)}
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="Excluir Usuário"
                        description={`Deseja realmente excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`}
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

            <StyledCard
                title={
                    <Space>
                        <UserOutlined />
                        <span>{usuario.nome}</span>
                    </Space>
                }
            >
                <SectionTitle>
                    <InfoCircleOutlined />
                    <span>Informações Gerais</span>
                </SectionTitle>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <InfoCard>
                            <div className="info-label">Nome Completo</div>
                            <div className="info-value">{usuario.nome}</div>
                        </InfoCard>
                    </Col>
                    <Col xs={24} md={12}>
                        <InfoCard>
                            <div className="info-label">Email</div>
                            <div className="info-value">{usuario.email}</div>
                        </InfoCard>
                    </Col>
                    {usuario.cracha && (
                        <Col xs={24} md={12}>
                            <InfoCard>
                                <div className="info-label">Crachá</div>
                                <div className="info-value">{usuario.cracha}</div>
                            </InfoCard>
                        </Col>
                    )}
                </Row>
            </StyledCard>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <StyledCard
                        title={
                            <Space>
                                <TeamOutlined />
                                <span>Perfil</span>
                            </Space>
                        }
                    >
                        <ProfileCard>
                            <div className="profile-label">Tipo de Usuário</div>
                            <div className="profile-value">
                                <Tag color={getProfileColor(usuario.perfil)} size="large">
                                    {getProfileText(usuario.perfil)}
                                </Tag>
                            </div>
                        </ProfileCard>
                    </StyledCard>
                </Col>
                <Col xs={24} md={12}>
                    <StyledCard
                        title={
                            <Space>
                                <UserOutlined />
                                <span>Avatar</span>
                            </Space>
                        }
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Avatar
                                size={80}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#00529b', fontSize: '32px' }}
                            />
                        </div>
                    </StyledCard>
                </Col>
            </Row>
        </PageContainer>
    );
}

export default UsuarioDetailPage; 
