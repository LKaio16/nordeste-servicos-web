import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowLeft, FiSave, FiClipboard, FiTool } from 'react-icons/fi';
import * as osService from '../../services/osService';
import * as clienteService from '../../services/clienteService';
import * as equipamentoService from '../../services/equipamentoService';
import * as usuarioService from '../../services/usuarioService';
import { Form, Input, Select, message, Spin, Row, Col } from 'antd';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
`;
const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const Page = styled.div`
    padding-bottom: 32px;
    animation: ${fadeIn} 0.3s ease both;
`;

const Hero = styled.div`
    background: linear-gradient(145deg, #0c2d6b 0%, #1a4494 40%, #1e5bb5 70%, #2b6fc2 100%);
    margin: -24px -32px 0;
    padding: 32px 36px 72px;
    position: relative;
    overflow: hidden;
    animation: ${slideDown} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    &::before {
        content: '';
        position: absolute;
        top: -80px;
        right: -40px;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.04);
    }
    @media (max-width: 768px) {
        margin: -16px -16px 0;
        padding: 24px 20px 64px;
    }
`;

const HeroInner = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
`;

const HeroLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const BackBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    svg {
        width: 18px;
        height: 18px;
    }
`;

const HeroInfo = styled.div`
    h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.3px;
    }
    p {
        margin: 4px 0 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
    }
`;

const HeroActions = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
`;

const Btn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    white-space: nowrap;
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    svg {
        width: 16px;
        height: 16px;
    }
`;

const PrimaryBtn = styled(Btn)`
    background: #fff;
    color: #1a4494;
    &:hover:not(:disabled) {
        background: #f0f7ff;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
    }
`;

const GhostBtn = styled(Btn)`
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const Content = styled.div`
    margin-top: -44px;
    position: relative;
    z-index: 2;
`;

const FormCard = styled.div`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(12, 45, 107, 0.1);
    border: 1px solid rgba(26, 68, 148, 0.06);
    overflow: hidden;
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
`;

const SectionHead = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 28px;
    background: #f8faff;
    border-bottom: 1px solid #eef2f9;
    svg {
        width: 18px;
        height: 18px;
        color: #1a4494;
    }
    h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: #0c2d6b;
    }
`;

const FormBody = styled.div`
    padding: 24px 28px;
`;

const StyledForm = styled(Form)`
    .ant-form-item-label > label {
        font-size: 13px;
        font-weight: 600;
        color: #0c2d6b;
    }
    .ant-input,
    .ant-select-selector {
        height: 44px !important;
        font-size: 14px;
        border: 1.5px solid #dde4f0 !important;
        border-radius: 10px !important;
        &:hover {
            border-color: #1a4494 !important;
        }
        &:focus,
        &.ant-input-focused {
            border-color: #1a4494 !important;
            box-shadow: 0 0 0 3px rgba(26, 68, 148, 0.08) !important;
        }
    }
    .ant-select-selector {
        .ant-select-selection-item {
            line-height: 42px !important;
        }
    }
    .ant-select-focused .ant-select-selector {
        border-color: #1a4494 !important;
        box-shadow: 0 0 0 3px rgba(26, 68, 148, 0.08) !important;
    }
    textarea.ant-input {
        min-height: 120px;
        border-radius: 10px !important;
    }
    .ant-form-item-explain-error {
        font-size: 12px;
    }
`;

const LoadWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    .ant-spin-dot-item {
        background-color: #1a4494 !important;
    }
`;

function OrdemServicoCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [clientes, setClientes] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [equipamentosFiltrados, setEquipamentosFiltrados] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const clienteIdWatch = Form.useWatch('clienteId', form);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [clientesRes, equipamentosRes, tecnicosRes] = await Promise.all([
                    clienteService.getAllClientes(),
                    equipamentoService.getAllEquipamentos(),
                    usuarioService.getAllUsuarios(),
                ]);
                setClientes(clientesRes);
                setEquipamentos(equipamentosRes);
                setTecnicos(tecnicosRes.filter((u) => u.perfil === 'TECNICO'));
            } catch (err) {
                console.error('Falha ao carregar dados iniciais:', err);
                message.error('Falha ao carregar dados para o formulário.');
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleClienteChange = (clienteId) => {
        if (clienteId) {
            setEquipamentosFiltrados(equipamentos.filter((e) => e.clienteId === clienteId));
        } else {
            setEquipamentosFiltrados([]);
        }
        form.setFieldsValue({ equipamentoId: undefined });
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const payload = {
                problemaRelatado: values.problemaRelatado,
                analiseFalha: values.analiseFalha || '',
                solucaoAplicada: values.solucaoAplicada || '',
                status: 'EM_ABERTO',
                prioridade: values.prioridade || 'MEDIA',
                cliente: { id: values.clienteId },
                equipamento: { id: values.equipamentoId },
                tecnicoAtribuido: values.tecnicoId ? { id: values.tecnicoId } : null,
            };
            const novaOS = await osService.createOrdemServico(payload);
            message.success('Ordem de Serviço criada com sucesso!');
            navigate(`/admin/os/detalhes/${novaOS.id}`);
        } catch (err) {
            message.error(err?.message || 'Falha ao criar a Ordem de Serviço.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Page>
                <Hero>
                    <HeroInner>
                        <HeroInfo>
                            <h1>Nova OS</h1>
                        </HeroInfo>
                    </HeroInner>
                </Hero>
                <Content>
                    <LoadWrap>
                        <Spin size="large" />
                    </LoadWrap>
                </Content>
            </Page>
        );
    }

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <BackBtn onClick={() => navigate('/admin/os')}>
                            <FiArrowLeft />
                        </BackBtn>
                        <HeroInfo>
                            <h1>Nova Ordem de Serviço</h1>
                            <p>Cliente, equipamento e descrição do problema</p>
                        </HeroInfo>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={() => navigate('/admin/os')}>
                            <FiArrowLeft /> Cancelar
                        </GhostBtn>
                        <PrimaryBtn onClick={() => form.submit()} disabled={isSubmitting}>
                            <FiSave /> {isSubmitting ? 'Salvando...' : 'Criar OS'}
                        </PrimaryBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <FormCard>
                    <SectionHead>
                        <FiClipboard />
                        <h3>Dados da OS</h3>
                    </SectionHead>
                    <FormBody>
                        <StyledForm
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{ prioridade: 'MEDIA' }}
                        >
                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="clienteId"
                                        label="Cliente"
                                        rules={[{ required: true, message: 'Selecione o cliente' }]}
                                    >
                                        <Select
                                            placeholder="Selecione um cliente"
                                            showSearch
                                            optionFilterProp="children"
                                            onChange={handleClienteChange}
                                            allowClear
                                        >
                                            {clientes.map((c) => (
                                                <Select.Option key={c.id} value={c.id}>
                                                    {c.nomeCompleto}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="equipamentoId"
                                        label="Equipamento"
                                        rules={[{ required: true, message: 'Selecione o equipamento' }]}
                                    >
                                        <Select
                                            placeholder="Selecione um equipamento"
                                            showSearch
                                            optionFilterProp="children"
                                            disabled={!clienteIdWatch}
                                        >
                                            {equipamentosFiltrados.map((eq) => (
                                                <Select.Option key={eq.id} value={eq.id}>
                                                    {eq.marcaModelo} (S/N: {eq.numeroSerieChassi})
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="tecnicoId" label="Técnico (opcional)">
                                        <Select placeholder="Atribuir técnico" showSearch optionFilterProp="children" allowClear>
                                            {tecnicos.map((t) => (
                                                <Select.Option key={t.id} value={t.id}>
                                                    {t.nome}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="prioridade" label="Prioridade" rules={[{ required: true }]}>
                                        <Select>
                                            <Select.Option value="BAIXA">Baixa</Select.Option>
                                            <Select.Option value="MEDIA">Média</Select.Option>
                                            <Select.Option value="ALTA">Alta</Select.Option>
                                            <Select.Option value="URGENTE">Urgente</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        name="problemaRelatado"
                                        label="Problema relatado"
                                        rules={[{ required: true, message: 'Descreva o problema' }]}
                                    >
                                        <Input.TextArea rows={4} placeholder="Descreva o que o cliente relatou..." maxLength={2000} showCount />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </StyledForm>
                    </FormBody>

                    <SectionHead>
                        <FiTool />
                        <h3>Análise e solução (opcional)</h3>
                    </SectionHead>
                    <FormBody>
                        <StyledForm form={form} layout="vertical" onFinish={handleSubmit} component={false}>
                            <Row gutter={[16, 0]}>
                                <Col xs={24}>
                                    <Form.Item name="analiseFalha" label="Análise da falha">
                                        <Input.TextArea rows={3} placeholder="Preencha após diagnóstico..." maxLength={2000} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item name="solucaoAplicada" label="Solução aplicada">
                                        <Input.TextArea rows={3} placeholder="Descreva a solução quando houver..." maxLength={2000} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </StyledForm>
                    </FormBody>
                </FormCard>
            </Content>
        </Page>
    );
}

export default OrdemServicoCreatePage;
