import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import tipoServicoService from '../../services/tipoServicoService';
import { Table, Th, Td, Tr, ActionLink, ActionButton, ButtonGroup, PageHeader, Title, CreateButton, RefreshButton, HeaderActions } from '../../styles/common';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';

const TableWrapper = styled.div`
    overflow-x: auto;
`;

function ServicosPage() {
    const [servicos, setServicos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [servicoToDelete, setServicoToDelete] = useState(null);

    const fetchServicos = useCallback(async () => {
        try {
            const data = await tipoServicoService.getAllTiposServico();
            setServicos(data);
        } catch (err) {
            setError("Falha ao carregar os tipos de serviço.");
            console.error(err);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchServicos();
            setIsLoading(false);
        }
        loadData();
    }, [fetchServicos]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchServicos();
        setIsRefreshing(false);
    };

    const handleDeleteClick = (servico) => {
        setServicoToDelete(servico);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!servicoToDelete) return;
        try {
            await tipoServicoService.deleteTipoServico(servicoToDelete.id);
            setServicos(prev => prev.filter(s => s.id !== servicoToDelete.id));
        } catch (err) {
            setError('Erro ao excluir o tipo de serviço.');
            console.error(err);
        } finally {
            setIsModalOpen(false);
            setServicoToDelete(null);
        }
    };

    const renderContent = () => {
        if (isLoading) return (
            <Tr>
                <Td colSpan="3"><Spinner /></Td>
            </Tr>
        );
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        if (!servicos || servicos.length === 0) {
            return (
                <Tr><Td colSpan="2" style={{ textAlign: 'center' }}>Nenhum tipo de serviço encontrado.</Td></Tr>
            );
        }

        return servicos.map((servico) => (
            <Tr key={servico.id}>
                <Td>{servico.descricao}</Td>
                <Td>
                    <ButtonGroup>
                        <ActionLink to={`/admin/servicos/editar/${servico.id}`} title="Editar Tipo de Serviço"><FiEdit /></ActionLink>
                        <ActionButton onClick={() => handleDeleteClick(servico)} title="Excluir Tipo de Serviço"><FiTrash2 /></ActionButton>
                    </ButtonGroup>
                </Td>
            </Tr>
        ));
    };

    return (
        <>
            <PageHeader>
                <Title>Tipos de Serviço</Title>
                <HeaderActions>
                    <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
                        <FiRefreshCw />
                        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                    </RefreshButton>
                    <CreateButton to="/admin/servicos/novo">Novo Tipo de Serviço</CreateButton>
                </HeaderActions>
            </PageHeader>
            <TableWrapper>
                <Table>
                    <thead>
                        <Tr>
                            <Th>Descrição</Th>
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
                <p>Tem certeza que deseja excluir o serviço <strong>{servicoToDelete?.descricao}</strong>?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </Modal>
        </>
    );
}

export default ServicosPage; 