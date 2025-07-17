import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import orcamentoService from '../../services/orcamentoService';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import { PageContainer, PageHeader, Title, Button, HeaderActions, Table, Th, Td, Tr } from '../../styles/common';
import { FiDownload, FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';

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
    align-items: center;
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
    grid-template-columns: repeat(3, 1fr);
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

const TableWrapper = styled.div`
    overflow-x: auto;
`;

function OrcamentoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orcamento, setOrcamento] = useState(null);
    const [itens, setItens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const [orcamentoData, itensData] = await Promise.all([
                    orcamentoService.getOrcamentoById(id),
                    orcamentoService.getItensByOrcamentoId(id)
                ]);
                setOrcamento(orcamentoData);
                setItens(itensData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleConfirmDelete = async () => {
        try {
            await orcamentoService.deleteOrcamento(id);
            navigate('/admin/orcamentos');
        } catch (err) {
            setError(err.message || 'Falha ao excluir o orçamento.');
        } finally {
            setIsModalOpen(false);
        }
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
    
    if (isLoading) return <PageContainer><Spinner /></PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>Erro: {error}</p></PageContainer>;
    if (!orcamento) return <PageContainer><p>Orçamento não encontrado.</p></PageContainer>;

    return (
        <PageContainer>
            <PageHeader>
                <TitleContainer>
                    <BackButton onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </BackButton>
                    <Title>Detalhes do Orçamento #{orcamento.numeroOrcamento}</Title>
                </TitleContainer>
                <HeaderActions>
                    <Button onClick={() => orcamentoService.downloadOrcamentoPdf(id)}>
                        <FiDownload style={{ marginRight: '8px' }} />
                        Baixar PDF
                    </Button>
                    <Button as={Link} to={`/admin/orcamentos/editar/${id}`}>
                        <FiEdit style={{ marginRight: '8px' }} />
                        Editar
                    </Button>
                    <Button variant="danger" onClick={() => setIsModalOpen(true)}>
                        <FiTrash2 style={{ marginRight: '8px' }} />
                        Excluir
                    </Button>
                </HeaderActions>
            </PageHeader>

            <Card>
                <SectionTitle>Informações Gerais</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Cliente</DetailLabel>
                        <DetailValue>{orcamento.nomeCliente || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Status</DetailLabel>
                        <DetailValue>{orcamento.status}</DetailValue>
                    </DetailItem>
                     <DetailItem>
                        <DetailLabel>Valor Total</DetailLabel>
                        <DetailValue>{`R$ ${orcamento.valorTotal.toFixed(2)}`}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Data de Emissão</DetailLabel>
                        <DetailValue>{formatDate(orcamento.dataEmissao)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Data de Validade</DetailLabel>
                        <DetailValue>{formatDate(orcamento.dataValidade)}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            <Card>
                <SectionTitle>Itens do Orçamento</SectionTitle>
                <TableWrapper>
                    <Table>
                        <thead>
                            <Tr>
                                <Th>Descrição</Th>
                                <Th>Quantidade</Th>
                                <Th>Preço Unitário</Th>
                                <Th>Subtotal</Th>
                            </Tr>
                        </thead>
                        <tbody>
                            {itens.length > 0 ? itens.map(item => (
                                <Tr key={item.id}>
                                    <Td>{item.descricao}</Td>
                                    <Td>{item.quantidade}</Td>
                                    <Td>{`R$ ${(item.valorUnitario || 0).toFixed(2)}`}</Td>
                                    <Td>{`R$ ${(item.subtotal || 0).toFixed(2)}`}</Td>
                                </Tr>
                            )) : (
                                <Tr>
                                    <Td colSpan="4" style={{ textAlign: 'center' }}>Nenhum item encontrado para este orçamento.</Td>
                                </Tr>
                            )}
                        </tbody>
                    </Table>
                </TableWrapper>
            </Card>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
            >
                <p>Tem certeza de que deseja excluir o orçamento nº <strong>{orcamento?.numeroOrcamento}</strong>?</p>
                <p>Esta ação não poderá ser desfeita.</p>
            </Modal>
        </PageContainer>
    );
}

export default OrcamentoDetailPage; 