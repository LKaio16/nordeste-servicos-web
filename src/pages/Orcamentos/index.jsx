import { useState, useEffect, useCallback } from 'react';
import orcamentoService from '../../services/orcamentoService';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiDownload, FiRefreshCw } from 'react-icons/fi';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import { Table, Th, Td, Tr, ActionButton, ActionLink, PageHeader, Title, CreateButton, ButtonGroup, RefreshButton, HeaderActions } from '../../styles/common';
import styled from 'styled-components';

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

function OrcamentosPage() {
    const [orcamentos, setOrcamentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orcamentoToDelete, setOrcamentoToDelete] = useState(null);
    const navigate = useNavigate();

    const fetchOrcamentos = useCallback(async () => {
        try {
            const data = await orcamentoService.getAllOrcamentos();
            setOrcamentos(data);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchOrcamentos();
            setIsLoading(false);
        }
        loadData();
    }, [fetchOrcamentos]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchOrcamentos();
        setIsRefreshing(false);
    };

    const handleRowClick = (id) => {
        navigate(`/admin/orcamentos/detalhes/${id}`);
    };

    const openDeleteModal = (orcamento) => {
        setOrcamentoToDelete(orcamento);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setOrcamentoToDelete(null);
        setIsModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!orcamentoToDelete) return;
        try {
            await orcamentoService.deleteOrcamento(orcamentoToDelete.id);
            // Atualiza a lista removendo o item deletado
            setOrcamentos(prev => prev.filter(o => o.id !== orcamentoToDelete.id));
            closeDeleteModal();
        } catch (deleteError) {
            setError(deleteError.message);
            closeDeleteModal();
        }
    };


    const renderContent = () => {
        if (isLoading) return (
            <Tr>
                <Td colSpan="6"><Spinner /></Td>
            </Tr>
        );
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        if (!orcamentos || orcamentos.length === 0) {
            return (
                <Tr><Td colSpan="5" style={{ textAlign: 'center' }}>Nenhum Orçamento encontrado.</Td></Tr>
            );
        }

        return orcamentos.map((orcamento) => (
            <Tr key={orcamento.id} onClick={() => handleRowClick(orcamento.id)} data-clickable="true">
                <Td>
                    {orcamento.numeroOrcamento}
                </Td>
                <TdMobileHidden>{orcamento.nomeCliente}</TdMobileHidden>
                <Td>{orcamento.status}</Td>
                <TdMobileHidden>{`R$ ${orcamento.valorTotal.toFixed(2)}`}</TdMobileHidden>
                <Td>
                    <ButtonGroup onClick={(e) => e.stopPropagation()}>
                        <ActionLink to={`/admin/orcamentos/editar/${orcamento.id}`} title="Editar Orçamento"><FiEdit /></ActionLink>
                        <ActionButton onClick={() => openDeleteModal(orcamento)} title="Excluir Orçamento"><FiTrash2 /></ActionButton>
                        <ActionButton onClick={() => orcamentoService.downloadOrcamentoPdf(orcamento.id)} title="Baixar PDF"><FiDownload /></ActionButton>
                    </ButtonGroup>
                </Td>
            </Tr>
        ));
    };

    return (
        <>
            <PageHeader>
                <Title>Orçamentos</Title>
                <HeaderActions>
                    <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
                        <FiRefreshCw />
                        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                    </RefreshButton>
                    <CreateButton to="/admin/orcamentos/novo">Novo Orçamento</CreateButton>
                </HeaderActions>
            </PageHeader>
            <TableWrapper>
                <Table>
                    <thead>
                        <Tr>
                            <Th>Número</Th>
                            <ThMobileHidden>Cliente</ThMobileHidden>
                            <ThMobileHidden>Status</ThMobileHidden>
                            <Th>Valor Total</Th>
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
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
            >
                <p>Tem certeza de que deseja excluir o orçamento nº <strong>{orcamentoToDelete?.numeroOrcamento}</strong>?</p>
                <p>Esta ação não poderá ser desfeita.</p>
            </Modal>
        </>
    );
}

export default OrcamentosPage; 