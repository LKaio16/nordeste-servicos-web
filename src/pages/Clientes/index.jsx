import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import * as clienteService from '../../services/clienteService';
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


const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [clienteToDelete, setClienteToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchClientes = useCallback(async () => {
        try {
            const data = await clienteService.getAllClientes();
            setClientes(data);
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
            setError('Não foi possível carregar a lista de clientes.');
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchClientes();
            setIsLoading(false);
        }
        loadData();
    }, [fetchClientes]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchClientes();
        setIsRefreshing(false);
    };

    const handleRowClick = (id) => {
        navigate(`/admin/clientes/detalhes/${id}`);
    };

    const handleDeleteClick = (cliente) => {
        setClienteToDelete(cliente);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (clienteToDelete) {
            try {
                await clienteService.deleteCliente(clienteToDelete.id);
                setClientes(prev => prev.filter(c => c.id !== clienteToDelete.id));
            } catch (err) {
                console.error('Erro ao deletar cliente:', err);
                setError('Falha ao excluir o cliente.');
            } finally {
                setIsModalOpen(false);
                setClienteToDelete(null);
            }
        }
    };

    const renderContent = () => {
        if (isLoading) return (
            <Tr>
                <Td colSpan="4"><Spinner /></Td>
            </Tr>
        );
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        if (!clientes || clientes.length === 0) {
            return (
                <Tr>
                    <Td colSpan="4" style={{ textAlign: 'center' }}>Nenhum cliente encontrado.</Td>
                </Tr>
            );
        }
        return clientes.map((cliente) => (
            <Tr key={cliente.id} onClick={() => handleRowClick(cliente.id)} data-clickable="true">
                <Td>
                    {cliente.nomeCompleto}
                </Td>
                <TdMobileHidden>{cliente.email}</TdMobileHidden>
                <Td>{cliente.telefonePrincipal}</Td>
                <Td>
                    <ButtonGroup onClick={(e) => e.stopPropagation()}>
                        <ActionLink to={`/admin/clientes/editar/${cliente.id}`} title="Editar Cliente"><FiEdit /></ActionLink>
                        <ActionButton onClick={() => handleDeleteClick(cliente)} title="Excluir Cliente"><FiTrash2 /></ActionButton>
                    </ButtonGroup>
                </Td>
            </Tr>
        ));
    };

    return (
        <>
            <PageHeader>
                <Title>Gestão de Clientes</Title>
                <HeaderActions>
                    <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
                        <FiRefreshCw />
                        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                    </RefreshButton>
                    <CreateButton to="/admin/clientes/novo">Novo Cliente</CreateButton>
                </HeaderActions>
            </PageHeader>
            <TableWrapper>
                <Table>
                    <thead>
                        <tr>
                            <Th>Nome Completo</Th>
                            <ThMobileHidden>Email</ThMobileHidden>
                            <Th>Telefone</Th>
                            <Th>Ações</Th>
                        </tr>
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
                <p>Deseja realmente excluir o cliente <strong>"{clienteToDelete?.nomeCompleto}"</strong>?</p>
            </Modal>
        </>
    );
};

export default Clientes; 