import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as osService from '../../services/osService';
import Modal from '../../components/Modal';
import ImageModal from '../../components/ImageModal';
import Spinner from '../../components/Spinner';
import {
    PageContainer,
    PageHeader,
    Title,
    Button,
    HeaderActions
} from '../../styles/common';
import { getStatusLabel, getPrioridadeLabel } from '../../utils/enumLabels';
import { FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';

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

const DetailValue = styled.p`
  font-size: 1rem;
  color: #1f2937;
  font-weight: 500;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const ImageContainer = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  }
`;

const SignatureContainer = styled.div`
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;

    img {
        max-width: 250px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.5rem;
    }
`;

function OrdemServicoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [os, setOs] = useState(null);
    const [fotos, setFotos] = useState([]);
    const [assinatura, setAssinatura] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await osService.getOrdemServicoById(id);
                setOs(data);
                const fotosData = await osService.getFotosByOsId(id);
                setFotos(fotosData);
                const assinaturaData = await osService.getAssinaturaByOsId(id);
                setAssinatura(assinaturaData);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await osService.deleteOrdemServico(id);
            navigate('/admin/os');
        } catch (err) {
            setError(err.message || 'Erro ao excluir a Ordem de Serviço.');
        } finally {
            setIsModalOpen(false);
        }
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString() : 'N/A';
    
    if (isLoading) return <PageContainer><Spinner /></PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>Erro: {error}</p></PageContainer>;
    if (!os) return <PageContainer><p>Ordem de Serviço não encontrada.</p></PageContainer>;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Detalhes da OS #{os.numeroOS}</Title>
                 <HeaderActions>
                    <Button onClick={() => osService.downloadOsPdf(id)}>
                        <FiDownload style={{ marginRight: '8px' }} />
                        Baixar PDF
                    </Button>
                    <Button as={Link} to={`/admin/os/editar/${id}`}>
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
                <SectionTitle>Status e Prazos</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Status</DetailLabel>
                        <DetailValue>{getStatusLabel(os.status)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Prioridade</DetailLabel>
                        <DetailValue>{getPrioridadeLabel(os.prioridade)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Data de Abertura</DetailLabel>
                        <DetailValue>{formatDate(os.dataAbertura)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Data de Agendamento</DetailLabel>
                        <DetailValue>{formatDate(os.dataAgendamento)}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Data de Fechamento</DetailLabel>
                        <DetailValue>{formatDate(os.dataFechamento)}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            <Card>
                <SectionTitle>Envolvidos</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Cliente</DetailLabel>
                        <DetailValue>{os.cliente?.nomeCompleto || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Equipamento</DetailLabel>
                        <DetailValue>{os.equipamento ? `${os.equipamento.marcaModelo} (S/N: ${os.equipamento.numeroSerieChassi})` : 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Técnico Responsável</DetailLabel>
                        <DetailValue>{os.tecnicoAtribuido?.nome || 'Não atribuído'}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            <Card>
                 <SectionTitle>Descrição do Serviço</SectionTitle>
                 <InfoGrid style={{gridTemplateColumns: '1fr'}}>
                    <DetailItem>
                        <DetailLabel>Problema Relatado</DetailLabel>
                        <DetailValue>{os.problemaRelatado || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Análise da Falha</DetailLabel>
                        <DetailValue>{os.analiseFalha || 'N/A'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Solução Aplicada</DetailLabel>
                        <DetailValue>{os.solucaoAplicada || 'N/A'}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>

            {fotos && fotos.length > 0 && (
                <Card>
                    <SectionTitle>Fotos</SectionTitle>
                    <ImageGallery>
                        {fotos.map((foto) => (
                            <ImageContainer key={foto.id} onClick={() => openImageModal(`data:image/jpeg;base64,${foto.fotoBase64}`)}>
                                <img src={`data:image/jpeg;base64,${foto.fotoBase64}`} alt={foto.descricao || 'Foto da OS'} />
                            </ImageContainer>
                        ))}
                    </ImageGallery>
                </Card>
            )}

            {assinatura && (
                <Card>
                    <SectionTitle>Assinaturas</SectionTitle>
                    <SignatureContainer>
                        {assinatura.assinaturaClienteBase64 && (
                            <div>
                                <DetailLabel>Cliente: {assinatura.nomeClienteResponsavel || 'N/A'}</DetailLabel>
                                <img src={`data:image/png;base64,${assinatura.assinaturaClienteBase64}`} alt="Assinatura do Cliente" />
                            </div>
                        )}
                        {assinatura.assinaturaTecnicoBase64 && (
                            <div>
                                <DetailLabel>Técnico: {os.nomeTecnicoResponsavel || 'N/A'}</DetailLabel>
                                <img src={`data:image/png;base64,${assinatura.assinaturaTecnicoBase64}`} alt="Assinatura do Técnico" />
                            </div>
                        )}
                    </SignatureContainer>
                </Card>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
            >
                <p>Tem certeza de que deseja excluir a Ordem de Serviço nº <strong>{os?.numeroOS}</strong>?</p>
                <p>Esta ação não poderá ser desfeita.</p>
            </Modal>
            
            <ImageModal 
                isOpen={isImageModalOpen}
                onClose={closeImageModal}
                src={selectedImage}
                alt="Visualização ampliada da foto da OS"
            />
        </PageContainer>
    );
}

export default OrdemServicoDetailPage; 