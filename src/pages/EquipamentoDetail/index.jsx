import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    ToolOutlined,
    UserOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import * as equipamentoService from '../../services/equipamentoService';
import * as clienteService from '../../services/clienteService';
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
    Descriptions,
    Popconfirm
} from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

// Styled Components
const PageContainer = styled.div`
    padding: 0 24px 24px 24px;
    background-color: #f5f5f5;
    min-height: 100vh;
`;

const StyledCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: none;
    margin-bottom: 24px;
    
    .ant-card-body {
        padding: 32px;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const TitleStyled = styled(Title)`
    color: #00529b !important;
    margin: 0 !important;
    font-size: 28px !important;
    font-weight: 700 !important;
`;

const ActionButtons = styled(Space)`
    .ant-btn {
        height: 40px;
        padding: 0 20px;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
        
        &.ant-btn-primary {
            background: linear-gradient(135deg, #00529b 0%, #0066cc 100%);
            border: none;
            box-shadow: 0 2px 8px rgba(0, 82, 155, 0.3);
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 82, 155, 0.4);
            }
        }
        
        &.ant-btn-default {
            border: 2px solid #d9d9d9;
            color: #666;
            
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
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    
    .ant-spin {
        margin-bottom: 16px;
    }
    
    .loading-text {
        color: #00529b;
        font-size: 18px;
        font-weight: 600;
    }
`;

const SectionTitle = styled(Title)`
    color: #00529b !important;
    font-size: 20px !important;
    font-weight: 600 !important;
    margin-bottom: 20px !important;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const InfoCard = styled.div`
    background: linear-gradient(135deg, #f8f9ff 0%, #e6f7ff 100%);
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    
    .info-label {
        color: #666;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
    }
    
    .info-value {
        color: #00529b;
        font-size: 16px;
        font-weight: 600;
    }
`;

function EquipamentoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipamento, setEquipamento] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEquipamentoDetails = async () => {
            try {
                const equipamentoData = await equipamentoService.getEquipamentoById(id);
                setEquipamento(equipamentoData);

                if (equipamentoData.clienteId) {
                    const clienteData = await clienteService.getClienteById(equipamentoData.clienteId);
                    setCliente(clienteData);
                }
            } catch (err) {
                message.error('Falha ao carregar os detalhes do equipamento.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEquipamentoDetails();
        }
    }, [id]);

    const handleDelete = async () => {
        try {
            await equipamentoService.deleteEquipamento(id);
            message.success('Equipamento excluído com sucesso!');
            navigate('/admin/equipamentos');
        } catch (err) {
            console.error('Erro ao deletar equipamento:', err);
            message.error('Falha ao deletar equipamento.');
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <div className="loading-text">Carregando detalhes do equipamento...</div>
                </LoadingContainer>
            </PageContainer>
        );
    }

    if (!equipamento) {
        return (
            <PageContainer>
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Text style={{ fontSize: '18px', color: '#666' }}>Equipamento não encontrado</Text>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <StyledCard>
                <HeaderContainer>
                    <TitleContainer>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            type="text"
                            style={{ padding: '4px 8px' }}
                        />
                        <TitleStyled level={2}>
                            <Space>
                                <ToolOutlined />
                                <span>Detalhes do Equipamento</span>
                            </Space>
                        </TitleStyled>
                    </TitleContainer>
                    <ActionButtons>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/equipamentos/editar/${id}`)}
                        >
                            Editar
                        </Button>
                        <Popconfirm
                            title="Excluir Equipamento"
                            description={`Deseja realmente excluir o equipamento "${equipamento.marcaModelo}"?`}
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

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <StyledCard>
                            <SectionTitle level={3}>
                                <Space>
                                    <ToolOutlined />
                                    <span>Informações do Equipamento</span>
                                </Space>
                            </SectionTitle>

                            <InfoCard>
                                <div className="info-label">Tipo</div>
                                <div className="info-value">{equipamento.tipo}</div>
                            </InfoCard>

                            <InfoCard>
                                <div className="info-label">Marca/Modelo</div>
                                <div className="info-value">{equipamento.marcaModelo}</div>
                            </InfoCard>

                            <InfoCard>
                                <div className="info-label">Número de Série/Chassi</div>
                                <div className="info-value">{equipamento.numeroSerieChassi || 'N/A'}</div>
                            </InfoCard>

                            {equipamento.horimetro && (
                                <InfoCard>
                                    <div className="info-label">Horímetro</div>
                                    <div className="info-value">{equipamento.horimetro} horas</div>
                                </InfoCard>
                            )}
                        </StyledCard>
                    </Col>

                    <Col xs={24} lg={12}>
                        <StyledCard>
                            <SectionTitle level={3}>
                                <Space>
                                    <UserOutlined />
                                    <span>Cliente Proprietário</span>
                                </Space>
                            </SectionTitle>

                            {cliente ? (
                                <InfoCard>
                                    <div className="info-label">Nome Completo</div>
                                    <div className="info-value">{cliente.nomeCompleto}</div>
                                </InfoCard>
                            ) : (
                                <InfoCard>
                                    <div className="info-label">Cliente</div>
                                    <div className="info-value" style={{ color: '#999' }}>Nenhum cliente vinculado</div>
                                </InfoCard>
                            )}
                        </StyledCard>
                    </Col>

                    {equipamento.observacoes && (
                        <Col xs={24}>
                            <StyledCard>
                                <SectionTitle level={3}>
                                    <Space>
                                        <InfoCircleOutlined />
                                        <span>Observações</span>
                                    </Space>
                                </SectionTitle>

                                <InfoCard>
                                    <div className="info-value" style={{ lineHeight: '1.6' }}>
                                        {equipamento.observacoes}
                                    </div>
                                </InfoCard>
                            </StyledCard>
                        </Col>
                    )}
                </Row>
            </StyledCard>
        </PageContainer>
    );
}

export default EquipamentoDetailPage; 
