import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as usuarioService from '../../services/usuarioService';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import {
    PageContainer,
    PageHeader,
    Title,
    Button,
    HeaderActions
} from '../../styles/common';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: #1f2937;
  font-weight: 500;
`;

function UsuarioDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleDelete = async () => {
        try {
            await usuarioService.deleteUsuario(id);
            navigate('/admin/usuarios');
        } catch (err) {
            console.error('Erro ao deletar usuário:', err);
            alert('Falha ao deletar usuário.');
        } finally {
            setIsModalOpen(false);
        }
    };
    
    if (isLoading) return <PageContainer><Spinner /></PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>{error}</p></PageContainer>;
    if (!usuario) return <PageContainer><p>Usuário não encontrado.</p></PageContainer>;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Detalhes do Usuário</Title>
                <HeaderActions>
                    <Button as={Link} to={`/admin/usuarios/editar/${id}`}>Editar</Button>
                    <Button variant="danger" onClick={() => setIsModalOpen(true)}>Excluir</Button>
                </HeaderActions>
            </PageHeader>
            <Card>
                 <SectionTitle>{usuario.nome}</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Email:</DetailLabel>
                        <DetailValue>{usuario.email}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Perfil:</DetailLabel>
                        <DetailValue>{usuario.perfil}</DetailValue>
                    </DetailItem>
                     <DetailItem>
                        <DetailLabel>Crachá:</DetailLabel>
                        <DetailValue>{usuario.cracha || 'N/A'}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
            >
                <p>Tem certeza que deseja excluir o usuário <strong>{usuario?.nome}</strong>?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </Modal>
        </PageContainer>
    );
}

export default UsuarioDetailPage; 