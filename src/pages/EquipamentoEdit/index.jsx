import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowLeft, FiSave, FiTool, FiUser } from 'react-icons/fi';
import { getEquipamentoById, updateEquipamento } from '../../services/equipamentoService';
import { getAllClientes } from '../../services/clienteService';
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
    position: relative; overflow: hidden;
    animation: ${slideDown} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    &::before { content:''; position:absolute; top:-80px; right:-40px; width:400px; height:400px; border-radius:50%; background:rgba(255,255,255,0.04); }
    @media (max-width: 768px) { margin: -16px -16px 0; padding: 24px 20px 64px; }
`;

const HeroInner = styled.div`
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
`;

const HeroLeft = styled.div`
    display: flex; align-items: center; gap: 16px;
`;

const BackBtn = styled.button`
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
    &:hover { background: rgba(255,255,255,0.2); }
    svg { width: 18px; height: 18px; }
`;

const HeroInfo = styled.div`
    h1 { margin: 0; font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
    p { margin: 4px 0 0; font-size: 14px; color: rgba(255,255,255,0.65); }
`;

const HeroActions = styled.div`
    display: flex; gap: 10px; flex-wrap: wrap;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
`;

const Btn = styled.button`
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; font-size: 13px; font-weight: 600; font-family: inherit;
    border-radius: 10px; cursor: pointer; transition: all 0.2s; border: none; white-space: nowrap;
    &:disabled { opacity: 0.5; cursor: not-allowed; }
    svg { width: 16px; height: 16px; }
`;

const PrimaryBtn = styled(Btn)`
    background: #fff; color: #1a4494;
    &:hover:not(:disabled) { background: #f0f7ff; box-shadow: 0 4px 16px rgba(0,0,0,0.15); transform: translateY(-1px); }
`;

const GhostBtn = styled(Btn)`
    background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.15);
    &:hover { background: rgba(255,255,255,0.2); }
`;

const Content = styled.div`
    margin-top: -44px; position: relative; z-index: 2;
`;

const FormCard = styled.div`
    background: #fff; border-radius: 16px;
    box-shadow: 0 4px 20px rgba(12,45,107,0.1); border: 1px solid rgba(26,68,148,0.06);
    overflow: hidden;
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
`;

const SectionHead = styled.div`
    display: flex; align-items: center; gap: 10px;
    padding: 18px 28px; background: #f8faff; border-bottom: 1px solid #eef2f9;
    svg { width: 18px; height: 18px; color: #1a4494; }
    h3 { margin: 0; font-size: 15px; font-weight: 700; color: #0c2d6b; }
`;

const FormBody = styled.div`
    padding: 24px 28px;
`;

const StyledForm = styled(Form)`
    .ant-form-item-label > label {
        font-size: 13px; font-weight: 600; color: #0c2d6b;
    }
    .ant-input, .ant-select-selector {
        height: 44px !important; font-size: 14px;
        border: 1.5px solid #dde4f0 !important; border-radius: 10px !important;
        &:hover { border-color: #1a4494 !important; }
        &:focus, &.ant-input-focused { border-color: #1a4494 !important; box-shadow: 0 0 0 3px rgba(26,68,148,0.08) !important; }
    }
    .ant-select-selector {
        .ant-select-selection-item { line-height: 42px !important; }
    }
    .ant-select-focused .ant-select-selector {
        border-color: #1a4494 !important; box-shadow: 0 0 0 3px rgba(26,68,148,0.08) !important;
    }
    .ant-form-item-explain-error { font-size: 12px; }
`;

const LoadWrap = styled.div`
    display: flex; align-items: center; justify-content: center;
    min-height: 40vh;
    .ant-spin-dot-item { background-color: #1a4494 !important; }
`;

function EquipamentoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [equipamentoData, setEquipamentoData] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            if (!id) { setIsLoading(false); return; }
            try {
                const [equipamento, clientesData] = await Promise.all([
                    getEquipamentoById(id),
                    getAllClientes()
                ]);
                setEquipamentoData(equipamento);
                setClientes(clientesData);
                form.setFieldsValue({
                    tipo: equipamento.tipo || '',
                    marcaModelo: equipamento.marcaModelo || '',
                    numeroSerieChassi: equipamento.numeroSerieChassi || '',
                    horimetro: equipamento.horimetro || 0,
                    clienteId: equipamento.clienteId || null,
                });
            } catch (err) { message.error(err.message || 'Não foi possível carregar os dados.'); }
            finally { setIsLoading(false); }
        })();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            await updateEquipamento(id, values);
            message.success('Equipamento atualizado com sucesso!');
            navigate('/admin/equipamentos');
        } catch (err) { message.error(err.message || 'Falha ao atualizar o equipamento.'); }
        finally { setIsSubmitting(false); }
    };

    if (isLoading) {
        return <Page><Hero><HeroInner><HeroInfo><h1>Editar Equipamento</h1></HeroInfo></HeroInner></Hero><Content><LoadWrap><Spin size="large" /></LoadWrap></Content></Page>;
    }

    if (!equipamentoData) {
        return <Page><Hero><HeroInner><HeroInfo><h1>Equipamento não encontrado</h1></HeroInfo></HeroInner></Hero></Page>;
    }

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <BackBtn onClick={() => navigate('/admin/equipamentos')}><FiArrowLeft /></BackBtn>
                        <HeroInfo>
                            <h1>Editar Equipamento</h1>
                            <p>{equipamentoData.marcaModelo}</p>
                        </HeroInfo>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={() => navigate('/admin/equipamentos')}>
                            <FiArrowLeft /> Cancelar
                        </GhostBtn>
                        <PrimaryBtn onClick={() => form.submit()} disabled={isSubmitting}>
                            <FiSave /> {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </PrimaryBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <FormCard>
                    <SectionHead><FiTool /><h3>Dados do Equipamento</h3></SectionHead>
                    <FormBody>
                        <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>
                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="tipo" label="Tipo do Equipamento" rules={[{ required: true, message: 'Obrigatório' }, { min: 2 }]}>
                                        <Input placeholder="Ex: Trator, Colheitadeira..." maxLength={50} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="marcaModelo" label="Marca / Modelo" rules={[{ required: true, message: 'Obrigatório' }, { min: 2 }]}>
                                        <Input placeholder="Ex: John Deere 6110J" maxLength={100} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="numeroSerieChassi" label="Número de Série / Chassi">
                                        <Input placeholder="Número de série ou chassi" maxLength={50} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="horimetro" label="Horímetro (horas)" rules={[{ pattern: /^\d+(\.\d+)?$/, message: 'Número inválido' }]}>
                                        <Input type="number" placeholder="Ex: 100.5" min={0} step="0.1" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item name="clienteId" label="Cliente Proprietário" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Select
                                            placeholder="Selecione o cliente proprietário"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {clientes.map(cliente => (
                                                <Select.Option key={cliente.id} value={cliente.id}>
                                                    {cliente.nomeCompleto}
                                                </Select.Option>
                                            ))}
                                        </Select>
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

export default EquipamentoEditPage;
