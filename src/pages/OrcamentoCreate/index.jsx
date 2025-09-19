import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orcamentoService from '../../services/orcamentoService';
import { getAllClientes } from '../../services/clienteService';
import * as osService from '../../services/osService';
import {
    Card,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Typography,
    Space,
    message,
    Spin,
    Row,
    Col,
    Divider
} from 'antd';
import {
    SaveOutlined,
    ArrowLeftOutlined,
    UserOutlined,
    FileTextOutlined,
    CalendarOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
    padding: 32px;
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
    padding: 0 24px;
    font-size: 16px;
    border: 2px solid #d9d9d9;
    
    &.ant-btn-primary {
      background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
      border: 2px solid #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
        border-color: #40a9ff;
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
    font-weight: 600;
    color: #00529b;
    font-size: 16px;
  }
  
  /* Padronização de todos os inputs */
  .ant-input, 
  .ant-select-selector, 
  .ant-picker {
    border-radius: 8px;
    border: 2px solid #d9d9d9;
    font-size: 16px;
    height: 48px;
    min-height: 48px;
    
    &:hover, &:focus {
      border-color: #00529b;
      box-shadow: 0 0 0 2px rgba(0, 82, 155, 0.1);
    }
  }
  
  /* Inputs de texto */
  .ant-input {
    font-size: 16px;
    padding: 12px 16px;
    height: 48px;
    line-height: 1.5;
  }
  
  /* Selects */
  .ant-select {
    .ant-select-selector {
      height: 48px !important;
      min-height: 48px !important;
      border: 2px solid #d9d9d9;
      
      .ant-select-selection-item {
        font-size: 16px;
        line-height: 44px;
        height: 44px;
      }
      
      .ant-select-selection-placeholder {
        font-size: 16px;
        line-height: 44px;
        height: 44px;
      }
      
      .ant-select-selection-search {
        height: 44px;
        
        .ant-select-selection-search-input {
          height: 44px;
          font-size: 16px;
        }
      }
    }
    
    &.ant-select-focused .ant-select-selector {
      border-color: #00529b;
      box-shadow: 0 0 0 2px rgba(0, 82, 155, 0.1);
    }
  }
  
  /* DatePicker */
  .ant-picker {
    height: 48px;
    min-height: 48px;
    border: 2px solid #d9d9d9;
    
    .ant-picker-input {
      height: 44px;
      
      > input {
        font-size: 16px;
        height: 44px;
        line-height: 44px;
      }
    }
    
    &.ant-picker-focused {
      border-color: #00529b;
      box-shadow: 0 0 0 2px rgba(0, 82, 155, 0.1);
    }
  }
  
  /* TextArea */
  textarea.ant-input {
    font-size: 16px;
    padding: 12px 16px;
    min-height: 120px;
    height: auto;
    border: 2px solid #d9d9d9;
    line-height: 1.5;
    
    &:hover, &:focus {
      border-color: #00529b;
      box-shadow: 0 0 0 2px rgba(0, 82, 155, 0.1);
    }
  }
  
  /* Botões */
  .ant-btn {
    font-size: 16px;
    height: 48px;
    padding: 0 24px;
    border-radius: 8px;
    font-weight: 500;
  }
  
  /* Mensagens de erro */
  .ant-form-item-explain {
    font-size: 14px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-direction: column;
  gap: 16px;
  
  .ant-typography {
    font-size: 18px;
    color: #666;
  }
`;

function OrcamentoCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [clientes, setClientes] = useState([]);
    const [ordensServico, setOrdensServico] = useState([]);
    const [ordensServicoFiltradas, setOrdensServicoFiltradas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [clientesData, osData] = await Promise.all([
                    getAllClientes(),
                    osService.getAllOrdensServico()
                ]);
                setClientes(clientesData);
                setOrdensServico(osData);
                // Inicialmente, não mostra nenhuma OS (até que um cliente seja selecionado)
                setOrdensServicoFiltradas([]);
            } catch (fetchError) {
                console.error("Erro ao carregar dados dos dropdowns:", fetchError);
                message.error('Falha ao carregar dados da página.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDropdownData();
    }, []);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            // Converter a data para o formato esperado
            const formData = {
                ...values,
                dataValidade: values.dataValidade ? values.dataValidade.format('YYYY-MM-DD') : null,
                status: values.status || 'PENDENTE'
            };

            const novoOrcamento = await orcamentoService.createOrcamento(formData);
            message.success('Orçamento criado com sucesso!');
            navigate(`/admin/orcamentos/detalhes/${novoOrcamento.id}`);
        } catch (submitError) {
            console.error("Erro ao criar orçamento:", submitError);
            message.error('Falha ao criar o orçamento. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/orcamentos');
    };

    // Função para filtrar OS baseadas no cliente selecionado
    const handleClienteChange = (clienteId) => {
        if (clienteId) {
            // Filtra as OS que pertencem ao cliente selecionado
            const osFiltradas = ordensServico.filter(os =>
                os.cliente && os.cliente.id === clienteId
            );
            setOrdensServicoFiltradas(osFiltradas);
        } else {
            // Se nenhum cliente selecionado, mostra todas as OS
            setOrdensServicoFiltradas(ordensServico);
        }

        // Limpa a seleção de OS quando o cliente muda
        form.setFieldsValue({ ordemServicoOrigemId: undefined });
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <Text>Carregando dados...</Text>
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <HeaderContainer>
                <TitleStyled level={2}>
                    Novo Orçamento
                </TitleStyled>
                <ActionButtons>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleCancel}
                    >
                        Voltar
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            <StyledCard title="Informações do Orçamento">
                <StyledForm
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        status: 'PENDENTE'
                    }}
                >
                    <Row gutter={[24, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="clienteId"
                                label={
                                    <Space>
                                        <UserOutlined />
                                        <span>Cliente</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, selecione um cliente!' }
                                ]}
                            >
                                <Select
                                    placeholder="Selecione um cliente"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={handleClienteChange}
                                    allowClear
                                >
                                    {clientes.map(cliente => (
                                        <Option key={cliente.id} value={cliente.id}>
                                            {cliente.nomeCompleto}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="ordemServicoOrigemId"
                                label={
                                    <Space>
                                        <FileTextOutlined />
                                        <span>OS de Origem (Opcional)</span>
                                    </Space>
                                }
                            >
                                <Select
                                    placeholder={
                                        form.getFieldValue('clienteId')
                                            ? "Selecione uma OS do cliente"
                                            : "Primeiro selecione um cliente"
                                    }
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                    disabled={!form.getFieldValue('clienteId')}
                                >
                                    {ordensServicoFiltradas.map(os => (
                                        <Option key={os.id} value={os.id}>
                                            {os.numeroOS} - {os.cliente?.nomeCompleto || 'Cliente não encontrado'}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="status"
                                label={
                                    <Space>
                                        <CheckCircleOutlined />
                                        <span>Status</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, selecione o status!' }
                                ]}
                            >
                                <Select>
                                    <Option value="PENDENTE">Pendente</Option>
                                    <Option value="APROVADO">Aprovado</Option>
                                    <Option value="REJEITADO">Rejeitado</Option>
                                    <Option value="CANCELADO">Cancelado</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="dataValidade"
                                label={
                                    <Space>
                                        <CalendarOutlined />
                                        <span>Data de Validade</span>
                                    </Space>
                                }
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Selecione a data"
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="observacoesCondicoes"
                                label={
                                    <Space>
                                        <FileTextOutlined />
                                        <span>Observações e Condições</span>
                                    </Space>
                                }
                            >
                                <TextArea
                                    rows={5}
                                    placeholder="Digite as observações e condições do orçamento..."
                                    maxLength={1000}
                                    showCount
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Row justify="end">
                        <Space>
                            <Button
                                onClick={handleCancel}
                                size="large"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={isSubmitting}
                                size="large"
                            >
                                {isSubmitting ? 'Criando...' : 'Criar Orçamento'}
                            </Button>
                        </Space>
                    </Row>
                </StyledForm>
            </StyledCard>
        </PageContainer>
    );
}

export default OrcamentoCreatePage; 
