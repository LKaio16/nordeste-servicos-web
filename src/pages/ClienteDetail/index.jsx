import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getClienteById, deleteCliente } from '../../services/clienteService';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import { FiArrowLeft } from 'react-icons/fi';
import {
    PageContainer,
    PageHeader,
    Title,
    Button,
    HeaderActions
} from '../../styles/common';
import styled from 'styled-components';

const BackButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    color: #4A5568;
    margin-right: 0.75rem;

    &:hover {
        color: #2D3748;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: baseline;
`;

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

function ClienteDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const data = await getClienteById(id);
                setCliente(data);
            } catch (err) {
                console.error(err);
                setError('Falha ao carregar dados do cliente.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchCliente();
        }
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteCliente(id);
            navigate('/admin/clientes');
        } catch (err) {
            console.error('Erro ao deletar cliente:', err);
            alert('Falha ao deletar cliente.');
        } finally {
            setIsModalOpen(false);
        }
    };

    if (isLoading) return <PageContainer><Spinner /></PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>Erro: {error}</p></PageContainer>;
    if (!cliente) return <PageContainer><p>Cliente não encontrado.</p></PageContainer>;

    const tipoClienteLabel = cliente.tipoCliente === 'PESSOA_FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica';

    return (
        <PageContainer>
            <PageHeader>
                <TitleContainer>
                    <BackButton onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </BackButton>
                    <Title>Detalhes do Cliente</Title>
                </TitleContainer>
                <HeaderActions>
                    <Button as={Link} to={`/admin/clientes/editar/${id}`}>Editar</Button>
                    <Button variant="danger" onClick={() => setIsModalOpen(true)}>Excluir</Button>
                </HeaderActions>
            </PageHeader>

            <Card>
                <SectionTitle>{cliente.nomeCompleto}</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>CPF/CNPJ</DetailLabel>
                        <DetailValue>{cliente.cpfCnpj}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Tipo de Cliente</DetailLabel>
                        <DetailValue>{tipoClienteLabel}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            <Card>
                <SectionTitle>Contato</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Telefone Principal</DetailLabel>
                        <DetailValue>{cliente.telefonePrincipal}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Telefone Adicional</DetailLabel>
                        <DetailValue>{cliente.telefoneAdicional || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Email</DetailLabel>
                        <DetailValue>{cliente.email}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            <Card>
                <SectionTitle>Endereço</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Rua</DetailLabel>
                        <DetailValue>{cliente.rua}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Número</DetailLabel>
                        <DetailValue>{cliente.numero}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Complemento</DetailLabel>
                        <DetailValue>{cliente.complemento || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Bairro</DetailLabel>
                        <DetailValue>{cliente.bairro}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Cidade</DetailLabel>
                        <DetailValue>{cliente.cidade}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Estado</DetailLabel>
                        <DetailValue>{cliente.estado}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>CEP</DetailLabel>
                        <DetailValue>{cliente.cep}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
            >
                <p>Tem certeza que deseja excluir o cliente <strong>{cliente?.nomeCompleto}</strong>?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </Modal>
        </PageContainer>
    );
}

export default ClienteDetailPage; 