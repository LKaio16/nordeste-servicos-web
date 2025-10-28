import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orcamentoService from '../../services/orcamentoService';
import { getAllClientes } from '../../services/clienteService';
import * as osService from '../../services/osService';
import { pecaMaterialService } from '../../services/pecaMaterialService';
import tipoServicoService from '../../services/tipoServicoService';
import itemOrcamentoService from '../../services/itemOrcamentoService';
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
    Divider,
    Table,
    Modal,
    InputNumber,
    Popconfirm,
    Tooltip,
    Tag
} from 'antd';
import {
    SaveOutlined,
    ArrowLeftOutlined,
    UserOutlined,
    FileTextOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ShoppingCartOutlined,
    ToolOutlined,
    DollarOutlined,
    PercentageOutlined
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
  
  @media (max-width: 768px) {
    padding: 0 16px 16px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 0 8px 8px 8px;
  }
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 16px;
  }
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
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    
    .ant-btn {
      height: 44px;
      padding: 0 20px;
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .ant-btn {
      height: 40px;
      padding: 0 16px;
      font-size: 13px;
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

const ItemsContainer = styled.div`
  margin-top: 24px;
`;

const ItemsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #00529b 0%, #003d73 100%);
  border-radius: 8px;
  color: white;
  
  .total-label {
    font-size: 18px;
    font-weight: 600;
    margin-right: 16px;
  }
  
  .total-value {
    font-size: 24px;
    font-weight: 700;
  }
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #f8f9fa;
    color: #00529b;
    font-weight: 600;
    border-bottom: 2px solid #e8e8e8;
    padding: 12px 8px;
    font-size: 14px;
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
    padding: 12px 8px;
    font-size: 14px;
  }
  
  .ant-table-tbody > tr:hover > td {
    background: #f8f9fa;
  }
  
  @media (max-width: 768px) {
    .ant-table-thead > tr > th {
      padding: 8px 4px;
      font-size: 12px;
    }
    
    .ant-table-tbody > tr > td {
      padding: 8px 4px;
      font-size: 12px;
    }
    
    .ant-table {
      font-size: 12px;
    }
    
    .ant-btn {
      padding: 4px 8px;
      height: 28px;
      font-size: 12px;
    }
  }
  
  @media (max-width: 480px) {
    .ant-table-thead > tr > th:nth-child(n+4),
    .ant-table-tbody > tr > td:nth-child(n+4) {
      display: none;
    }
    
    .ant-table-thead > tr > th:first-child,
    .ant-table-tbody > tr > td:first-child {
      width: 80px;
    }
    
    .ant-table-thead > tr > th:nth-child(2),
    .ant-table-tbody > tr > td:nth-child(2) {
      width: auto;
    }
    
    .ant-table-thead > tr > th:nth-child(3),
    .ant-table-tbody > tr > td:nth-child(3) {
      width: 60px;
    }
  }
`;

const ItemModal = styled(Modal)`
  .ant-modal-header {
    background: linear-gradient(135deg, #00529b 0%, #003d73 100%);
    border-bottom: none;
    padding: 20px 24px;
    
    .ant-modal-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }
  }
  
  .ant-modal-close {
    color: white;
    top: 20px;
    right: 24px;
    
    &:hover {
      color: #f0f0f0;
    }
  }
  
  .ant-modal-body {
    padding: 24px;
  }
  
  @media (max-width: 768px) {
    .ant-modal {
      margin: 0;
      max-width: 100vw;
      top: 0;
      padding-bottom: 0;
    }
    
    .ant-modal-content {
      border-radius: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .ant-modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    
    .ant-modal-header {
      padding: 16px;
      flex-shrink: 0;
    }
    
    .ant-modal-close {
      top: 16px;
      right: 16px;
    }
  }
`;

function OrcamentoCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [itemForm] = Form.useForm();
    const [clientes, setClientes] = useState([]);
    const [ordensServico, setOrdensServico] = useState([]);
    const [ordensServicoFiltradas, setOrdensServicoFiltradas] = useState([]);
    const [pecasMateriais, setPecasMateriais] = useState([]);
    const [tiposServico, setTiposServico] = useState([]);
    const [itens, setItens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isItemModalVisible, setIsItemModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [orcamentoId, setOrcamentoId] = useState(null);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [clientesData, osData, pecasData, tiposData] = await Promise.all([
                    getAllClientes(),
                    osService.getAllOrdensServico(),
                    pecaMaterialService.getAllPecasMateriais(),
                    tipoServicoService.getAllTiposServico()
                ]);
                setClientes(clientesData);
                setOrdensServico(osData);
                setPecasMateriais(pecasData);
                setTiposServico(tiposData);
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
            // Formatar data corretamente sem timezone issues
            let dataValidade = null;
            if (values.dataValidade) {
                // Pegar diretamente o ano, mês e dia sem conversão de timezone
                const day = String(values.dataValidade.date()).padStart(2, '0');
                const month = String(values.dataValidade.month() + 1).padStart(2, '0');
                const year = values.dataValidade.year();
                dataValidade = `${year}-${month}-${day}`;
            }

            // Converter a data para o formato esperado
            const formData = {
                ...values,
                dataValidade: dataValidade,
                status: values.status || 'PENDENTE'
            };

            const novoOrcamento = await orcamentoService.createOrcamento(formData);
            setOrcamentoId(novoOrcamento.id);
            message.success('Orçamento criado com sucesso! Agora você pode adicionar itens.');
        } catch (submitError) {
            console.error("Erro ao criar orçamento:", submitError);
            message.error('Falha ao criar o orçamento. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFinalizar = async () => {
        if (itens.length === 0) {
            message.warning('Adicione pelo menos um item ao orçamento antes de finalizar.');
            return;
        }

        try {
            message.success('Orçamento finalizado com sucesso!');
            navigate(`/admin/orcamentos/detalhes/${orcamentoId}`);
        } catch (error) {
            console.error("Erro ao finalizar orçamento:", error);
            message.error('Falha ao finalizar o orçamento.');
        }
    };

    const handleCancel = () => {
        navigate('/admin/orcamentos');
    };

    // Funções para gerenciar itens
    const handleAddItem = () => {
        if (!orcamentoId) {
            message.warning('Crie o orçamento primeiro antes de adicionar itens.');
            return;
        }
        setEditingItem(null);
        itemForm.resetFields();
        itemForm.setFieldsValue({ tipo: 'descricao' });
        setIsItemModalVisible(true);
    };

    const handleAddDiscount = () => {
        if (!orcamentoId) {
            message.warning('Crie o orçamento primeiro antes de adicionar descontos.');
            return;
        }
        setEditingItem(null);
        itemForm.resetFields();
        itemForm.setFieldsValue({
            tipo: 'descricao',
            descricao: 'Desconto',
            quantidade: 1,
            valorUnitario: 0
        });
        setIsItemModalVisible(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        itemForm.setFieldsValue({
            tipo: item.pecaMaterial ? 'peca' : item.tipoServico ? 'servico' : 'descricao',
            pecaMaterialId: item.pecaMaterial?.id,
            tipoServicoId: item.tipoServico?.id,
            descricao: item.descricao,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario
        });
        setIsItemModalVisible(true);
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await itemOrcamentoService.deleteItemOrcamento(orcamentoId, itemId);
            setItens(itens.filter(item => item.id !== itemId));
            message.success('Item removido com sucesso!');
        } catch (error) {
            console.error("Erro ao excluir item:", error);
            message.error('Falha ao excluir o item.');
        }
    };

    const handleItemSubmit = async (values) => {
        try {
            const itemData = {
                orcamentoId: orcamentoId,
                pecaMaterialId: values.tipo === 'peca' ? values.pecaMaterialId : null,
                tipoServicoId: values.tipo === 'servico' ? values.tipoServicoId : null,
                descricao: values.descricao || '',
                quantidade: values.quantidade,
                valorUnitario: values.valorUnitario
            };

            if (editingItem) {
                const updatedItem = await itemOrcamentoService.updateItemOrcamento(orcamentoId, editingItem.id, itemData);
                setItens(itens.map(item => item.id === editingItem.id ? updatedItem : item));
                message.success('Item atualizado com sucesso!');
            } else {
                const newItem = await itemOrcamentoService.createItemOrcamento(orcamentoId, itemData);
                setItens([...itens, newItem]);
                message.success('Item adicionado com sucesso!');
            }

            setIsItemModalVisible(false);
            itemForm.resetFields();
            setEditingItem(null);
        } catch (error) {
            console.error("Erro ao salvar item:", error);
            message.error('Falha ao salvar o item.');
        }
    };

    const calcularTotal = () => {
        return itens.reduce((total, item) => total + (item.quantidade * item.valorUnitario), 0);
    };

    // Colunas da tabela de itens
    const itemColumns = [
        {
            title: 'Tipo',
            key: 'tipo',
            width: 100,
            render: (_, record) => {
                const isDiscount = record.valorUnitario < 0;
                if (isDiscount) {
                    return <Tag color="red" icon={<PercentageOutlined />}>Desconto</Tag>;
                } else if (record.pecaMaterial) {
                    return <Tag color="blue" icon={<ShoppingCartOutlined />}>Peça</Tag>;
                } else if (record.tipoServico) {
                    return <Tag color="green" icon={<ToolOutlined />}>Serviço</Tag>;
                } else {
                    return <Tag color="orange" icon={<FileTextOutlined />}>Descrição</Tag>;
                }
            }
        },
        {
            title: 'Descrição',
            key: 'descricao',
            render: (_, record) => {
                if (record.pecaMaterial) {
                    return (
                        <div>
                            <div style={{ fontWeight: 600, color: '#00529b' }}>
                                {record.pecaMaterial.nome}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                Código: {record.pecaMaterial.codigo}
                            </div>
                        </div>
                    );
                } else if (record.tipoServico) {
                    return (
                        <div>
                            <div style={{ fontWeight: 600, color: '#00529b' }}>
                                {record.tipoServico.descricao}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div style={{ fontWeight: 600, color: '#00529b' }}>
                            {record.descricao}
                        </div>
                    );
                }
            }
        },
        {
            title: 'Quantidade',
            dataIndex: 'quantidade',
            key: 'quantidade',
            width: 100,
            align: 'center'
        },
        {
            title: 'Valor Unitário',
            dataIndex: 'valorUnitario',
            key: 'valorUnitario',
            width: 120,
            align: 'right',
            render: (value) => {
                const isNegative = value < 0;
                const formattedValue = Math.abs(value).toFixed(2).replace('.', ',');
                return (
                    <span style={{ color: isNegative ? '#ff4d4f' : 'inherit' }}>
                        {isNegative ? '-R$ ' : 'R$ '}{formattedValue}
                    </span>
                );
            }
        },
        {
            title: 'Subtotal',
            key: 'subtotal',
            width: 120,
            align: 'right',
            render: (_, record) => {
                const subtotal = record.quantidade * record.valorUnitario;
                const isNegative = subtotal < 0;
                const formattedValue = Math.abs(subtotal).toFixed(2).replace('.', ',');
                return (
                    <span style={{ color: isNegative ? '#ff4d4f' : 'inherit', fontWeight: isNegative ? 600 : 'normal' }}>
                        {isNegative ? '-R$ ' : 'R$ '}{formattedValue}
                    </span>
                );
            }
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Editar">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditItem(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Excluir Item"
                        description="Deseja realmente excluir este item?"
                        onConfirm={() => handleDeleteItem(record.id)}
                        okText="Sim"
                        cancelText="Não"
                        okType="danger"
                    >
                        <Tooltip title="Excluir">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

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
                                    optionFilterProp="label"
                                    filterOption={(input, option) =>
                                        (option.label || '').toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                                    optionFilterProp="label"
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

            {orcamentoId && (
                <ItemsContainer>
                    <StyledCard title="Itens do Orçamento">
                        <ItemsHeader>
                            <div>
                                <Title level={4} style={{ margin: 0, color: '#00529b' }}>
                                    <Space>
                                        <ShoppingCartOutlined />
                                        <span>Itens do Orçamento</span>
                                    </Space>
                                </Title>
                                <Text type="secondary">
                                    {itens.length} item(s) adicionado(s)
                                </Text>
                            </div>
                            <Space>
                                <Button
                                    type="default"
                                    icon={<PercentageOutlined />}
                                    onClick={handleAddDiscount}
                                    size="large"
                                    style={{
                                        borderColor: '#ff4d4f',
                                        color: '#ff4d4f'
                                    }}
                                >
                                    Desconto
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddItem}
                                    size="large"
                                >
                                    Adicionar Item
                                </Button>
                            </Space>
                        </ItemsHeader>

                        {itens.length > 0 ? (
                            <>
                                <StyledTable
                                    columns={itemColumns}
                                    dataSource={itens}
                                    rowKey="id"
                                    pagination={false}
                                    size="middle"
                                />

                                <TotalContainer>
                                    <span className="total-label">Total do Orçamento:</span>
                                    <span className="total-value">
                                        R$ {calcularTotal().toFixed(2).replace('.', ',')}
                                    </span>
                                </TotalContainer>

                                <Row justify="end" style={{ marginTop: 24 }}>
                                    <Space>
                                        <Button
                                            onClick={() => navigate('/admin/orcamentos')}
                                            size="large"
                                        >
                                            Voltar para Lista
                                        </Button>
                                        <Button
                                            type="primary"
                                            icon={<CheckCircleOutlined />}
                                            onClick={handleFinalizar}
                                            size="large"
                                        >
                                            Finalizar Orçamento
                                        </Button>
                                    </Space>
                                </Row>
                            </>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px 20px',
                                color: '#666'
                            }}>
                                <ShoppingCartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                                    Nenhum item adicionado
                                </div>
                                <div style={{ fontSize: '14px', color: '#999' }}>
                                    Clique em "Adicionar Item" para começar
                                </div>
                            </div>
                        )}
                    </StyledCard>
                </ItemsContainer>
            )}

            {/* Modal para adicionar/editar item */}
            <ItemModal
                title={editingItem ? 'Editar Item' : 'Adicionar Item'}
                open={isItemModalVisible}
                onCancel={() => {
                    setIsItemModalVisible(false);
                    itemForm.resetFields();
                    setEditingItem(null);
                }}
                footer={null}
                width={window.innerWidth <= 768 ? '100%' : 600}
                centered={window.innerWidth > 768}
                style={window.innerWidth <= 768 ? { margin: 0, top: 0 } : {}}
            >
                <Form
                    form={itemForm}
                    layout="vertical"
                    onFinish={handleItemSubmit}
                    initialValues={{
                        tipo: 'descricao'
                    }}
                >
                    <Form.Item
                        name="tipo"
                        label="Tipo de Item"
                        rules={[{ required: true, message: 'Selecione o tipo de item!' }]}
                    >
                        <Select>
                            <Option value="peca">Peça/Material</Option>
                            <Option value="servico">Tipo de Serviço</Option>
                            <Option value="descricao">Descrição Livre</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.tipo !== currentValues.tipo
                        }
                    >
                        {({ getFieldValue }) => {
                            const tipo = getFieldValue('tipo');

                            if (tipo === 'peca') {
                                return (
                                    <Form.Item
                                        name="pecaMaterialId"
                                        label="Peça/Material"
                                        rules={[{ required: true, message: 'Selecione uma peça/material!' }]}
                                    >
                                        <Select
                                            placeholder="Selecione uma peça/material"
                                            showSearch
                                            optionFilterProp="label"
                                            filterOption={(input, option) =>
                                                (option.children || '').toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {pecasMateriais.map(peca => (
                                                <Option key={peca.id} value={peca.id}>
                                                    {peca.nome} - {peca.codigo}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                );
                            }

                            if (tipo === 'servico') {
                                return (
                                    <Form.Item
                                        name="tipoServicoId"
                                        label="Tipo de Serviço"
                                        rules={[{ required: true, message: 'Selecione um tipo de serviço!' }]}
                                    >
                                        <Select
                                            placeholder="Selecione um tipo de serviço"
                                            showSearch
                                            optionFilterProp="label"
                                            filterOption={(input, option) =>
                                                (option.children || '').toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {tiposServico.map(tipo => (
                                                <Option key={tipo.id} value={tipo.id}>
                                                    {tipo.descricao}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                );
                            }

                            return (
                                <Form.Item
                                    name="descricao"
                                    label="Descrição"
                                    rules={[{ required: true, message: 'Digite a descrição!' }]}
                                >
                                    <Input
                                        placeholder="Digite a descrição do item..."
                                        maxLength={200}
                                        showCount
                                    />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="quantidade"
                                label="Quantidade"
                                rules={[
                                    { required: true, message: 'Digite a quantidade!' },
                                    { type: 'number', min: 1, message: 'Quantidade deve ser maior que zero!' },
                                    { pattern: /^\d+$/, message: 'Quantidade deve ser um número inteiro!' }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="0"
                                    min={1}
                                    step={1}
                                    precision={0}
                                    parser={(value) => value.replace(/\D/g, '')}
                                    formatter={(value) => value.replace(/\D/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="valorUnitario"
                                label="Valor Unitário (R$)"
                                rules={[
                                    { required: true, message: 'Digite o valor unitário!' }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="0,00"
                                    step={0.01}
                                    precision={2}
                                    formatter={value => {
                                        if (!value) return '';
                                        const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
                                        const absValue = Math.abs(numValue);
                                        const formatted = absValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                        return numValue < 0 ? `-R$ ${formatted}` : `R$ ${formatted}`;
                                    }}
                                    parser={value => {
                                        if (!value) return '';
                                        const parsed = value.replace(/R\$\s?|(,*)/g, '');
                                        return parsed.startsWith('-') ? `-${parsed.substring(1)}` : parsed;
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="end">
                        <Space>
                            <Button
                                onClick={() => {
                                    setIsItemModalVisible(false);
                                    itemForm.resetFields();
                                    setEditingItem(null);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                            >
                                {editingItem ? 'Atualizar' : 'Adicionar'}
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </ItemModal>
        </PageContainer>
    );
}

export default OrcamentoCreatePage; 
