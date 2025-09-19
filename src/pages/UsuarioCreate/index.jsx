import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    UserOutlined,
    PlusOutlined,
    IdcardOutlined,
    MailOutlined,
    LockOutlined,
    TeamOutlined
} from '@ant-design/icons';
import * as usuarioService from '../../services/usuarioService';
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Form,
    Input,
    Select,
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
  
  .ant-btn {
    height: 48px;
    font-size: 16px;
    border-radius: 8px;
    border: 2px solid #d9d9d9;
    font-weight: 600;
  }
`;

function UsuarioCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            await usuarioService.createUsuario({ ...values, perfis: [values.perfil] });
            message.success('Usuário criado com sucesso!');
            navigate('/admin/usuarios');
        } catch (err) {
            message.error(err.message || 'Falha ao criar usuário.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <HeaderContainer>
                <TitleStyled level={2}>
                    <Space>
                        <UserOutlined />
                        <span>Novo Usuário</span>
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
                        <PlusOutlined />
                        <span>Dados do Usuário</span>
                    </Space>
                }
            >
                <StyledForm
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        perfil: 'TECNICO'
                    }}
                >
                    <Form.Item
                        name="nome"
                        label="Nome Completo"
                        rules={[
                            { required: true, message: 'Por favor, insira o nome do usuário!' },
                            { min: 2, message: 'Nome deve ter pelo menos 2 caracteres!' },
                            { max: 100, message: 'Nome deve ter no máximo 100 caracteres!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Digite o nome completo"
                            showCount
                            maxLength={100}
                        />
                    </Form.Item>

                    <Form.Item
                        name="cracha"
                        label="Crachá"
                        rules={[
                            { max: 20, message: 'Crachá deve ter no máximo 20 caracteres!' }
                        ]}
                    >
                        <Input
                            prefix={<IdcardOutlined />}
                            placeholder="Digite o número do crachá (opcional)"
                            showCount
                            maxLength={20}
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Por favor, insira o email!' },
                            { type: 'email', message: 'Por favor, insira um email válido!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Digite o email"
                            type="email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="senha"
                        label="Senha"
                        rules={[
                            { required: true, message: 'Por favor, insira a senha!' },
                            { min: 6, message: 'Senha deve ter pelo menos 6 caracteres!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Digite a senha"
                        />
                    </Form.Item>

                    <Form.Item
                        name="perfil"
                        label="Perfil"
                        rules={[
                            { required: true, message: 'Por favor, selecione o perfil!' }
                        ]}
                    >
                        <Select
                            placeholder="Selecione o perfil"
                            suffixIcon={<TeamOutlined />}
                        >
                            <Select.Option value="ADMIN">Administrador</Select.Option>
                            <Select.Option value="TECNICO">Técnico</Select.Option>
                        </Select>
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
                            {isSubmitting ? 'Criando...' : 'Criar Usuário'}
                        </Button>
                    </Form.Item>
                </StyledForm>
            </StyledCard>
        </PageContainer>
    );
}

export default UsuarioCreatePage; 
