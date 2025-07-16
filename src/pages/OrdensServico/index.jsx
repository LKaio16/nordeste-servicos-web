import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiRefreshCw, FiDownload } from 'react-icons/fi';
import * as osService from '../../services/osService';
import { Table, Th, Td, Tr, ButtonGroup, ActionButton, ActionLink, PageHeader, Title, CreateButton, RefreshButton, HeaderActions } from '../../styles/common';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const TableWrapper = styled.div`
    overflow-x: auto;
`;

const ThMobileHidden = styled(Th)`
    @media (max-width: 768px) {
        display: none;
    }
`;

const TdMobileHidden = styled(Td)`
    @media (max-width: 768px) {
        display: none;
    }
`;


const OrdensServicoPage = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [osToDelete, setOsToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchOrdensServico = useCallback(async () => {
        try {
            const data = await osService.getAllOrdensServico();
            setOrdensServico(data);
        } catch (err) {
            setError("Falha ao carregar as Ordens de Serviço.");
            console.error("Erro ao buscar ordens de serviço:", err);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchOrdensServico();
            setIsLoading(false);
        }
        loadData();
    }, [fetchOrdensServico]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchOrdensServico();
        setIsRefreshing(false);
    };

    const handleRowClick = (id) => {
        navigate(`/admin/os/detalhes/${id}`);
    };

    const handleDeleteClick = (os) => {
        setOsToDelete(os);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (osToDelete) {
            try {
                await osService.deleteOrdemServico(osToDelete.id);
                setOrdensServico(prev => prev.filter(o => o.id !== osToDelete.id));
            } catch (err) {
                console.error('Erro ao deletar ordem de serviço:', err);
                setError("Falha ao excluir a Ordem de Serviço.");
            } finally {
                setIsModalOpen(false);
                setOsToDelete(null);
            }
        }
    };

    const renderContent = () => {
        if (isLoading) return (
            <Tr>
                <Td colSpan="7"><Spinner /></Td>
            </Tr>
        );
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        if (!ordensServico || ordensServico.length === 0) {
            return (
                <Tr><Td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma ordem de serviço encontrada.</Td></Tr>
            );
        }

        return ordensServico.map((os) => (
            <Tr key={os.id} onClick={() => handleRowClick(os.id)} data-clickable="true">
                <Td>
                    {os.id}
                </Td>
                <Td>{os.cliente?.nomeCompleto || 'N/A'}</Td>
                <TdMobileHidden>{new Date(os.dataAbertura).toLocaleDateString()}</TdMobileHidden>
                <Td>{os.status}</Td>
                <TdMobileHidden>{os.tecnicoAtribuido?.nome || 'N/A'}</TdMobileHidden>
                <Td>
                    <ButtonGroup onClick={(e) => e.stopPropagation()}>
                        <ActionLink to={`/admin/os/editar/${os.id}`} title="Editar OS"><FiEdit /></ActionLink>
                        <ActionButton onClick={() => handleDeleteClick(os)} title="Excluir OS"><FiTrash2 /></ActionButton>
                        <ActionButton onClick={() => osService.downloadOsPdf(os.id)} title="Baixar PDF"><FiDownload /></ActionButton>
                    </ButtonGroup>
                </Td>
            </Tr>
        ));
    };

    return (
        <>
            <PageHeader>
                <Title>Ordens de Serviço</Title>
                <HeaderActions>
                    <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
                        <FiRefreshCw />
                        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                    </RefreshButton>
                    <CreateButton to="/admin/os/novo">Nova Ordem de Serviço</CreateButton>
                </HeaderActions>
            </PageHeader>
            <TableWrapper>
                <Table>
                    <thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Cliente</Th>
                            <ThMobileHidden>Data de Abertura</ThMobileHidden>
                            <Th>Status</Th>
                            <ThMobileHidden>Técnico</ThMobileHidden>
                            <Th>Ações</Th>
                        </Tr>
                    </thead>
                    <tbody>
                        {renderContent()}
                    </tbody>
                </Table>
            </TableWrapper>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
            >
                <p>Deseja realmente excluir a Ordem de Serviço <strong>#{osToDelete?.id}</strong>?</p>
            </Modal>
        </>
    );
};

export default OrdensServicoPage; 