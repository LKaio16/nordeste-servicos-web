import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    UserOutlined,
    ToolOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import * as osService from '../../services/osService';
import * as clienteService from '../../services/clienteService';
import * as equipamentoService from '../../services/equipamentoService';
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
    Form,
    Input,
    Select
} from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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
    
    textarea.ant-input {
        font-size: 16px;
        padding: 12px 16px;
        min-height: 120px;
        height: auto;
        border: 2px solid #d9d9d9;
        line-height: 1.5;
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

function OrdemServicoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [clientes, setClientes] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [equipamentosFiltrados, setEquipamentosFiltrados] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [os, clientesData, equipamentosData, tecnicosData] = await Promise.all([
                    osService.getOrdemServicoById(id),
                    clienteService.getAllClientes(),
                    equipamentoService.getAllEquipamentos(),
                    usuarioService.getAllUsuarios().then(users => users.filter(u => u.perfil === 'TECNICO'))
                ]);

                // Definir valores iniciais do formulário
                form.setFieldsValue({
                    problemaRelatado: os.problemaRelatado || '',
                    analiseFalha: os.analiseFalha || '',
                    solucaoAplicada: os.solucaoAplicada || '',
                    status: os.status || '',
                    prioridade: os.prioridade || '',
                    clienteId: os.cliente?.id || null,
                    equipamentoId: os.equipamento?.id || null,
                    tecnicoId: os.tecnicoAtribuido?.id || null
                });

                setClientes(clientesData);
                setEquipamentos(equipamentosData);
                setTecnicos(tecnicosData);

                // Filtrar equipamentos do cliente selecionado
                if (os.cliente?.id) {
                    const equipamentosDoCliente = equipamentosData.filter(e => e.clienteId === os.cliente.id);
                    setEquipamentosFiltrados(equipamentosDoCliente);
                }

            } catch (err) {
                console.error('Falha ao carregar dados:', err);
                message.error('Falha ao carregar dados da página.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, form]);

    const handleClienteChange = (clienteId) => {
        if (clienteId) {
            const equipamentosDoCliente = equipamentos.filter(e => e.clienteId === clienteId);
            setEquipamentosFiltrados(equipamentosDoCliente);
        } else {
            setEquipamentosFiltrados([]);
        }
        form.setFieldsValue({ equipamentoId: null }); // Limpar seleção de equipamento
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);

        try {
            const payload = {
                ...values,
                cliente: { id: values.clienteId },
                equipamento: { id: values.equipamentoId },
                tecnicoAtribuido: values.tecnicoId ? { id: values.tecnicoId } : null,
            };

            await osService.updateOrdemServico(id, payload);
            message.success('Ordem de Serviço atualizada com sucesso!');
            navigate(`/admin/os/detalhes/${id}`);
        } catch (err) {
            console.error('Falha ao atualizar OS:', err);
            message.error('Falha ao atualizar a Ordem de Serviço.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <div className="loading-text">Carregando dados da OS...</div>
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
                            <span>Editar Ordem de Serviço #{id}</span>
                        </Space>
                    </TitleStyled>
                    <ActionButtons>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(`/admin/os/detalhes/${id}`)}
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
                                name="clienteId"
                                label={
                                    <Space>
                                        <UserOutlined />
                                        <span>Cliente</span>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Por favor, selecione um cliente!' }]}
                            >
                                <Select
                                    placeholder="Selecione um cliente"
                                    showSearch
                                    optionFilterProp="children"
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
                                name="equipamentoId"
                                label={
                                    <Space>
                                        <ToolOutlined />
                                        <span>Equipamento</span>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Por favor, selecione um equipamento!' }]}
                            >
                                <Select
                                    placeholder="Selecione um equipamento"
                                    showSearch
                                    optionFilterProp="children"
                                    disabled={!form.getFieldValue('clienteId')}
                                >
                                    {equipamentosFiltrados.map(equip => (
                                        <Option key={equip.id} value={equip.id}>
                                            {equip.marcaModelo} (S/N: {equip.numeroSerieChassi})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="tecnicoId"
                                label={
                                    <Space>
                                        <UserOutlined />
                                        <span>Técnico Responsável</span>
                                    </Space>
                                }
                            >
                                <Select
                                    placeholder="Selecione um técnico (opcional)"
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {tecnicos.map(tecnico => (
                                        <Option key={tecnico.id} value={tecnico.id}>
                                            {tecnico.nome}
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
                                rules={[{ required: true, message: 'Por favor, selecione o status!' }]}
                            >
                                <Select placeholder="Selecione o status">
                                    <Option value="EM_ABERTO">Em Aberto</Option>
                                    <Option value="EM_ANDAMENTO">Em Andamento</Option>
                                    <Option value="PAUSADA">Pausada</Option>
                                    <Option value="CONCLUIDA">Concluída</Option>
                                    <Option value="CANCELADA">Cancelada</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="prioridade"
                                label={
                                    <Space>
                                        <ExclamationCircleOutlined />
                                        <span>Prioridade</span>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Por favor, selecione a prioridade!' }]}
                            >
                                <Select placeholder="Selecione a prioridade">
                                    <Option value="BAIXA">Baixa</Option>
                                    <Option value="MEDIA">Média</Option>
                                    <Option value="ALTA">Alta</Option>
                                    <Option value="URGENTE">Urgente</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="problemaRelatado"
                                label={
                                    <Space>
                                        <ExclamationCircleOutlined />
                                        <span>Problema Relatado</span>
                                    </Space>
                                }
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Descreva o problema relatado pelo cliente..."
                                    showCount
                                    maxLength={1000}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="analiseFalha"
                                label={
                                    <Space>
                                        <ToolOutlined />
                                        <span>Análise da Falha</span>
                                    </Space>
                                }
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Descreva a análise técnica da falha..."
                                    showCount
                                    maxLength={1000}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="solucaoAplicada"
                                label={
                                    <Space>
                                        <CheckCircleOutlined />
                                        <span>Solução Aplicada</span>
                                    </Space>
                                }
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Descreva a solução aplicada..."
                                    showCount
                                    maxLength={1000}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </StyledForm>
            </StyledCard>
        </PageContainer>
    );
}

export default OrdemServicoEditPage; 
