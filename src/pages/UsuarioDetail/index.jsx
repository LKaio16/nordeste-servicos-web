import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowLeft, FiEdit2, FiTrash2, FiUser, FiMail, FiCreditCard, FiUsers, FiAlertCircle } from 'react-icons/fi';
import * as usuarioService from '../../services/usuarioService';
import { message, Spin, Avatar } from 'antd';

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
    svg {
        width: 16px;
        height: 16px;
    }
`;

const PrimaryBtn = styled(Btn)`
    background: #fff;
    color: #1a4494;
    &:hover {
        background: #f0f7ff;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
    }
`;

const DangerGhostBtn = styled(Btn)`
    background: rgba(220, 38, 38, 0.15);
    color: #fca5a5;
    border: 1px solid rgba(220, 38, 38, 0.3);
    &:hover {
        background: rgba(220, 38, 38, 0.25);
        color: #fff;
    }
`;

const Content = styled.div`
    margin-top: -44px;
    position: relative;
    z-index: 2;
`;

const Section = styled.div`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(12, 45, 107, 0.06);
    border: 1px solid rgba(26, 68, 148, 0.06);
    margin-bottom: 18px;
    overflow: hidden;
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: ${(p) => p.$d || '0.15s'};
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 24px;
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

const FieldsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(${(p) => p.$cols || 2}, 1fr);
    gap: 0;
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const Field = styled.div`
    padding: 18px 24px;
    border-bottom: 1px solid #f5f8fd;
    border-right: 1px solid #f5f8fd;
    &:last-child {
        border-bottom: none;
    }
    @media (max-width: 768px) {
        border-right: none;
    }
`;

const FieldLabel = styled.div`
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #6b86b8;
    margin-bottom: 6px;
`;

const FieldValue = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #0c2d6b;
    display: flex;
    align-items: center;
    gap: 8px;
    ${(p) => p.$muted && 'color: #a8b8d0; font-weight: 400;'}
`;

const PerfilPill = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => (p.$admin ? '#a61b1b' : '#237804')};
    background: ${(p) => (p.$admin ? '#fff1f0' : '#e6f7e6')};
`;

const AvatarWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 24px;
`;

const LoadWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    gap: 16px;
    color: #6b86b8;
    .ant-spin-dot-item {
        background-color: #1a4494 !important;
    }
`;

const ConfirmOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(10, 30, 61, 0.5);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${fadeIn} 0.15s ease;
`;

const ConfirmBox = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    text-align: center;
    h3 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 700;
        color: #0c2d6b;
    }
    p {
        margin: 0 0 24px;
        font-size: 14px;
        color: #6b86b8;
        line-height: 1.5;
    }
`;

