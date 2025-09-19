import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    ToolOutlined,
    EditOutlined,
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
    Spin,
    Form,
    Input,
    Row,
    Col
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
  
  .ant-btn {
    height: 48px;
    font-size: 16px;
    border-radius: 8px;
    border: 2px solid #d9d9d9;
    font-weight: 600;
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

function PecaEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPeca = async () => {
            try {
                const data = await pecaMaterialService.getPecaById(id);
                form.setFieldsValue({
                    descricao: data.descricao || '',
                    codigo: data.codigo || '',
                    preco: data.preco || '',
                    estoque: data.estoque || '',
                    fabricante: data.fabricante || '',
                    modelo: data.modelo || ''
                });
            } catch (error) {
                console.error('Erro ao buscar dados da peça:', error);
                message.error('Não foi possível carregar os dados da peça.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchPeca();
        }
    }, [id, form]);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const pecaData = {
                ...values,
                preco: parseFloat(values.preco),
                estoque: parseInt(values.estoque, 10)
            };
            await pecaMaterialService.updatePeca(id, pecaData);
            message.success('Peça atualizada com sucesso!');
            navigate('/admin/pecas');
        } catch (error) {
            console.error('Erro ao atualizar peça:', error);
            message.error('Falha ao atualizar peça.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <Typography.Text>Carregando dados da peça...</Typography.Text>
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <HeaderContainer>
                <TitleStyled level={2}>
                    <Space>
                        <ToolOutlined />
                        <span>Editar Peça</span>
                    </Space>
                </TitleStyled>
                <ActionButtons>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Voltar
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            <StyledCard
                title={
                    <Space>
                        <EditOutlined />
                        <span>Dados da Peça</span>
                    </Space>
                }
            >
                <StyledForm
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="descricao"
                        label="Descrição"
                        rules={[
                            { required: true, message: 'Por favor, insira a descrição da peça!' },
                            { min: 2, message: 'Descrição deve ter pelo menos 2 caracteres!' },
                            { max: 200, message: 'Descrição deve ter no máximo 200 caracteres!' }
                        ]}
                    >
                        <Input
                            prefix={<ToolOutlined />}
                            placeholder="Digite a descrição da peça"
                            showCount
                            maxLength={200}
                        />
                    </Form.Item>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="codigo"
                                label="Código"
                                rules={[
                                    { max: 50, message: 'Código deve ter no máximo 50 caracteres!' }
                                ]}
                            >
                                <Input
                                    prefix={<BarcodeOutlined />}
                                    placeholder="Digite o código da peça (opcional)"
                                    showCount
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="fabricante"
                                label="Fabricante"
                                rules={[
                                    { max: 100, message: 'Fabricante deve ter no máximo 100 caracteres!' }
                                ]}
                            >
                                <Input
                                    prefix={<SettingOutlined />}
                                    placeholder="Digite o fabricante (opcional)"
                                    showCount
                                    maxLength={100}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="modelo"
                                label="Modelo"
                                rules={[
                                    { max: 100, message: 'Modelo deve ter no máximo 100 caracteres!' }
                                ]}
                            >
                                <Input
                                    prefix={<SettingOutlined />}
                                    placeholder="Digite o modelo (opcional)"
                                    showCount
                                    maxLength={100}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="preco"
                                label="Preço"
                                rules={[
                                    { required: true, message: 'Por favor, insira o preço!' },
                                    { pattern: /^\d+(\.\d{1,2})?$/, message: 'Digite um preço válido (ex: 10.50)' }
                                ]}
                            >
                                <Input
                                    prefix={<DollarOutlined />}
                                    placeholder="Digite o preço"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="estoque"
                        label="Estoque"
                        rules={[
                            { required: true, message: 'Por favor, insira a quantidade em estoque!' },
                            { pattern: /^\d+$/, message: 'Digite um número válido (ex: 10)' }
                        ]}
                    >
                        <Input
                            prefix={<ShopOutlined />}
                            placeholder="Digite a quantidade em estoque"
                            type="number"
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={isSubmitting}
                            size="large"
                            block
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </Form.Item>
                </StyledForm>
            </StyledCard>
        </PageContainer>
    );
};

export default PecaEdit; 
