import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowLeft, FiSave, FiUserPlus, FiUser, FiCreditCard, FiMail, FiLock, FiUsers } from 'react-icons/fi';
import * as usuarioService from '../../services/usuarioService';
import { Form, Input, Select, message, Row, Col } from 'antd';

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
    .ant-input-affix-wrapper,
    .ant-select-selector {
        font-size: 14px;
        border-radius: 10px !important;
        border: 1.5px solid #dde4f0 !important;
    }
    .ant-input-affix-wrapper {
        padding: 0 11px;
        min-height: 44px;
    }
    .ant-input-affix-wrapper .ant-input {
        border: none !important;
        box-shadow: none !important;
    }
    .ant-input {
        height: 44px;
    }
    .ant-input-affix-wrapper:hover,
    .ant-input:hover,
    .ant-select-selector:hover {
        border-color: #1a4494 !important;
    }
    .ant-input-affix-wrapper-focused,
    .ant-input:focus,
    .ant-select-focused .ant-select-selector {
        border-color: #1a4494 !important;
        box-shadow: 0 0 0 3px rgba(26, 68, 148, 0.08) !important;
    }
    .ant-select-selector {
        height: 44px !important;
    }
    .ant-select-selector .ant-select-selection-item {
        line-height: 42px !important;
    }
    .ant-form-item-explain-error {
        font-size: 12px;
    }
`;

const prefixStyle = { color: '#6b86b8' };

function UsuarioCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            await usuarioService.createUsuario({ ...values, perfis: [values.perfil] });
            message.success('Usuário criado com sucesso!');
            navigate('/admin/usuarios');
        } catch (err) {
            message.error(err.response?.data?.message || err.message || 'Falha ao criar usuário.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <BackBtn type="button" onClick={() => navigate('/admin/usuarios')} aria-label="Voltar">
                            <FiArrowLeft />
                        </BackBtn>
                        <HeroInfo>
                            <h1>Novo usuário</h1>
                            <p>Cadastre acesso ao sistema</p>
                        </HeroInfo>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn type="button" onClick={() => navigate('/admin/usuarios')}>
                            <FiArrowLeft /> Voltar
                        </GhostBtn>
                        <PrimaryBtn type="button" onClick={() => form.submit()} disabled={isSubmitting}>
                            <FiSave /> {isSubmitting ? 'Criando...' : 'Criar usuário'}
                        </PrimaryBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <FormCard>
                    <SectionHead>
                        <FiUserPlus />
                        <h3>Dados do usuário</h3>
                    </SectionHead>
                    <FormBody>
                        <StyledForm
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{ perfil: 'TECNICO' }}
                        >
                            <Row gutter={[16, 0]}>
                                <Col xs={24}>
                                    <Form.Item
                                        name="nome"
                                        label="Nome completo"
                                        rules={[
                                            { required: true, message: 'Obrigatório' },
                                            { min: 2, message: 'Mínimo 2 caracteres' },
                                            { max: 100, message: 'Máximo 100 caracteres' },
                                        ]}
                                    >
                                        <Input prefix={<FiUser style={prefixStyle} />} placeholder="Nome completo" showCount maxLength={100} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="cracha" label="Crachá" rules={[{ max: 20, message: 'Máximo 20 caracteres' }]}>
                                        <Input
                                            prefix={<FiCreditCard style={prefixStyle} />}
                                            placeholder="Número do crachá (opcional)"
                                            showCount
                                            maxLength={20}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="email"
                                        label="E-mail"
                                        rules={[
                                            { required: true, message: 'Obrigatório' },
                                            { type: 'email', message: 'E-mail inválido' },
                                        ]}
                                    >
                                        <Input prefix={<FiMail style={prefixStyle} />} placeholder="email@exemplo.com" type="email" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="senha"
                                        label="Senha"
                                        rules={[
                                            { required: true, message: 'Obrigatório' },
                                            { min: 6, message: 'Mínimo 6 caracteres' },
                                        ]}
                                    >
                                        <Input.Password prefix={<FiLock style={prefixStyle} />} placeholder="Senha" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="perfil" label="Perfil" rules={[{ required: true, message: 'Obrigatório' }]}>
                                        <Select placeholder="Perfil" suffixIcon={<FiUsers style={prefixStyle} />}>
                                            <Select.Option value="ADMIN">Administrador</Select.Option>
                                            <Select.Option value="TECNICO">Técnico</Select.Option>
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

export default UsuarioCreatePage;
