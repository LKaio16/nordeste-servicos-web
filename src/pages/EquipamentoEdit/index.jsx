import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    ToolOutlined,
    EditOutlined,
    UserOutlined
} from '@ant-design/icons';
import { getEquipamentoById, updateEquipamento } from '../../services/equipamentoService';
import { getAllClientes } from '../../services/clienteService';
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Spin,
    Form,
    Input,
    Select,
    Row,
    Col
} from 'antd';
import styled from 'styled-components';

const { Title } = Typography;
const { Option } = Select;

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
    
    .ant-input, 
    .ant-select-selector {
        border-radius: 8px;
        border: 2px solid #d9d9d9;
        font-size: 16px;
        height: 48px;
        min-height: 48px;
        
        &:hover {
            border-color: #00529b;
        }
        
        &:focus, 
        &.ant-input-focused,
        &.ant-select-focused .ant-select-selector {
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

function EquipamentoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [equipamentoData, clientesData] = await Promise.all([
                    getEquipamentoById(id),
                    getAllClientes()
                ]);

                form.setFieldsValue({
                    tipo: equipamentoData.tipo || '',
                    marcaModelo: equipamentoData.marcaModelo || '',
                    numeroSerieChassi: equipamentoData.numeroSerieChassi || '',
                    horimetro: equipamentoData.horimetro || 0,
                    clienteId: equipamentoData.clienteId || null
                });

                setClientes(clientesData);
            } catch (error) {
                message.error(error.message || 'Falha ao carregar dados do equipamento.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchData();
        }
    }, [id, form]);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            await updateEquipamento(id, values);
            message.success('Equipamento atualizado com sucesso!');
            navigate('/admin/equipamentos');
        } catch (err) {
            message.error(err.message || 'Falha ao atualizar o equipamento.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <div className="loading-text">Carregando dados do equipamento...</div>
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <StyledCard>
                <HeaderContainer>
                    <TitleStyled level={2}>
                        <Space>
                            <EditOutlined />
                            <span>Editar Equipamento</span>
                        </Space>
                    </TitleStyled>
                    <ActionButtons>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/admin/equipamentos')}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={isSubmitting}
                            onClick={() => form.submit()}
                        >
                            Salvar Alterações
                        </Button>
                    </ActionButtons>
                </HeaderContainer>

                <StyledForm
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    size="large"
                >
                    <Row gutter={[24, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="tipo"
                                label={
                                    <Space>
                                        <ToolOutlined />
                                        <span>Tipo do Equipamento</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, digite o tipo do equipamento!' },
                                    { min: 2, message: 'O tipo deve ter pelo menos 2 caracteres!' }
                                ]}
                            >
                                <Input
                                    placeholder="Ex: Trator, Colheitadeira, Implemento..."
                                    showCount
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="marcaModelo"
                                label={
                                    <Space>
                                        <ToolOutlined />
                                        <span>Marca/Modelo</span>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Por favor, digite a marca/modelo!' },
                                    { min: 2, message: 'A marca/modelo deve ter pelo menos 2 caracteres!' }
                                ]}
                            >
                                <Input
                                    placeholder="Ex: John Deere 6110J, Case IH 2388..."
                                    showCount
                                    maxLength={100}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="numeroSerieChassi"
                                label={
                                    <Space>
                                        <ToolOutlined />
                                        <span>Número de Série/Chassi</span>
                                    </Space>
                                }
                            >
                                <Input
                                    placeholder="Digite o número de série ou chassi..."
                                    showCount
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="horimetro"
                                label={
                                    <Space>
                                        <ToolOutlined />
                                        <span>Horímetro (horas)</span>
                                    </Space>
                                }
                                rules={[
                                    {
                                        pattern: /^\d+(\.\d+)?$/,
                                        message: 'Digite um número válido (ex: 100 ou 100.5)'
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Digite as horas do equipamento (ex: 100.5)..."
                                    min={0}
                                    step="0.1"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="clienteId"
                                label={
                                    <Space>
                                        <UserOutlined />
                                        <span>Cliente Proprietário</span>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Por favor, selecione um cliente!' }]}
                            >
                                <Select
                                    placeholder="Selecione o cliente proprietário do equipamento"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {clientes.map(cliente => (
                                        <Option key={cliente.id} value={cliente.id}>
                                            {cliente.nomeCompleto}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </StyledForm>
            </StyledCard>
        </PageContainer>
    );
}

export default EquipamentoEditPage; 
