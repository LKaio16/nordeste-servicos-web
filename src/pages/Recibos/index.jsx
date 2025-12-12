import { useState, useEffect, useCallback } from 'react';
import reciboService from '../../services/reciboService';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Card,
    Typography,
    Tooltip,
    Spin,
    Modal,
    Form,
    Input,
    InputNumber
} from 'antd';
import {
    FileTextOutlined,
    ReloadOutlined,
    PlusOutlined,
    DeleteOutlined,
    DownloadOutlined,
    DollarOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

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

const StyledTable = styled(Table)`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  }
  
  .ant-table-thead > tr > th {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 2px solid #00529b;
    font-weight: 600;
    color: #00529b;
    padding: 16px 12px;
  }
  
  .ant-table-tbody > tr {
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 82, 155, 0.1);
    }
    
    > td {
      padding: 16px 12px;
      border-bottom: 1px solid #f0f0f0;
    }
  }
  
  .ant-table-pagination {
    margin-top: 24px;
    text-align: center;
  }
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ValueInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #52c41a;
`;

const ClienteInfo = styled.div`
  font-weight: 500;
  color: #00529b;
`;

function RecibosPage() {
    const [recibos, setRecibos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [form] = Form.useForm();

    const fetchRecibos = useCallback(async () => {
        try {
            const data = await reciboService.getAllRecibos();
            setRecibos(data);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchRecibos();
            setIsLoading(false);
        };
        loadData();
    }, [fetchRecibos]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchRecibos();
        setIsRefreshing(false);
    };

    const handleDelete = async (recibo) => {
        try {
            await reciboService.deleteRecibo(recibo.id);
            setRecibos(prev => prev.filter(r => r.id !== recibo.id));
            message.success('Recibo excluído com sucesso!');
        } catch (deleteError) {
            message.error('Erro ao excluir recibo: ' + deleteError.message);
        }
    };

    const handleDownload = async (recibo) => {
        try {
            await reciboService.downloadReciboPdf(recibo.id);
            message.success('Download iniciado!');
        } catch (downloadError) {
            message.error('Erro ao baixar PDF: ' + downloadError.message);
        }
    };

    const handleCreateRecibo = async (values) => {
        try {
            setIsCreating(true);
            
            const reciboData = {
                valor: values.valor,
                cliente: values.cliente,
                referenteA: values.referenteA
            };

            // Salvar o recibo
            const savedRecibo = await reciboService.createRecibo(reciboData);
            
            // Gerar e baixar o PDF
            await reciboService.generateReciboPdf(reciboData);
            
            message.success('Recibo criado e PDF gerado com sucesso!');
            form.resetFields();
            setIsModalOpen(false);
            await fetchRecibos();
        } catch (error) {
            message.error('Erro ao criar recibo: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setIsCreating(false);
        }
    };

    const formatCurrency = (val) => {
        if (val == null || val === undefined) return '0,00';
        const formatted = Math.abs(val).toFixed(2);
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dayjs(dateString).format('DD/MM/YYYY HH:mm');
    };

    const columns = [
        {
            title: 'Número',
            dataIndex: 'numeroRecibo',
            key: 'numeroRecibo',
            width: 140,
            render: (text) => (
                <Typography.Text strong style={{ color: '#00529b' }}>
                    {text}
                </Typography.Text>
            ),
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
            width: 250,
            render: (text) => (
                <ClienteInfo>{text || 'N/A'}</ClienteInfo>
            ),
        },
        {
            title: 'Valor',
            dataIndex: 'valor',
            key: 'valor',
            width: 140,
            render: (value) => (
                <ValueInfo>
                    <DollarOutlined />
                    <span>R$ {formatCurrency(value)}</span>
                </ValueInfo>
            ),
            sorter: (a, b) => a.valor - b.valor,
        },
        {
            title: 'Data de Criação',
            dataIndex: 'dataCriacao',
            key: 'dataCriacao',
            width: 180,
            render: (date) => formatDate(date),
            sorter: (a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Baixar PDF">
                        <ActionButton
                            type="default"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Excluir Recibo"
                        description={`Deseja realmente excluir o recibo ${record.numeroRecibo}?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Sim"
                        cancelText="Não"
                        okType="danger"
                    >
                        <Tooltip title="Excluir">
                            <ActionButton
                                type="default"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (error) {
        return (
            <PageContainer>
                <StyledCard>
                    <Typography.Text type="danger">{error}</Typography.Text>
                </StyledCard>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <HeaderContainer>
                <TitleStyled level={2}>
                    <Space>
                        <FileTextOutlined />
                        <span>Recibos</span>
                    </Space>
                </TitleStyled>
                <ActionButtons>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        loading={isRefreshing}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Novo Recibo
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            <StyledCard>
                <StyledTable
                    columns={columns}
                    dataSource={recibos}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} de ${total} recibos`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    locale={{
                        emptyText: 'Nenhum recibo encontrado',
                    }}
                />
            </StyledCard>

            <Modal
                title="Novo Recibo"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateRecibo}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Valor (R$)"
                        name="valor"
                        rules={[
                            { required: true, message: 'Por favor, informe o valor!' },
                            {
                                validator: (_, value) => {
                                    if (!value || value <= 0) {
                                        return Promise.reject(new Error('O valor deve ser maior que zero!'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            prefix="R$"
                            placeholder="0,00"
                            min={0}
                            step={0.01}
                            precision={2}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Cliente"
                        name="cliente"
                        rules={[
                            { required: true, message: 'Por favor, informe o nome do cliente!' },
                            { min: 3, message: 'O nome do cliente deve ter pelo menos 3 caracteres!' }
                        ]}
                    >
                        <Input
                            placeholder="Nome do cliente"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Referente a"
                        name="referenteA"
                        rules={[
                            { required: true, message: 'Por favor, informe a descrição!' },
                            { min: 5, message: 'A descrição deve ter pelo menos 5 caracteres!' }
                        ]}
                    >
                        <TextArea
                            placeholder="Descrição do serviço ou produto"
                            rows={4}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<DownloadOutlined />}
                                loading={isCreating}
                            >
                                {isCreating ? 'Criando...' : 'Criar e Gerar PDF'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    form.resetFields();
                                }}
                                disabled={isCreating}
                            >
                                Cancelar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </PageContainer>
    );
}

export default RecibosPage;
