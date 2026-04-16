import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
    FiArrowLeft, FiEdit2, FiTrash2, FiUser, FiPhone, FiMail,
    FiMapPin, FiFileText, FiAlertCircle
} from 'react-icons/fi';
import { getClienteById, deleteCliente } from '../../services/clienteService';
import { message, Spin } from 'antd';

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
const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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
    &:hover { background: #f0f7ff; box-shadow: 0 4px 16px rgba(0,0,0,0.15); transform: translateY(-1px); }
`;

const DangerGhostBtn = styled(Btn)`
    background: rgba(220,38,38,0.15); color: #fca5a5; border: 1px solid rgba(220,38,38,0.3);
    &:hover { background: rgba(220,38,38,0.25); color: #fff; }
`;

const Content = styled.div`
    margin-top: -44px; position: relative; z-index: 2;
`;

const Section = styled.div`
    background: #fff; border-radius: 16px;
    box-shadow: 0 2px 10px rgba(12,45,107,0.06); border: 1px solid rgba(26,68,148,0.06);
    margin-bottom: 18px; overflow: hidden;
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: ${p => p.$d || '0.15s'};
`;

const SectionHeader = styled.div`
    display: flex; align-items: center; gap: 10px;
    padding: 18px 24px; border-bottom: 1px solid #eef2f9;
    svg { width: 18px; height: 18px; color: #1a4494; }
    h3 { margin: 0; font-size: 15px; font-weight: 700; color: #0c2d6b; }
`;

const FieldsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(${p => p.$cols || 2}, 1fr);
    gap: 0;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
    padding: 18px 24px;
    border-bottom: 1px solid #f5f8fd;
    border-right: 1px solid #f5f8fd;
    &:last-child { border-bottom: none; }
    @media (max-width: 768px) { border-right: none; }
`;

const FieldLabel = styled.div`
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.8px; color: #6b86b8; margin-bottom: 6px;
`;

const FieldValue = styled.div`
    font-size: 15px; font-weight: 600; color: #0c2d6b;
    display: flex; align-items: center; gap: 8px;
    ${p => p.$muted && 'color: #a8b8d0; font-weight: 400;'}
`;

const LoadWrap = styled.div`
    display: flex; align-items: center; justify-content: center;
    min-height: 40vh; gap: 16px;
    .ant-spin-dot-item { background-color: #1a4494 !important; }
`;

const ConfirmOverlay = styled.div`
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(10,30,61,0.5); backdrop-filter: blur(3px);
    display: flex; align-items: center; justify-content: center;
    animation: ${fadeIn} 0.15s ease;
`;

const ConfirmBox = styled.div`
    background: #fff; border-radius: 16px; padding: 32px;
    max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); text-align: center;
    h3 { margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #0c2d6b; }
    p { margin: 0 0 24px; font-size: 14px; color: #6b86b8; line-height: 1.5; }
`;

const ConfirmActions = styled.div`
    display: flex; gap: 10px; justify-content: center;
`;

function ClienteDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setCliente(await getClienteById(id));
            } catch { message.error('Falha ao carregar dados do cliente.'); }
            finally { setIsLoading(false); }
        })();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteCliente(id);
            message.success('Cliente excluído com sucesso!');
            navigate('/admin/clientes');
        } catch (err) {
            message.error(err.message || 'Falha ao excluir o cliente.');
        }
        setShowDelete(false);
    };

    if (isLoading) {
        return <Page><Hero><HeroInner><HeroInfo><h1>Detalhes do Cliente</h1></HeroInfo></HeroInner></Hero><Content><LoadWrap><Spin size="large" /></LoadWrap></Content></Page>;
    }

    if (!cliente) {
        return <Page><Hero><HeroInner><HeroInfo><h1>Cliente não encontrado</h1></HeroInfo></HeroInner></Hero></Page>;
    }

    const tipo = cliente.tipoCliente === 'PESSOA_FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica';
    const val = (v) => v || '—';

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <BackBtn onClick={() => navigate(-1)}><FiArrowLeft /></BackBtn>
                        <HeroInfo>
                            <h1>{cliente.nomeCompleto}</h1>
                            <p>{tipo} · {val(cliente.cpfCnpj)}</p>
                        </HeroInfo>
                    </HeroLeft>
                    <HeroActions>
                        <PrimaryBtn onClick={() => navigate(`/admin/clientes/editar/${id}`)}>
                            <FiEdit2 /> Editar
                        </PrimaryBtn>
                        <DangerGhostBtn onClick={() => setShowDelete(true)}>
                            <FiTrash2 /> Excluir
                        </DangerGhostBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <Section $d="0.1s">
                    <SectionHeader><FiUser /><h3>Informações Gerais</h3></SectionHeader>
                    <FieldsGrid $cols={3}>
                        <Field>
                            <FieldLabel>Nome Completo</FieldLabel>
                            <FieldValue>{val(cliente.nomeCompleto)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>CPF / CNPJ</FieldLabel>
                            <FieldValue>{val(cliente.cpfCnpj)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>Tipo de Cliente</FieldLabel>
                            <FieldValue>{tipo}</FieldValue>
                        </Field>
                    </FieldsGrid>
                </Section>

                <Section $d="0.18s">
                    <SectionHeader><FiPhone /><h3>Contato</h3></SectionHeader>
                    <FieldsGrid $cols={3}>
                        <Field>
                            <FieldLabel>Telefone Principal</FieldLabel>
                            <FieldValue>{val(cliente.telefonePrincipal)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>Telefone Adicional</FieldLabel>
                            <FieldValue $muted={!cliente.telefoneAdicional}>{val(cliente.telefoneAdicional)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>E-mail</FieldLabel>
                            <FieldValue>{val(cliente.email)}</FieldValue>
                        </Field>
                    </FieldsGrid>
                </Section>

                <Section $d="0.26s">
                    <SectionHeader><FiMapPin /><h3>Endereço</h3></SectionHeader>
                    <FieldsGrid $cols={3}>
                        <Field>
                            <FieldLabel>Rua</FieldLabel>
                            <FieldValue>{val(cliente.rua)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>Número</FieldLabel>
                            <FieldValue>{val(cliente.numero)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>CEP</FieldLabel>
                            <FieldValue>{val(cliente.cep)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>Complemento</FieldLabel>
                            <FieldValue $muted={!cliente.complemento}>{val(cliente.complemento)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>Bairro</FieldLabel>
                            <FieldValue>{val(cliente.bairro)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>Cidade / Estado</FieldLabel>
                            <FieldValue>{val(cliente.cidade)} {cliente.estado ? `- ${cliente.estado}` : ''}</FieldValue>
                        </Field>
                    </FieldsGrid>
                </Section>
            </Content>

            {showDelete && (
                <ConfirmOverlay onClick={() => setShowDelete(false)}>
                    <ConfirmBox onClick={e => e.stopPropagation()}>
                        <FiAlertCircle style={{ width: 40, height: 40, color: '#dc2626', marginBottom: 12 }} />
                        <h3>Excluir cliente?</h3>
                        <p>Tem certeza que deseja excluir <strong>{cliente.nomeCompleto}</strong>? Esta ação não pode ser desfeita.</p>
                        <ConfirmActions>
                            <Btn style={{ background: '#f4f7fb', color: '#6b86b8' }} onClick={() => setShowDelete(false)}>Cancelar</Btn>
                            <Btn style={{ background: '#dc2626', color: '#fff' }} onClick={handleDelete}><FiTrash2 /> Excluir</Btn>
                        </ConfirmActions>
                    </ConfirmBox>
                </ConfirmOverlay>
            )}
        </Page>
    );
}

export default ClienteDetailPage;
