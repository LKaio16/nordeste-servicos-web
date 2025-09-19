import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    UserOutlined,
    EditOutlined,
    IdcardOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { getClienteById, updateCliente } from '../../services/clienteService';
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Form,
    Input,
    Select,
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
  
  .ant-input,
  .ant-select-selector {
    height: 48px;
    font-size: 16px;
    border: 2px solid #d9d9d9;
    border-radius: 8px;
    
    &:hover {
      border-color: #00529b;
    }
    
    &:focus,
    &.ant-input-focused,
    &.ant-select-focused .ant-select-selector {
      border-color: #00529b;
      box-shadow: 0 0 0 2px rgba(0, 82, 155, 0.2);
    }
  }
  
  .ant-select-selector {
    height: 48px !important;
    
    .ant-select-selection-item {
      line-height: 44px;
    }
  }
  
  .ant-form-item-explain-error {
    font-size: 14px;
  }
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #00529b;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8e8e8;
  display: flex;
  align-items: center;
  gap: 8px;
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

// --- Helper functions for masks ---
const formatCEP = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
};

const formatPhone = (value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 11);
    if (cleanValue.length > 10) {
        return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

const formatCPF_CNPJ = (value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 14);
    if (cleanValue.length <= 11) {
        return cleanValue
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cleanValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};
// ------------------------------------


function ClienteEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [clienteData, setClienteData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCliente = async () => {
            if (!id) {
                setIsLoading(false);
                message.error("ID do cliente não fornecido.");
                return;
            }
            try {
                const data = await getClienteById(id);
                setClienteData(data);

                // Apply masks to data coming from API and set form values
                form.setFieldsValue({
                    ...data,
                    cep: formatCEP(data.cep || ''),
                    cpfCnpj: formatCPF_CNPJ(data.cpfCnpj || ''),
                    telefonePrincipal: formatPhone(data.telefonePrincipal || ''),
                    telefoneAdicional: formatPhone(data.telefoneAdicional || ''),
                });
            } catch (err) {
                console.error('Erro ao buscar dados do cliente:', err);
                message.error('Não foi possível carregar os dados do cliente.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCliente();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            // Remove masks before sending to backend
            const payload = {
                ...values,
                cep: values.cep?.replace(/\D/g, '') || '',
                cpfCnpj: values.cpfCnpj?.replace(/\D/g, '') || '',
                telefonePrincipal: values.telefonePrincipal?.replace(/\D/g, '') || '',
                telefoneAdicional: values.telefoneAdicional?.replace(/\D/g, '') || '',
            };
            await updateCliente(id, payload);
            message.success('Cliente atualizado com sucesso!');
            navigate(`/admin/clientes/detalhes/${id}`);
        } catch (err) {
            console.error('Erro ao atualizar cliente:', err);
            message.error('Falha ao atualizar cliente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <Text>Carregando dados do cliente...</Text>
                </LoadingContainer>
            </PageContainer>
        );
    }

    if (!clienteData) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Text>Cliente não encontrado.</Text>
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <StyledCard
                title={
                    <Space>
                        <UserOutlined />
                        <span>Editar Cliente</span>
                    </Space>
                }
            >
                <HeaderContainer>
                    <TitleStyled level={2}>
                        <Space>
                            <EditOutlined />
                            <span>Editar Cliente: {clienteData.nomeCompleto}</span>
                        </Space>
                    </TitleStyled>
                    <ActionButtons>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(`/admin/clientes/detalhes/${id}`)}
                        >
                            Voltar
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={() => form.submit()}
                            loading={isSubmitting}
                        >
                            Salvar Alterações
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
                                name="nomeCompleto"
                                label={
                                    <Space>
                                        <UserOutlined />
                                        <span>Nome Completo</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, insira o nome completo!' },
                                    { min: 2, message: 'O nome deve ter pelo menos 2 caracteres!' }
                                ]}
                            >
                                <Input
                                    placeholder="Digite o nome completo do cliente..."
                                    showCount
                                    maxLength={100}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="tipoCliente"
                                label={
                                    <Space>
                                        <IdcardOutlined />
                                        <span>Tipo de Cliente</span>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Por favor, selecione o tipo de cliente!' }]}
                            >
                                <Select placeholder="Selecione o tipo de cliente...">
                                    <Select.Option value="PESSOA_FISICA">Pessoa Física</Select.Option>
                                    <Select.Option value="PESSOA_JURIDICA">Pessoa Jurídica</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="cpfCnpj"
                                label={
                                    <Space>
                                        <IdcardOutlined />
                                        <span>CPF/CNPJ</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, insira o CPF ou CNPJ!' }
                                ]}
                            >
                                <Input
                                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                    onChange={(e) => {
                                        const formatted = formatCPF_CNPJ(e.target.value);
                                        form.setFieldsValue({ cpfCnpj: formatted });
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="telefonePrincipal"
                                label={
                                    <Space>
                                        <PhoneOutlined />
                                        <span>Telefone Principal</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, insira o telefone principal!' }
                                ]}
                            >
                                <Input
                                    placeholder="(00) 00000-0000"
                                    onChange={(e) => {
                                        const formatted = formatPhone(e.target.value);
                                        form.setFieldsValue({ telefonePrincipal: formatted });
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="telefoneAdicional"
                                label={
                                    <Space>
                                        <PhoneOutlined />
                                        <span>Telefone Adicional</span>
                                    </Space>
                                }
                            >
                                <Input
                                    placeholder="(00) 00000-0000"
                                    onChange={(e) => {
                                        const formatted = formatPhone(e.target.value);
                                        form.setFieldsValue({ telefoneAdicional: formatted });
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="email"
                                label={
                                    <Space>
                                        <MailOutlined />
                                        <span>Email</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, insira o email!' },
                                    { type: 'email', message: 'Por favor, insira um email válido!' }
                                ]}
                            >
                                <Input
                                    placeholder="Digite o email do cliente..."
                                    type="email"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <SectionTitle>
                                <HomeOutlined />
                                <span>Endereço</span>
                            </SectionTitle>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="cep"
                                label="CEP"
                                rules={[
                                    { required: true, message: 'Por favor, insira o CEP!' }
                                ]}
                            >
                                <Input
                                    placeholder="00000-000"
                                    onChange={(e) => {
                                        const formatted = formatCEP(e.target.value);
                                        form.setFieldsValue({ cep: formatted });
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={16}>
                            <Form.Item
                                name="rua"
                                label="Rua"
                                rules={[
                                    { required: true, message: 'Por favor, insira a rua!' }
                                ]}
                            >
                                <Input placeholder="Digite o nome da rua..." />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="numero"
                                label="Número"
                                rules={[
                                    { required: true, message: 'Por favor, insira o número!' }
                                ]}
                            >
                                <Input placeholder="Digite o número..." />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={16}>
                            <Form.Item
                                name="complemento"
                                label="Complemento"
                            >
                                <Input placeholder="Digite o complemento (opcional)..." />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="bairro"
                                label="Bairro"
                                rules={[
                                    { required: true, message: 'Por favor, insira o bairro!' }
                                ]}
                            >
                                <Input placeholder="Digite o bairro..." />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="cidade"
                                label="Cidade"
                                rules={[
                                    { required: true, message: 'Por favor, insira a cidade!' }
                                ]}
                            >
                                <Input placeholder="Digite a cidade..." />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="estado"
                                label="Estado (UF)"
                                rules={[
                                    { required: true, message: 'Por favor, insira o estado!' },
                                    { max: 2, message: 'O estado deve ter no máximo 2 caracteres!' }
                                ]}
                            >
                                <Input
                                    placeholder="Ex: SP, RJ, MG..."
                                    maxLength={2}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </StyledForm>
            </StyledCard>
        </PageContainer>
    );
};

export default ClienteEdit; 
