import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import * as usuarioService from '../../services/usuarioService';
import Modal from '../../components/Modal';
import { Table, Th, Td, Tr, ActionButton, ActionLink, PageHeader, Title, CreateButton, ButtonGroup, RefreshButton, HeaderActions } from '../../styles/common';
import Spinner from '../../components/Spinner';

const TableWrapper = styled.div`
    overflow-x: auto;
`;

const TdMobileHidden = styled(Td)`
    @media (max-width: 768px) {
        display: none;
    }
`;

const ThMobileHidden = styled(Th)`
    @media (max-width: 768px) {
        display: none;
    }
`;

function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState(null);
    const navigate = useNavigate();

    const fetchUsuarios = useCallback(async () => {
        try {
            const data = await usuarioService.getAllUsuarios();
            setUsuarios(data);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchUsuarios();
            setIsLoading(false);
        }
        loadData();
    }, [fetchUsuarios]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchUsuarios();
        setIsRefreshing(false);
    };

    const handleRowClick = (id) => {
        navigate(`/admin/usuarios/detalhes/${id}`);
    };

    const handleDeleteClick = (usuario) => {
        setUsuarioToDelete(usuario);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!usuarioToDelete) return;
        try {
            await usuarioService.deleteUsuario(usuarioToDelete.id);
            setUsuarios(prev => prev.filter(u => u.id !== usuarioToDelete.id));
        } catch (err) {
            setError(err.message || 'Erro ao excluir usuário.');
        } finally {
            setIsModalOpen(false);
            setUsuarioToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setUsuarioToDelete(null);
    };

    const renderContent = () => {
        if (isLoading) return (
            <Tr>
                <Td colSpan="5"><Spinner /></Td>
            </Tr>
        );
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        if (!usuarios || usuarios.length === 0) {
            return (
                <Tr><Td colSpan="4" style={{ textAlign: 'center' }}>Nenhum usuário encontrado.</Td></Tr>
            );
        }

        return usuarios.map((usuario) => (
            <Tr key={usuario.id} onClick={() => handleRowClick(usuario.id)} data-clickable="true">
                <Td>
                    {usuario.nome}
                </Td>
                <TdMobileHidden>{usuario.email}</TdMobileHidden>
                <Td>{usuario.perfil}</Td>
                <Td>
                    <ButtonGroup onClick={(e) => e.stopPropagation()}>
                        <ActionLink to={`/admin/usuarios/editar/${usuario.id}`} title="Editar Usuário"><FiEdit /></ActionLink>
                        <ActionButton onClick={() => handleDeleteClick(usuario)} title="Excluir Usuário"><FiTrash2 /></ActionButton>
                    </ButtonGroup>
                </Td>
            </Tr>
        ));
    };

    return (
        <>
            <PageHeader>
                <Title>Usuários</Title>
                <HeaderActions>
                    <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
                        <FiRefreshCw />
                        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                    </RefreshButton>
                    <CreateButton to="/admin/usuarios/novo">Novo Usuário</CreateButton>
                </HeaderActions>
            </PageHeader>
            <TableWrapper>
                <Table>
                    <thead>
                        <Tr>
                            <Th>Nome</Th>
                            <ThMobileHidden>Email</ThMobileHidden>
                            <Th>Perfil</Th>
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
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
            >
                <p>Tem certeza que deseja excluir o usuário <strong>{usuarioToDelete?.nome}</strong>?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </Modal>
        </>
    );
}

export default UsuariosPage; 