import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    ToolOutlined,
    PlusOutlined,
    DollarOutlined,
    ShopOutlined,
    BarcodeOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { pecaMaterialService } from '../../services/pecaMaterialService';
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Form,
    Input,
    Row,
    Col,
    Spin
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
    height: 48px;
    padding: 0 20px;
    font-size: 16px;
    border: 2px solid #d9d9d9;
    
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
      border: 2px solid #d9d9d9;
      color: #333;
      
      &:hover {
        background: #f5f5f5;
        border-color: #00529b;
        color: #00529b;
      }
    }
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .ant-input {
    height: 48px;
    font-size: 16px;
    border: 2px solid #d9d9d9;
    border-radius: 8px;
    
    &:hover {
      border-color: #00529b;
    }
    
    &:focus,
    &.ant-input-focused {
      border-color: #00529b;
      box-shadow: 0 0 0 2px rgba(0, 82, 155, 0.2);
    }
  }
  
  .ant-form-item-explain-error {
    font-size: 14px;
  }
`;

function PecaCreate() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            // Verificar se o código já existe
            const codigoExists = await pecaMaterialService.checkCodigoExists(values.codigo);
            if (codigoExists) {
                message.error(`O código '${values.codigo}' já está em uso. Por favor, insira um código diferente.`);
                return;
            }

            const pecaData = {
                ...values,
                preco: parseFloat(values.preco),
                estoque: parseInt(values.estoque, 10)
            };
            await pecaMaterialService.createPeca(pecaData);
            message.success('Peça criada com sucesso!');
            navigate('/admin/pecas');
        } catch (err) {
            console.error('Erro ao criar peça:', err);
            message.error(err.message || 'Falha ao criar a peça. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <StyledCard
                title={
                    <Space>
                        <ToolOutlined />
                        <span>Nova Peça</span>
                    </Space>
                }
            >
                <HeaderContainer>
                    <TitleStyled level={2}>
                        <Space>
                            <PlusOutlined />
                            <span>Cadastrar Nova Peça</span>
                        </Space>
                    </TitleStyled>
                    <ActionButtons>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/admin/pecas')}
                        >
                            Voltar
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={() => form.submit()}
                            loading={isSubmitting}
                        >
                            Salvar Peça
                        </Button>
                    </ActionButtons>
                </HeaderContainer>

                <StyledForm
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Form.Item
                                name="descricao"
                                label={
                                    <Space>
                                        <ToolOutlined />
                                        <span>Descrição</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, insira a descrição da peça!' },
                                    { min: 2, message: 'A descrição deve ter pelo menos 2 caracteres!' }
                                ]}
                            >
                                <Input
                                    placeholder="Digite a descrição da peça..."
                                    showCount
                                    maxLength={100}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="fabricante"
                                label={
                                    <Space>
                                        <SettingOutlined />
                                        <span>Fabricante</span>
                                    </Space>
                                }
                            >
                                <Input
                                    placeholder="Digite o fabricante..."
                                    showCount
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="modelo"
                                label={
                                    <Space>
                                        <SettingOutlined />
                                        <span>Modelo</span>
                                    </Space>
                                }
                            >
                                <Input
                                    placeholder="Digite o modelo..."
                                    showCount
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="codigo"
                                label={
                                    <Space>
                                        <BarcodeOutlined />
                                        <span>Código</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, insira o código da peça!' }
                                ]}
                            >
                                <Input
                                    placeholder="Digite o código da peça..."
                                    showCount
                                    maxLength={30}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="preco"
                                label={
                                    <Space>
                                        <DollarOutlined />
                                        <span>Preço (R$)</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, insira o preço!' },
                                    {
                                        pattern: /^\d+(\.\d{1,2})?$/,
                                        message: 'Digite um preço válido (ex: 10.50)'
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    placeholder="0.00"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="estoque"
                                label={
                                    <Space>
                                        <ShopOutlined />
                                        <span>Estoque</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, insira a quantidade em estoque!' },
                                    {
                                        pattern: /^\d+$/,
                                        message: 'Digite um número válido (ex: 10)'
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </StyledForm>
            </StyledCard>
        </PageContainer>
    );
};

export default PecaCreate; 
