import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import * as pecaService from '../../services/pecaService';
import { Table, Th, Td, Tr, ButtonGroup, ActionLink, ActionButton, PageHeader, Title, CreateButton, RefreshButton, HeaderActions } from '../../styles/common';
import Modal from '../../components/Modal';
import AlertModal from '../../components/AlertModal';
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

function PecasPage() {
    const [pecas, setPecas] = useState([]);
    const [pecaToDelete, setPecaToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ isOpen: false, message: '' });

    const fetchPecas = useCallback(async () => {
        try {
            const data = await pecaService.getAllPecas();
            setPecas(data);
        } catch (err) {
            console.error('Erro ao buscar peças:', err);
            setError("Não foi possível carregar as peças.");
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchPecas();
            setIsLoading(false);
        }
        loadData();
    }, [fetchPecas]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchPecas();
        setIsRefreshing(false);
    };

    const handleDeleteClick = (peca) => {
        setPecaToDelete(peca);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (pecaToDelete) {
            try {
                await pecaService.deletePeca(pecaToDelete.id);
                setPecas(prev => prev.filter(p => p.id !== pecaToDelete.id));
            } catch (err) {
                console.error('Erro ao deletar peça:', err);
                const errorMessage = err.response?.data?.message || 'Falha ao excluir a peça. Verifique se ela não está associada a orçamentos ou ordens de serviço.';
                setAlert({ isOpen: true, message: errorMessage });
            } finally {
                setIsModalOpen(false);
                setPecaToDelete(null);
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    };

    const renderContent = () => {
        if (isLoading) return (
            <Tr>
                <Td colSpan="5"><Spinner /></Td>
            </Tr>
        );
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        if (!pecas || pecas.length === 0) {
            return (
                <Tr><Td colSpan="7" style={{ textAlign: 'center' }}>Nenhuma peça encontrada.</Td></Tr>
            );
        }

        return pecas.map((peca) => (
            <Tr key={peca.id}>
                <Td>{peca.descricao}</Td>
                <TdMobileHidden>{peca.fabricante}</TdMobileHidden>
                <TdMobileHidden>{peca.modelo}</TdMobileHidden>
                <TdMobileHidden>{peca.codigo}</TdMobileHidden>
                <Td>{formatPrice(peca.preco)}</Td>
                <Td>{peca.estoque}</Td>
                <Td>
                    <ButtonGroup>
                        <ActionLink to={`/admin/pecas/editar/${peca.id}`} title="Editar Peça"><FiEdit /></ActionLink>
                        <ActionButton onClick={() => handleDeleteClick(peca)} title="Excluir Peça"><FiTrash2 /></ActionButton>
                    </ButtonGroup>
                </Td>
            </Tr>
        ));
    };

    return (
        <>
            <PageHeader>
                <Title>Gestão de Peças</Title>
                <HeaderActions>
                    <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
                        <FiRefreshCw />
                        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                    </RefreshButton>
                    <CreateButton to="/admin/pecas/novo">Adicionar Peça</CreateButton>
                </HeaderActions>
            </PageHeader>

            <TableWrapper>
                <Table>
                    <thead>
                        <Tr>
                            <Th>Descrição</Th>
                            <ThMobileHidden>Fabricante</ThMobileHidden>
                            <ThMobileHidden>Modelo</ThMobileHidden>
                            <ThMobileHidden>Código</ThMobileHidden>
                            <Th>Preço</Th>
                            <Th>Estoque</Th>
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
                <p>Deseja realmente excluir a peça <strong>"{pecaToDelete?.descricao}"</strong>?</p>
            </Modal>
            <AlertModal
                isOpen={alert.isOpen}
                onClose={() => setAlert({ isOpen: false, message: '' })}
                title="Erro ao Excluir"
                message={alert.message}
            />
        </>
    );
};

export default PecasPage; 