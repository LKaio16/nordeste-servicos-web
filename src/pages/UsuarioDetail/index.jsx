import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as usuarioService from '../../services/usuarioService';
import { PageContainer, PageHeader, Title, Button, DetailSection, DetailItem, DetailLabel, DetailValue, ActionButton } from '../../styles/common';

function UsuarioDetailPage() {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuarioDetails = async () => {
            try {
                const usuarioData = await usuarioService.getUsuarioById(id);
                setUsuario(usuarioData);
            } catch (err) {
                setError('Falha ao carregar os detalhes do usuário.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsuarioDetails();
    }, [id]);

    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!usuario) return <p>Usuário não encontrado.</p>;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Detalhes do Usuário</Title>
                <ActionButton as={Link} to={`/admin/usuarios/editar/${id}`}>
                    Editar
                </ActionButton>
            </PageHeader>
            <DetailSection>
                <DetailItem>
                    <DetailLabel>Nome:</DetailLabel>
                    <DetailValue>{usuario.nome}</DetailValue>
                </DetailItem>
                <DetailItem>
                    <DetailLabel>Email:</DetailLabel>
                    <DetailValue>{usuario.email}</DetailValue>
                </DetailItem>
                <DetailItem>
                    <DetailLabel>Perfil:</DetailLabel>
                    <DetailValue>{usuario.perfil}</DetailValue>
                </DetailItem>
            </DetailSection>
            <Button as={Link} to="/admin/usuarios">
                Voltar para a Lista
            </Button>
        </PageContainer>
    );
}

export default UsuarioDetailPage; 