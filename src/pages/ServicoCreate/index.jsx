import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  ToolOutlined,
  PlusOutlined
} from '@ant-design/icons';
import tipoServicoService from '../../services/tipoServicoService';
import {
  Card,
  Button,
  Typography,
  Space,
  message,
  Form,
  Input
} from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

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
    }
`;

const StyledForm = styled(Form)`
    .ant-form-item-label > label {
        font-weight: 600;
        color: #00529b;
        font-size: 16px;
    }
    
    .ant-input {
        border-radius: 8px;
        border: 2px solid #d9d9d9;
        font-size: 16px;
        height: 48px;
        min-height: 48px;
        
        &:hover {
            border-color: #00529b;
        }
        
        &:focus, 
        &.ant-input-focused {
            border-color: #00529b;
            box-shadow: 0 0 0 2px rgba(0, 82, 155, 0.1);
        }
    }
    
    .ant-btn {
        font-size: 16px;
        height: 48px;
        padding: 0 24px;
        border: 2px solid #d9d9d9;
    }
`;

function ServicoCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await tipoServicoService.createTipoServico(values);
      message.success('Serviço criado com sucesso!');
      navigate('/admin/servicos');
    } catch (err) {
      message.error(err.message || 'Falha ao criar o tipo de serviço.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <StyledCard>
        <HeaderContainer>
          <TitleStyled level={2}>
            <Space>
              <PlusOutlined />
              <span>Novo Tipo de Serviço</span>
            </Space>
          </TitleStyled>
          <ActionButtons>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/servicos')}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={isSubmitting}
              onClick={() => form.submit()}
            >
              Salvar Serviço
            </Button>
          </ActionButtons>
        </HeaderContainer>

        <StyledForm
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="descricao"
            label={
              <Space>
                <ToolOutlined />
                <span>Descrição do Serviço</span>
              </Space>
            }
            rules={[
              { required: true, message: 'Por favor, digite a descrição do serviço!' },
              { min: 3, message: 'A descrição deve ter pelo menos 3 caracteres!' },
              { max: 100, message: 'A descrição deve ter no máximo 100 caracteres!' }
            ]}
          >
            <Input
              placeholder="Digite a descrição do serviço..."
              showCount
              maxLength={100}
            />
          </Form.Item>
        </StyledForm>
      </StyledCard>
    </PageContainer>
  );
}

export default ServicoCreatePage; 
