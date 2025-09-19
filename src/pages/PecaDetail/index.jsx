import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    ToolOutlined,
    DollarOutlined,
    ShopOutlined,
    BarcodeOutlined,
    SettingOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { pecaMaterialService } from '../../services/pecaMaterialService';
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
    Popconfirm
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

const PriceCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #00529b;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  
  .price-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .price-value {
    font-size: 24px;
    color: #00529b;
    font-weight: 700;
  }
`;

const StockCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #00529b;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  
  .stock-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .stock-value {
    font-size: 24px;
    color: #00529b;
    font-weight: 700;
  }
`;

function PecaDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [peca, setPeca] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPeca = async () => {
            try {
                const data = await pecaMaterialService.getPecaById(id);
                setPeca(data);
            } catch (err) {
                console.error(err);
                message.error('Falha ao carregar dados da peça.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchPeca();
        }
    }, [id]);

    const handleDelete = async () => {
        try {
            await pecaMaterialService.deletePeca(id);
            message.success('Peça excluída com sucesso!');
            navigate('/admin/pecas');
        } catch (err) {
            console.error('Erro ao deletar peça:', err);
            const errorMessage = err.response?.data?.message || 'Falha ao excluir a peça. Verifique se ela não está associada a orçamentos ou ordens de serviço.';
            message.error(errorMessage);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    };

    const getStockColor = (stock) => {
        if (stock > 10) return 'green';
        if (stock > 5) return 'orange';
        return 'red';
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <Text>Carregando dados da peça...</Text>
                </LoadingContainer>
            </PageContainer>
        );
    }

    if (!peca) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Text>Peça não encontrada.</Text>
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
                            <ToolOutlined />
                            <span>Detalhes da Peça</span>
                        </Space>
                    </TitleStyled>
                </TitleContainer>
                <ActionButtons>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/pecas/editar/${id}`)}
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="Excluir Peça"
                        description={`Deseja realmente excluir a peça "${peca.descricao}"? Esta ação não pode ser desfeita.`}
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
                        <ToolOutlined />
                        <span>{peca.descricao}</span>
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
                            <div className="info-label">Descrição</div>
                            <div className="info-value">{peca.descricao}</div>
                        </InfoCard>
                    </Col>
                    <Col xs={24} md={12}>
                        <InfoCard>
                            <div className="info-label">Código</div>
                            <div className="info-value">{peca.codigo}</div>
                        </InfoCard>
                    </Col>
                    {peca.fabricante && (
                        <Col xs={24} md={12}>
                            <InfoCard>
                                <div className="info-label">Fabricante</div>
                                <div className="info-value">{peca.fabricante}</div>
                            </InfoCard>
                        </Col>
                    )}
                    {peca.modelo && (
                        <Col xs={24} md={12}>
                            <InfoCard>
                                <div className="info-label">Modelo</div>
                                <div className="info-value">{peca.modelo}</div>
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
                                <DollarOutlined />
                                <span>Preço</span>
                            </Space>
                        }
                    >
                        <PriceCard>
                            <div className="price-label">Preço de Venda</div>
                            <div className="price-value">{formatPrice(peca.preco)}</div>
                        </PriceCard>
                    </StyledCard>
                </Col>
                <Col xs={24} md={12}>
                    <StyledCard
                        title={
                            <Space>
                                <ShopOutlined />
                                <span>Estoque</span>
                            </Space>
                        }
                    >
                        <StockCard>
                            <div className="stock-label">Quantidade Disponível</div>
                            <div className="stock-value">
                                <Tag color={getStockColor(peca.estoque)} size="large">
                                    {peca.estoque} unidades
                                </Tag>
                            </div>
                        </StockCard>
                    </StyledCard>
                </Col>
            </Row>
        </PageContainer>
    );
}

export default PecaDetailPage;
