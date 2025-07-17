import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import * as equipamentoService from '../../services/equipamentoService';
import * as clienteService from '../../services/clienteService';
import { Table, Th, Td, Tr, ActionLink, ActionButton, ButtonGroup, PageHeader, Title, CreateButton, RefreshButton, HeaderActions } from '../../styles/common';
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

function EquipamentosPage() {
    const [equipamentos, setEquipamentos] = useState([]);
    const [clientesMap, setClientesMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [equipamentoToDelete, setEquipamentoToDelete] = useState(null);
    const [alert, setAlert] = useState({ isOpen: false, message: '' });
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const [equipamentosData, clientesData] = await Promise.all([
                equipamentoService.getAllEquipamentos(),
                clienteService.getAllClientes()
            ]);

            setEquipamentos(equipamentosData);

            const mapa = clientesData.reduce((acc, cliente) => {
                acc[cliente.id] = cliente.nomeCompleto;
                return acc;
            }, {});
            setClientesMap(mapa);

        } catch (err) {
            setError('Falha ao carregar os dados. Tente novamente.');
            console.error(err);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchData();
            setIsLoading(false);
        }
        loadData();
    }, [fetchData]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();
        setIsRefreshing(false);
    };

    const handleRowClick = (id) => {
        navigate(`/admin/equipamentos/detalhes/${id}`);
    };

    const handleDeleteClick = (equipamento) => {
        setEquipamentoToDelete(equipamento);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!equipamentoToDelete) return;
        try {
            await equipamentoService.deleteEquipamento(equipamentoToDelete.id);
            setEquipamentos(prev => prev.filter(e => e.id !== equipamentoToDelete.id));
        } catch (err) {
            console.error('Erro ao excluir equipamento:', err);
            const errorMessage = err.response?.data?.message || 'Falha ao excluir o equipamento. Verifique se ele não está associado a ordens de serviço.';
            setAlert({ isOpen: true, message: errorMessage });
        } finally {
            setIsModalOpen(false);
            setEquipamentoToDelete(null);
        }
    };

    const renderContent = () => {
        if (isLoading) return (
            <Tr>
                <Td colSpan="5"><Spinner /></Td>
            </Tr>
        );
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        if (!equipamentos || equipamentos.length === 0) {
            return (
                <Tr><Td colSpan="5" style={{ textAlign: 'center' }}>Nenhum equipamento encontrado.</Td></Tr>
            );
        }

        return equipamentos.map((equipamento) => (
            <Tr key={equipamento.id} onClick={() => handleRowClick(equipamento.id)} data-clickable="true">
                <Td>
                    {equipamento.tipo}
                </Td>
                <Td>{equipamento.marcaModelo}</Td>
                <TdMobileHidden>{equipamento.numeroSerieChassi}</TdMobileHidden>
                <TdMobileHidden>{clientesMap[equipamento.clienteId] || 'N/A'}</TdMobileHidden>
                <Td>
                    <ButtonGroup onClick={(e) => e.stopPropagation()}>
                        <ActionLink to={`/admin/equipamentos/editar/${equipamento.id}`} title="Editar Equipamento"><FiEdit /></ActionLink>
                        <ActionButton onClick={() => handleDeleteClick(equipamento)} title="Excluir Equipamento"><FiTrash2 /></ActionButton>
                    </ButtonGroup>
                </Td>
            </Tr>
        ));
    };

    return (
        <>
            <PageHeader>
                <Title>Equipamentos</Title>
                <HeaderActions>
                    <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
                        <FiRefreshCw />
                        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                    </RefreshButton>
                    <CreateButton to="/admin/equipamentos/novo">Novo Equipamento</CreateButton>
                </HeaderActions>
            </PageHeader>
            <TableWrapper>
                <Table>
                    <thead>
                        <Tr>
                            <Th>Tipo</Th>
                            <Th>Marca/Modelo</Th>
                            <ThMobileHidden>Nº Série/Chassi</ThMobileHidden>
                            <ThMobileHidden>Cliente</ThMobileHidden>
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
                <p>Tem certeza que deseja excluir o equipamento <strong>{equipamentoToDelete?.marcaModelo}</strong>?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </Modal>
            <AlertModal
                isOpen={alert.isOpen}
                onClose={() => setAlert({ isOpen: false, message: '' })}
                title="Erro ao Excluir"
                message={alert.message}
            />
        </>
    );
}

export default EquipamentosPage; 