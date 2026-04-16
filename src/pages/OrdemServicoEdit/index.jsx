import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowLeft, FiSave, FiClipboard, FiUser, FiTool, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import * as osService from '../../services/osService';
import * as clienteService from '../../services/clienteService';
import * as equipamentoService from '../../services/equipamentoService';
import * as usuarioService from '../../services/usuarioService';
import { Form, Input, Select, message, Spin, Row, Col } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

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
    .ant-select-selector .ant-select-selection-item {
        line-height: 42px !important;
    }
    .ant-select-focused .ant-select-selector {
        border-color: #1a4494 !important;
        box-shadow: 0 0 0 3px rgba(26, 68, 148, 0.08) !important;
    }
    textarea.ant-input {
        min-height: 100px;
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

function OrdemServicoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [osTitulo, setOsTitulo] = useState('');

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
                    usuarioService.getAllUsuarios().then((users) => users.filter((u) => u.perfil === 'TECNICO')),
                ]);

                form.setFieldsValue({
                    problemaRelatado: os.problemaRelatado || '',
                    analiseFalha: os.analiseFalha || '',
                    solucaoAplicada: os.solucaoAplicada || '',
                    status: os.status || '',
                    prioridade: os.prioridade || '',
                    clienteId: os.cliente?.id || null,
                    equipamentoId: os.equipamento?.id || null,
                    tecnicoId: os.tecnicoAtribuido?.id || null,
                });
                setOsTitulo(os.cliente?.nomeCompleto ? `OS #${id} · ${os.cliente.nomeCompleto}` : `OS #${id}`);

                setClientes(clientesData);
                setEquipamentos(equipamentosData);
                setTecnicos(tecnicosData);

                if (os.cliente?.id) {
                    setEquipamentosFiltrados(equipamentosData.filter((e) => e.clienteId === os.cliente.id));
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
            setEquipamentosFiltrados(equipamentos.filter((e) => e.clienteId === clienteId));
        } else {
            setEquipamentosFiltrados([]);
        }
        form.setFieldsValue({ equipamentoId: null });
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const { clienteId, equipamentoId, tecnicoId, ...rest } = values;
            const payload = {
                ...rest,
                cliente: { id: clienteId },
                equipamento: { id: equipamentoId },
                tecnicoAtribuido: tecnicoId ? { id: tecnicoId } : null,
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
            <Page>
                <Hero>
                    <HeroInner>
                        <HeroInfo>
                            <h1>Editar OS</h1>
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
                        <BackBtn onClick={() => navigate(`/admin/os/detalhes/${id}`)}>
                            <FiArrowLeft />
                        </BackBtn>
                        <HeroInfo>
                            <h1>Editar Ordem de Serviço</h1>
                            <p>{osTitulo}</p>
                        </HeroInfo>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={() => navigate(`/admin/os/detalhes/${id}`)}>
                            <FiArrowLeft /> Cancelar
                        </GhostBtn>
                        <PrimaryBtn onClick={() => form.submit()} disabled={isSubmitting}>
                            <FiSave /> {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
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
                        <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>
                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="clienteId"
                                        label={
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                <FiUser /> Cliente
                                            </span>
                                        }
                                        rules={[{ required: true, message: 'Selecione um cliente' }]}
                                    >
                                        <Select
                                            placeholder="Selecione um cliente"
                                            showSearch
                                            optionFilterProp="children"
                                            onChange={handleClienteChange}
                                            allowClear
                                        >
                                            {clientes.map((cliente) => (
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
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                <FiTool /> Equipamento
                                            </span>
                                        }
                                        rules={[{ required: true, message: 'Selecione um equipamento' }]}
                                    >
                                        <Select placeholder="Selecione um equipamento" showSearch optionFilterProp="children">
                                            {equipamentosFiltrados.map((equip) => (
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
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                <FiUser /> Técnico responsável
                                            </span>
                                        }
                                    >
                                        <Select placeholder="Opcional" showSearch optionFilterProp="children" allowClear>
                                            {tecnicos.map((tecnico) => (
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
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                <FiCheckCircle /> Status
                                            </span>
                                        }
                                        rules={[{ required: true, message: 'Selecione o status' }]}
                                    >
                                        <Select placeholder="Status">
                                            <Option value="EM_ABERTO">Em aberto</Option>
                                            <Option value="EM_ANDAMENTO">Em andamento</Option>
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
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                <FiAlertCircle /> Prioridade
                                            </span>
                                        }
                                        rules={[{ required: true, message: 'Selecione a prioridade' }]}
                                    >
                                        <Select placeholder="Prioridade">
                                            <Option value="BAIXA">Baixa</Option>
                                            <Option value="MEDIA">Média</Option>
                                            <Option value="ALTA">Alta</Option>
                                            <Option value="URGENTE">Urgente</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item name="problemaRelatado" label="Problema relatado">
                                        <TextArea rows={4} placeholder="Descreva o problema..." showCount maxLength={1000} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item name="analiseFalha" label="Análise da falha">
                                        <TextArea rows={4} placeholder="Análise técnica..." showCount maxLength={1000} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item name="solucaoAplicada" label="Solução aplicada">
                                        <TextArea rows={4} placeholder="Solução aplicada..." showCount maxLength={1000} />
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

export default OrdemServicoEditPage;