const ConfirmActions = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
`;

function getImageSrc(fotoUrl, fotoPerfil) {
    const src = fotoUrl || fotoPerfil;
    if (!src) return null;
    if (src.startsWith('http')) return src;
    if (src.startsWith('data:image')) return src;
    return `data:image/jpeg;base64,${src}`;
}

function getProfileText(perfil) {
    if (perfil === 'ADMIN') return 'Administrador';
    if (perfil === 'TECNICO') return 'Técnico';
    return perfil || '—';
}

function UsuarioDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        const fetchUsuarioDetails = async () => {
            try {
                const usuarioData = await usuarioService.getUsuarioById(id);
                setUsuario(usuarioData);
            } catch (err) {
                message.error('Falha ao carregar os detalhes do usuário.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsuarioDetails();
    }, [id]);

    const handleDelete = async () => {
        try {
            await usuarioService.deleteUsuario(id);
            message.success('Usuário excluído com sucesso!');
            navigate('/admin/usuarios');
        } catch (err) {
            console.error('Erro ao deletar usuário:', err);
            message.error(err.response?.data?.message || 'Falha ao deletar usuário.');
        }
        setShowDelete(false);
    };

    const val = (v) => v || '—';

    if (isLoading) {
        return (
            <Page>
                <LoadWrap>
                    <Spin size="large" />
                    <span>Carregando dados do usuário...</span>
                </LoadWrap>
            </Page>
        );
    }

    if (!usuario) {
        return (
            <Page>
                <LoadWrap>
                    <span>Usuário não encontrado.</span>
                </LoadWrap>
            </Page>
        );
    }

    const avatarSrc = getImageSrc(usuario.fotoUrl, usuario.fotoPerfil);

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <BackBtn type="button" onClick={() => navigate('/admin/usuarios')} aria-label="Voltar">
                            <FiArrowLeft />
                        </BackBtn>
                        <HeroInfo>
                            <h1>{usuario.nome}</h1>
                            <p>{val(usuario.email)}</p>
                        </HeroInfo>
                    </HeroLeft>
                    <HeroActions>
                        <PrimaryBtn type="button" onClick={() => navigate(`/admin/usuarios/editar/${id}`)}>
                            <FiEdit2 /> Editar
                        </PrimaryBtn>
                        <DangerGhostBtn type="button" onClick={() => setShowDelete(true)}>
                            <FiTrash2 /> Excluir
                        </DangerGhostBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <Section $d="0.1s">
                    <SectionHeader>
                        <FiUser />
                        <h3>Informações gerais</h3>
                    </SectionHeader>
                    <FieldsGrid $cols={2}>
                        <Field>
                            <FieldLabel>Nome completo</FieldLabel>
                            <FieldValue>{val(usuario.nome)}</FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>E-mail</FieldLabel>
                            <FieldValue>
                                <FiMail style={{ color: '#6b86b8' }} />
                                {val(usuario.email)}
                            </FieldValue>
                        </Field>
                        <Field>
                            <FieldLabel>Crachá</FieldLabel>
                            <FieldValue $muted={!usuario.cracha}>
                                <FiCreditCard style={{ color: '#6b86b8' }} />
                                {val(usuario.cracha)}
                            </FieldValue>
                        </Field>
                    </FieldsGrid>
                </Section>

                <Section $d="0.18s">
                    <SectionHeader>
                        <FiUsers />
                        <h3>Perfil</h3>
                    </SectionHeader>
                    <FieldsGrid $cols={1}>
                        <Field>
                            <FieldLabel>Tipo de usuário</FieldLabel>
                            <FieldValue>
                                <PerfilPill $admin={usuario.perfil === 'ADMIN'}>{getProfileText(usuario.perfil)}</PerfilPill>
                            </FieldValue>
                        </Field>
                    </FieldsGrid>
                </Section>

                <Section $d="0.26s">
                    <SectionHeader>
                        <FiUser />
                        <h3>Foto</h3>
                    </SectionHeader>
                    <AvatarWrap>
                        <Avatar size={96} src={avatarSrc} icon={!avatarSrc && <FiUser />} style={{ backgroundColor: '#1a4494' }} />
                    </AvatarWrap>
                </Section>
            </Content>

            {showDelete && (
                <ConfirmOverlay onClick={() => setShowDelete(false)}>
                    <ConfirmBox onClick={(e) => e.stopPropagation()}>
                        <FiAlertCircle style={{ width: 40, height: 40, color: '#dc2626', marginBottom: 12 }} />
                        <h3>Excluir usuário?</h3>
                        <p>
                            Deseja realmente excluir <strong>{usuario.nome}</strong>? Esta ação não pode ser desfeita.
                        </p>
                        <ConfirmActions>
                            <Btn
                                type="button"
                                style={{ background: '#f4f7fb', color: '#6b86b8' }}
                                onClick={() => setShowDelete(false)}
                            >
                                Cancelar
                            </Btn>
                            <Btn type="button" style={{ background: '#dc2626', color: '#fff' }} onClick={handleDelete}>
                                <FiTrash2 /> Excluir
                            </Btn>
                        </ConfirmActions>
                    </ConfirmBox>
                </ConfirmOverlay>
            )}
        </Page>
    );
}

export default UsuarioDetailPage;
