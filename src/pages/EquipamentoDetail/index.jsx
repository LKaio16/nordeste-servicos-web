import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as equipamentoService from '../../services/equipamentoService';
import * as clienteService from '../../services/clienteService';
import Modal from '../../components/Modal';
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

function EquipamentoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipamento, setEquipamento] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchEquipamentoDetails = async () => {
            try {
                const equipamentoData = await equipamentoService.getEquipamentoById(id);
                setEquipamento(equipamentoData);

                if (equipamentoData.clienteId) {
                    const clienteData = await clienteService.getClienteById(equipamentoData.clienteId);
                    setCliente(clienteData);
                }
            } catch (err) {
                setError('Falha ao carregar os detalhes do equipamento.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEquipamentoDetails();
        }
    }, [id]);

    const handleDelete = async () => {
        try {
            await equipamentoService.deleteEquipamento(id);
            navigate('/admin/equipamentos');
        } catch (err) {
            console.error('Erro ao deletar equipamento:', err);
            alert('Falha ao deletar equipamento.');
        } finally {
            setIsModalOpen(false);
        }
    };

    if (isLoading) return <PageContainer><p>Carregando dados do equipamento...</p></PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>Erro: {error}</p></PageContainer>;
    if (!equipamento) return <PageContainer><p>Equipamento não encontrado.</p></PageContainer>;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Detalhes do Equipamento</Title>
                <HeaderActions>
                    <Button as={Link} to={`/admin/equipamentos/editar/${id}`}>Editar</Button>
                    <Button variant="danger" onClick={() => setIsModalOpen(true)}>Excluir</Button>
                </HeaderActions>
            </PageHeader>

            <Card>
                <SectionTitle>{equipamento.marcaModelo}</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Tipo</DetailLabel>
                        <DetailValue>{equipamento.tipo}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Número de Série/Chassi</DetailLabel>
                        <DetailValue>{equipamento.numeroSerieChassi}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            <Card>
                <SectionTitle>Cliente</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Nome</DetailLabel>
                        <DetailValue>
                            {cliente ? (
                                <Link to={`/admin/clientes/detalhes/${cliente.id}`}>{cliente.nomeCompleto}</Link>
                            ) : (
                                'Nenhum cliente vinculado'
                            )}
                        </DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            <Card>
                <SectionTitle>Outras Informações</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Observações</DetailLabel>
                        <DetailValue>{equipamento.observacoes || 'N/A'}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
            >
                <p>Tem certeza que deseja excluir o equipamento <strong>{equipamento?.marcaModelo}</strong>?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </Modal>
        </PageContainer>
    );
}

export default EquipamentoDetailPage; 