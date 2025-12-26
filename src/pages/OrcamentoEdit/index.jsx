import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined, UserOutlined, FileTextOutlined, CalendarOutlined, EditOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined, ToolOutlined, DollarOutlined, CheckCircleOutlined, PercentageOutlined } from '@ant-design/icons';
import orcamentoService from '../../services/orcamentoService';
import * as osService from '../../services/osService';
import { pecaMaterialService } from '../../services/pecaMaterialService';
import tipoServicoService from '../../services/tipoServicoService';
import itemOrcamentoService from '../../services/itemOrcamentoService';
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Spin,
    Row,
    Col,
    Divider,
    Form,
    Input,
    Select,
    DatePicker,
    Table,
    Modal,
    InputNumber,
    Popconfirm,
    Tooltip,
    Tag
} from 'antd';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Styled Components
const PageContainer = styled.div`
    padding: 0 24px 24px 24px;
    background-color: #f5f5f5;
    min-height: 100vh;
    
    @media (max-width: 768px) {
        padding: 0 16px 16px 16px;
    }
    
    @media (max-width: 480px) {
        padding: 0 8px 8px 8px;
    }
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
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }
    
    @media (max-width: 480px) {
        margin-bottom: 16px;
        padding-bottom: 12px;
    }
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
    .ant-select-selector, 
    .ant-picker {
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
        &.ant-select-focused .ant-select-selector,
        &.ant-picker-focused {
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

function OrcamentoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [itemForm] = Form.useForm();
    const [ordensServico, setOrdensServico] = useState([]);
    const [pecasMateriais, setPecasMateriais] = useState([]);
    const [tiposServico, setTiposServico] = useState([]);
    const [itens, setItens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isItemModalVisible, setIsItemModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [clienteId, setClienteId] = useState(null);

    useEffect(() => {
        const fetchOrcamentoData = async () => {
            try {
                const [orcamentoData, osData, pecasData, tiposData, itensData] = await Promise.all([
                    orcamentoService.getOrcamentoById(id),
                    osService.getAllOrdensServico('', 0, 1000), // Busca até 1000 OS para o select
                    pecaMaterialService.getAllPecasMateriais(),
                    tipoServicoService.getAllTiposServico(),
                    itemOrcamentoService.getItensByOrcamento(id)
                ]);

                // Salvar clienteId do orçamento
                setClienteId(orcamentoData.clienteId);

                // Formatar data para dayjs sem timezone
                // Se a data vier como string YYYY-MM-DD, usamos 'YYYY-MM-DD' parser
                const formattedDate = orcamentoData.dataValidade
                    ? dayjs(orcamentoData.dataValidade, 'YYYY-MM-DD')
                    : null;

                // Definir valores iniciais do formulário
                form.setFieldsValue({
                    status: orcamentoData.status || 'PENDENTE',
                    ordemServicoOrigemId: orcamentoData.ordemServicoOrigemId || null,
                    dataValidade: formattedDate,
                    observacoesCondicoes: orcamentoData.observacoesCondicoes || '',
                });

                setOrdensServico(osData);
                setPecasMateriais(pecasData);
                setTiposServico(tiposData);
                setItens(itensData);
            } catch (err) {
                message.error('Falha ao carregar dados do orçamento.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrcamentoData();
    }, [id, form]);

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

            const payload = {
                clienteId: clienteId,
                status: values.status,
                ordemServicoOrigemId: values.ordemServicoOrigemId || null,
                dataValidade: dataValidade,
                observacoesCondicoes: values.observacoesCondicoes || '',
            };

            await orcamentoService.updateOrcamento(id, payload);
            message.success('Orçamento atualizado com sucesso!');

            // Redirecionar para a tela de detalhes após 1 segundo
            setTimeout(() => {
            navigate(`/admin/orcamentos/detalhes/${id}`);
            }, 1000);
        } catch (err) {
            message.error('Falha ao atualizar o orçamento.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Funções para gerenciar itens
    const handleAddItem = () => {
        setEditingItem(null);
        itemForm.resetFields();
        itemForm.setFieldsValue({ tipo: 'descricao' });
        setIsItemModalVisible(true);
    };

    const handleAddDiscount = () => {
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
            await itemOrcamentoService.deleteItemOrcamento(id, itemId);
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
                orcamentoId: id,
                pecaMaterialId: values.tipo === 'peca' ? values.pecaMaterialId : null,
                tipoServicoId: values.tipo === 'servico' ? values.tipoServicoId : null,
                descricao: values.descricao || '',
                quantidade: values.quantidade,
                valorUnitario: values.valorUnitario
            };

            if (editingItem) {
                const updatedItem = await itemOrcamentoService.updateItemOrcamento(id, editingItem.id, itemData);
                setItens(itens.map(item => item.id === editingItem.id ? updatedItem : item));
                message.success('Item atualizado com sucesso!');
            } else {
                const newItem = await itemOrcamentoService.createItemOrcamento(id, itemData);
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
                const formatCurrency = (val) => {
                    if (val == null || val === undefined) return '0,00';
                    const formatted = Math.abs(val).toFixed(2);
                    const parts = formatted.split('.');
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    return parts.join(',');
                };
                const formattedValue = formatCurrency(value);
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
                const formatCurrency = (val) => {
                    if (val == null || val === undefined) return '0,00';
                    const formatted = Math.abs(val).toFixed(2);
                    const parts = formatted.split('.');
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    return parts.join(',');
                };
                const formattedValue = formatCurrency(subtotal);
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

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <div className="loading-text">Carregando dados do orçamento...</div>
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
                            <span>Editar Orçamento</span>
                        </Space>
                    </TitleStyled>
                    <ActionButtons>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(`/admin/orcamentos/detalhes/${id}`)}
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
                                name="status"
                                label={
                                    <Space>
                                        <EditOutlined />
                                        <span>Status do Orçamento</span>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Por favor, selecione o status!' }]}
                            >
                                <Select placeholder="Selecione o status">
                                    <Option value="PENDENTE">Pendente</Option>
                                    <Option value="APROVADO">Aprovado</Option>
                                    <Option value="REJEITADO">Rejeitado</Option>
                                    <Option value="CANCELADO">Cancelado</Option>
                            </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="ordemServicoOrigemId"
                                label={
                                    <Space>
                                        <FileTextOutlined />
                                        <span>Ordem de Serviço Associada (Opcional)</span>
                                    </Space>
                                }
                            >
                                <Select
                                    placeholder="Selecione uma OS (opcional)"
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                >
                                {ordensServico.map(os => (
                                        <Option key={os.id} value={os.id}>
                                        OS nº {os.id} - ({os.cliente?.nomeCompleto || 'Cliente não informado'})
                                        </Option>
                                ))}
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
                                    placeholder="Selecione a data de validade"
                                    format="DD/MM/YYYY"
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="observacoesCondicoes"
                                label={
                                    <Space>
                                        <EditOutlined />
                                        <span>Observações e Condições</span>
                                    </Space>
                                }
                            >
                                <TextArea
                                    rows={5}
                                    placeholder="Digite as observações e condições do orçamento..."
                                    showCount
                                    maxLength={1000}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </StyledForm>
            </StyledCard>

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
                                    R$ {(() => {
                                        const formatCurrency = (val) => {
                                            if (val == null || val === undefined) return '0,00';
                                            const formatted = Math.abs(val).toFixed(2);
                                            const parts = formatted.split('.');
                                            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                            return parts.join(',');
                                        };
                                        return formatCurrency(calcularTotal());
                                    })()}
                                </span>
                            </TotalContainer>
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
                                                (option.label || '').toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                                                (option.label || '').toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                                label={
                                    <Space>
                                        <DollarOutlined />
                                        <span>Valor Unitário</span>
                                    </Space>
                                }
                                tooltip="Digite o valor unitário do item. Use vírgula para centavos (ex: 150,50). Para descontos, use valor negativo."
                                rules={[
                                    { required: true, message: 'Digite o valor unitário!' },
                                    { type: 'number', message: 'Valor inválido!' }
                                ]}
                                extra={<Text type="secondary" style={{ fontSize: '12px' }}>Exemplo: 150,50 ou -10,00 (desconto)</Text>}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="0,00"
                                    min={-999999.99}
                                    max={999999.99}
                                    step={0.01}
                                    precision={2}
                                    formatter={(value) => {
                                        if (!value && value !== 0) return '';
                                        const numValue = Number(value);
                                        if (isNaN(numValue)) return '';
                                        const absValue = Math.abs(numValue);
                                        const parts = absValue.toFixed(2).split('.');
                                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                        const formatted = parts.join(',');
                                        return numValue < 0 ? `-${formatted}` : formatted;
                                    }}
                                    parser={(value) => {
                                        if (!value || value.trim() === '') return '';
                                        // Remove tudo exceto números, vírgula, ponto e sinal negativo
                                        let cleaned = value.replace(/[^\d,.-]/g, '');
                                        // Verifica se é negativo
                                        const isNegative = cleaned.startsWith('-');
                                        if (isNegative) cleaned = cleaned.substring(1);
                                        // Remove pontos (separadores de milhares)
                                        cleaned = cleaned.replace(/\./g, '');
                                        // Converte vírgula para ponto (padrão JavaScript)
                                        cleaned = cleaned.replace(',', '.');
                                        // Se está vazio, retorna vazio
                                        if (cleaned === '' || cleaned === '.') return '';
                                        const numValue = parseFloat(cleaned);
                                        if (isNaN(numValue)) return '';
                                        return isNegative ? -numValue : numValue;
                                    }}
                                    addonBefore={<span style={{ color: '#00529b', fontWeight: 600, fontSize: '16px' }}>R$</span>}
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

export default OrcamentoEditPage; 
