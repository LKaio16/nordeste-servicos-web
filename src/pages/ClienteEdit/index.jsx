import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowLeft, FiSave, FiUser, FiMapPin } from 'react-icons/fi';
import { getClienteById, updateCliente } from '../../services/clienteService';
import { buscarEnderecoPorCEP } from '../../utils/cepService';
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

const formatCEP = (v) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
const formatPhone = (v) => {
    const c = v.replace(/\D/g, '').slice(0, 11);
    return c.length > 10 ? c.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : c.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};
const formatCPF_CNPJ = (v) => {
    const c = v.replace(/\D/g, '').slice(0, 14);
    if (c.length <= 11) return c.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return c.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
};

function ClienteEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [clienteData, setClienteData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCEP, setIsLoadingCEP] = useState(false);

    const handleCEPChange = async (e) => {
        const formatted = formatCEP(e.target.value);
        form.setFieldsValue({ cep: formatted });
        const cepLimpo = e.target.value.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            setIsLoadingCEP(true);
            try {
                const end = await buscarEnderecoPorCEP(cepLimpo);
                form.setFieldsValue({ rua: end.rua, bairro: end.bairro, cidade: end.cidade, estado: end.estado });
                message.success('Endereço encontrado!');
            } catch { message.warning('CEP não encontrado.'); }
            finally { setIsLoadingCEP(false); }
        }
    };

    useEffect(() => {
        (async () => {
            if (!id) { setIsLoading(false); return; }
            try {
                const data = await getClienteById(id);
                setClienteData(data);
                form.setFieldsValue({
                    ...data,
                    cep: formatCEP(data.cep || ''),
                    cpfCnpj: formatCPF_CNPJ(data.cpfCnpj || ''),
                    telefonePrincipal: formatPhone(data.telefonePrincipal || ''),
                    telefoneAdicional: formatPhone(data.telefoneAdicional || ''),
                });
            } catch (err) { message.error(err.message || 'Não foi possível carregar os dados.'); }
            finally { setIsLoading(false); }
        })();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...values,
                cep: values.cep?.replace(/\D/g, '') || '',
                cpfCnpj: values.cpfCnpj?.replace(/\D/g, '') || '',
                telefonePrincipal: values.telefonePrincipal?.replace(/\D/g, '') || '',
                telefoneAdicional: values.telefoneAdicional?.replace(/\D/g, '') || '',
            };
            await updateCliente(id, payload);
            message.success('Cliente atualizado com sucesso!');
            navigate(`/admin/clientes/detalhes/${id}`);
        } catch (err) { message.error(err.message || 'Falha ao atualizar cliente.'); }
        finally { setIsSubmitting(false); }
    };

    if (isLoading) {
        return <Page><Hero><HeroInner><HeroInfo><h1>Editar Cliente</h1></HeroInfo></HeroInner></Hero><Content><LoadWrap><Spin size="large" /></LoadWrap></Content></Page>;
    }

    if (!clienteData) {
        return <Page><Hero><HeroInner><HeroInfo><h1>Cliente não encontrado</h1></HeroInfo></HeroInner></Hero></Page>;
    }

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <BackBtn onClick={() => navigate(`/admin/clientes/detalhes/${id}`)}><FiArrowLeft /></BackBtn>
                        <HeroInfo>
                            <h1>Editar Cliente</h1>
                            <p>{clienteData.nomeCompleto}</p>
                        </HeroInfo>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={() => navigate(`/admin/clientes/detalhes/${id}`)}>
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
                    <SectionHead><FiUser /><h3>Dados do Cliente</h3></SectionHead>
                    <FormBody>
                        <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>
                            <Row gutter={[16, 0]}>
                                <Col xs={24}>
                                    <Form.Item name="nomeCompleto" label="Nome Completo" rules={[{ required: true, message: 'Obrigatório' }, { min: 2 }]}>
                                        <Input placeholder="Nome completo do cliente" maxLength={100} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="tipoCliente" label="Tipo de Cliente" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Select placeholder="Selecione...">
                                            <Select.Option value="PESSOA_FISICA">Pessoa Física</Select.Option>
                                            <Select.Option value="PESSOA_JURIDICA">Pessoa Jurídica</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="cpfCnpj" label="CPF / CNPJ" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Input placeholder="000.000.000-00" onChange={e => form.setFieldsValue({ cpfCnpj: formatCPF_CNPJ(e.target.value) })} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="telefonePrincipal" label="Telefone Principal" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Input placeholder="(00) 00000-0000" onChange={e => form.setFieldsValue({ telefonePrincipal: formatPhone(e.target.value) })} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="telefoneAdicional" label="Telefone Adicional">
                                        <Input placeholder="(00) 00000-0000" onChange={e => form.setFieldsValue({ telefoneAdicional: formatPhone(e.target.value) })} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item name="email" label="E-mail" rules={[{ required: true, message: 'Obrigatório' }, { type: 'email', message: 'E-mail inválido' }]}>
                                        <Input placeholder="email@exemplo.com" type="email" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </StyledForm>
                    </FormBody>

                    <SectionHead><FiMapPin /><h3>Endereço</h3></SectionHead>
                    <FormBody>
                        <StyledForm form={form} layout="vertical" onFinish={handleSubmit} component={false}>
                            <Row gutter={[16, 0]}>
                                <Col xs={24} md={8}>
                                    <Form.Item name="cep" label="CEP" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Input placeholder="00000-000" suffix={isLoadingCEP ? <Spin size="small" /> : null} onChange={handleCEPChange} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={16}>
                                    <Form.Item name="rua" label="Rua" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Input placeholder="Nome da rua" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="numero" label="Número" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Input placeholder="Nº" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={16}>
                                    <Form.Item name="complemento" label="Complemento">
                                        <Input placeholder="Apto, bloco..." />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="bairro" label="Bairro" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Input placeholder="Bairro" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="cidade" label="Cidade" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Input placeholder="Cidade" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="estado" label="Estado (UF)" rules={[{ required: true, message: 'Obrigatório' }, { max: 2 }]}>
                                        <Input placeholder="UF" maxLength={2} />
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

export default ClienteEdit;
