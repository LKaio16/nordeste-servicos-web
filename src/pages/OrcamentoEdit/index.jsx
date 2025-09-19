import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined, UserOutlined, FileTextOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import orcamentoService from '../../services/orcamentoService';
import * as osService from '../../services/osService';
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
    DatePicker
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

function OrcamentoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [ordensServico, setOrdensServico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchOrcamentoData = async () => {
            try {
                const [orcamentoData, osData] = await Promise.all([
                    orcamentoService.getOrcamentoById(id),
                    osService.getAllOrdensServico(),
                ]);

                // Formatar data para dayjs
                const formattedDate = orcamentoData.dataValidade
                    ? dayjs(orcamentoData.dataValidade)
                    : null;

                // Definir valores iniciais do formulário
                form.setFieldsValue({
                    status: orcamentoData.status || 'PENDENTE',
                    ordemServicoOrigemId: orcamentoData.ordemServicoOrigemId || null,
                    dataValidade: formattedDate,
                    observacoesCondicoes: orcamentoData.observacoesCondicoes || '',
                });

                setOrdensServico(osData);
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
            const payload = {
                ...values,
                ordemServicoOrigemId: values.ordemServicoOrigemId || null,
                dataValidade: values.dataValidade ? values.dataValidade.format('YYYY-MM-DD') : null,
            };

            await orcamentoService.updateOrcamento(id, payload);
            message.success('Orçamento atualizado com sucesso!');
            navigate(`/admin/orcamentos/detalhes/${id}`);
        } catch (err) {
            message.error('Falha ao atualizar o orçamento.');
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
                                    optionFilterProp="children"
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
        </PageContainer>
    );
}

export default OrcamentoEditPage; 
