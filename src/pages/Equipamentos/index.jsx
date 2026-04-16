import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import {
    FiPlus,
    FiRefreshCw,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiTool,
    FiUser,
    FiChevronLeft,
    FiChevronRight,
    FiAlertCircle,
} from 'react-icons/fi';
import * as equipamentoService from '../../services/equipamentoService';
import * as clienteService from '../../services/clienteService';
import { message } from 'antd';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const RefreshCwIcon = styled(FiRefreshCw)`
    ${(p) =>
        p.$spinning &&
        css`
            animation: ${spin} 0.8s linear infinite;
        `}
`;

const Page = styled.div`
    padding-bottom: 32px;
    animation: ${fadeIn} 0.3s ease both;
`;

const Hero = styled.div`
    background: linear-gradient(145deg, #0c2d6b 0%, #1a4494 40%, #1e5bb5 70%, #2b6fc2 100%);
    margin: -24px -32px 0;
    padding: 36px 36px 80px;
    position: relative;
    overflow: hidden;
    animation: ${slideDown} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;

    &::before {
        content: '';
        position: absolute;
        top: -80px;
        right: -40px;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.04);
    }

    @media (max-width: 768px) {
        margin: -16px -16px 0;
        padding: 24px 20px 70px;
    }
`;

const HeroInner = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
`;

const HeroLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.3px;
    }
`;

const HeroIcon = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 22px;
`;

const HeroCount = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 12px;
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
`;

const HeroActions = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
`;

const Btn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    white-space: nowrap;

    &:disabled { opacity: 0.5; cursor: not-allowed; }

    svg { width: 16px; height: 16px; }
`;

const PrimaryBtn = styled(Btn)`
    background: #fff;
    color: #1a4494;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover:not(:disabled) {
        background: #f0f7ff;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
    }
`;

const GhostBtn = styled(Btn)`
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
    }
`;

const Content = styled.div`
    margin-top: -48px;
    position: relative;
    z-index: 2;
`;

const TableWrapper = styled.div`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(12, 45, 107, 0.06);
    border: 1px solid rgba(26, 68, 148, 0.06);
    overflow: hidden;
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
`;

const THead = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 160px;
    padding: 0 24px;
    background: #f8faff;
    border-bottom: 2px solid #eef2f9;

    @media (max-width: 768px) {
        display: none;
    }
`;

const TH = styled.div`
    padding: 14px 0;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #6b86b8;
`;

const TBody = styled.div``;

const TRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 160px;
    padding: 0 24px;
    align-items: center;
    border-bottom: 1px solid #f5f8fd;
    cursor: pointer;
    transition: background 0.15s;

    &:last-child { border-bottom: none; }

    &:hover {
        background: #f8faff;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        padding: 16px 20px;
        gap: 12px;
    }
`;

const TD = styled.div`
    padding: 16px 0;

    @media (max-width: 768px) {
        padding: 0;
    }
`;

const EquipCell = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
`;

const EquipAvatar = styled.div`
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1a4494, #2b6fc2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-size: 16px;
`;

const EquipDetails = styled.div``;

const EquipType = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #0c2d6b;
    margin-bottom: 2px;
`;

const EquipModel = styled.div`
    font-size: 13px;
    color: #6b86b8;
    margin-bottom: 1px;
`;

const EquipSerial = styled.div`
    font-size: 12px;
    color: #a8b8d0;
    font-family: monospace;
`;

const ClientCell = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #334155;

    svg { color: #1a4494; width: 15px; height: 15px; }
`;

const ActionsCell = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-end;

    @media (max-width: 768px) {
        justify-content: flex-start;
    }
`;

const ActionBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid #eef2f9;
    background: #fff;
    border-radius: 10px;
    cursor: pointer;
    color: ${p => p.$color || '#6b86b8'};
    transition: all 0.15s;
    position: relative;

    &:hover {
        background: ${p => p.$hoverBg || '#f0f4fa'};
        border-color: ${p => p.$hoverBorder || '#d6e0f0'};
        color: ${p => p.$hoverColor || '#1a4494'};
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
    }

    svg { width: 15px; height: 15px; }
`;

const DeleteBtn = styled(ActionBtn)`
    &:hover {
        background: #fef2f2;
        border-color: #fecaca;
        color: #dc2626;
    }
`;

const Pagination = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-top: 1px solid #f5f8fd;
    flex-wrap: wrap;
    gap: 12px;
`;

const PagInfo = styled.span`
    font-size: 13px;
    color: #6b86b8;
    font-weight: 500;
`;

const PagControls = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const PagBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    height: 34px;
    padding: 0 8px;
    border: 1px solid ${p => p.$active ? '#1a4494' : '#eef2f9'};
    background: ${p => p.$active ? '#1a4494' : '#fff'};
    color: ${p => p.$active ? '#fff' : '#6b86b8'};
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;

    &:hover:not(:disabled) {
        border-color: #1a4494;
        color: ${p => p.$active ? '#fff' : '#1a4494'};
        background: ${p => p.$active ? '#0c2d6b' : '#f0f4fa'};
    }

    &:disabled { opacity: 0.3; cursor: not-allowed; }

    svg { width: 16px; height: 16px; }
`;

const PerPageSelect = styled.select`
    height: 34px;
    padding: 0 8px;
    border: 1px solid #eef2f9;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #6b86b8;
    background: #fff;
    cursor: pointer;
    font-family: inherit;
    outline: none;
    margin-left: 8px;

    &:focus { border-color: #1a4494; }
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 24px;
    color: #6b86b8;
    gap: 12px;

    svg { width: 48px; height: 48px; opacity: 0.4; }

    p { font-size: 15px; font-weight: 500; margin: 0; }
`;

const LoadingOverlay = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;

    svg {
        width: 28px;
        height: 28px;
        color: #1a4494;
        animation: ${spin} 0.8s linear infinite;
    }
`;

const ConfirmOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(10, 30, 61, 0.5);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${fadeIn} 0.15s ease;
`;

const ConfirmBox = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    text-align: center;

    h3 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 700;
        color: #0c2d6b;
    }

    p {
        margin: 0 0 24px;
        font-size: 14px;
        color: #6b86b8;
        line-height: 1.5;
    }
`;

const ConfirmActions = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
`;

const ConfirmBtn = styled(Btn)`
    padding: 10px 24px;
    font-size: 14px;
`;

const CancelConfirmBtn = styled(ConfirmBtn)`
    background: #f4f7fb;
    color: #6b86b8;
    &:hover { background: #eef2f9; color: #0c2d6b; }
`;

const DeleteConfirmBtn = styled(ConfirmBtn)`
    background: #dc2626;
    color: #fff;
    &:hover:not(:disabled) { background: #b91c1c; }
`;

const MobileLabel = styled.span`
    display: none;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #a8b8d0;
    margin-bottom: 4px;

    @media (max-width: 768px) {
        display: block;
    }
`;

const EquipamentosPage = () => {
    const navigate = useNavigate();
    const [equipamentos, setEquipamentos] = useState([]);
    const [clientesMap, setClientesMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [equipamentosData, clientesData] = await Promise.all([
                equipamentoService.getAllEquipamentos(),
                clienteService.getAllClientes(),
            ]);

            setEquipamentos(equipamentosData);

            const mapa = clientesData.reduce((acc, cliente) => {
                acc[cliente.id] = cliente.nomeCompleto;
                return acc;
            }, {});
            setClientesMap(mapa);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            message.error('Falha ao carregar os dados. Tente novamente.');
        }
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await fetchData();
            setIsLoading(false);
        })();
    }, [fetchData]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();
        setIsRefreshing(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await equipamentoService.deleteEquipamento(deleteTarget.id);
            setEquipamentos(prev => prev.filter(e => e.id !== deleteTarget.id));
            message.success('Equipamento excluído com sucesso!');
        } catch (err) {
            console.error('Erro ao excluir equipamento:', err);
            const errorMessage = err.response?.data?.message || 'Falha ao excluir o equipamento. Verifique se ele não está associado a ordens de serviço.';
            message.error(errorMessage);
        }
        setDeleteTarget(null);
    };

    const totalPages = Math.ceil(equipamentos.length / perPage);
    const paginatedEquipamentos = useMemo(() => {
        const start = (page - 1) * perPage;
        return equipamentos.slice(start, start + perPage);
    }, [equipamentos, page, perPage]);

    const startItem = equipamentos.length > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = Math.min(page * perPage, equipamentos.length);

    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [page, totalPages]);

    useEffect(() => {
        if (page > totalPages && totalPages > 0) setPage(totalPages);
    }, [totalPages, page]);

    const getInitial = (tipo) => {
        if (!tipo) return '?';
        return tipo.trim()[0]?.toUpperCase() || '?';
    };

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <HeroIcon><FiTool /></HeroIcon>
                        <h1>
                            Equipamentos
                            {!isLoading && (
                                <HeroCount>{equipamentos.length}</HeroCount>
                            )}
                        </h1>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={handleRefresh} disabled={isRefreshing}>
                            <RefreshCwIcon $spinning={isRefreshing} />
                            Atualizar
                        </GhostBtn>
                        <PrimaryBtn onClick={() => navigate('/admin/equipamentos/novo')}>
                            <FiPlus />
                            Novo Equipamento
                        </PrimaryBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <TableWrapper>
                    {isLoading ? (
                        <LoadingOverlay>
                            <FiRefreshCw />
                        </LoadingOverlay>
                    ) : equipamentos.length === 0 ? (
                        <EmptyState>
                            <FiTool />
                            <p>Nenhum equipamento encontrado</p>
                        </EmptyState>
                    ) : (
                        <>
                            <THead>
                                <TH>Equipamento</TH>
                                <TH>Cliente</TH>
                                <TH style={{ textAlign: 'right' }}>Ações</TH>
                            </THead>
                            <TBody>
                                {paginatedEquipamentos.map((equip) => (
                                    <TRow
                                        key={equip.id}
                                        onClick={() => navigate(`/admin/equipamentos/detalhes/${equip.id}`)}
                                    >
                                        <TD>
                                            <MobileLabel>Equipamento</MobileLabel>
                                            <EquipCell>
                                                <EquipAvatar>
                                                    {getInitial(equip.tipo)}
                                                </EquipAvatar>
                                                <EquipDetails>
                                                    <EquipType>{equip.tipo}</EquipType>
                                                    {equip.marcaModelo && (
                                                        <EquipModel>{equip.marcaModelo}</EquipModel>
                                                    )}
                                                    {equip.numeroSerieChassi && (
                                                        <EquipSerial>S/N: {equip.numeroSerieChassi}</EquipSerial>
                                                    )}
                                                </EquipDetails>
                                            </EquipCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Cliente</MobileLabel>
                                            {clientesMap[equip.clienteId] ? (
                                                <ClientCell>
                                                    <FiUser /> {clientesMap[equip.clienteId]}
                                                </ClientCell>
                                            ) : (
                                                <span style={{ color: '#a8b8d0', fontSize: 13 }}>—</span>
                                            )}
                                        </TD>
                                        <TD>
                                            <ActionsCell onClick={(e) => e.stopPropagation()}>
                                                <ActionBtn
                                                    title="Ver detalhes"
                                                    onClick={() => navigate(`/admin/equipamentos/detalhes/${equip.id}`)}
                                                >
                                                    <FiEye />
                                                </ActionBtn>
                                                <ActionBtn
                                                    title="Editar"
                                                    onClick={() => navigate(`/admin/equipamentos/editar/${equip.id}`)}
                                                >
                                                    <FiEdit2 />
                                                </ActionBtn>
                                                <DeleteBtn
                                                    title="Excluir"
                                                    onClick={() => setDeleteTarget(equip)}
                                                >
                                                    <FiTrash2 />
                                                </DeleteBtn>
                                            </ActionsCell>
                                        </TD>
                                    </TRow>
                                ))}
                            </TBody>

                            <Pagination>
                                <PagInfo>
                                    {startItem}–{endItem} de {equipamentos.length} equipamentos
                                </PagInfo>
                                <PagControls>
                                    <PagBtn
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                    >
                                        <FiChevronLeft />
                                    </PagBtn>
                                    {pageNumbers.map(n => (
                                        <PagBtn
                                            key={n}
                                            $active={n === page}
                                            onClick={() => setPage(n)}
                                        >
                                            {n}
                                        </PagBtn>
                                    ))}
                                    <PagBtn
                                        disabled={page === totalPages || totalPages === 0}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        <FiChevronRight />
                                    </PagBtn>
                                    <PerPageSelect
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(Number(e.target.value));
                                            setPage(1);
                                        }}
                                    >
                                        <option value={10}>10 / pág</option>
                                        <option value={20}>20 / pág</option>
                                        <option value={50}>50 / pág</option>
                                        <option value={100}>100 / pág</option>
                                    </PerPageSelect>
                                </PagControls>
                            </Pagination>
                        </>
                    )}
                </TableWrapper>
            </Content>

            {deleteTarget && (
                <ConfirmOverlay onClick={() => setDeleteTarget(null)}>
                    <ConfirmBox onClick={(e) => e.stopPropagation()}>
                        <FiAlertCircle style={{ width: 40, height: 40, color: '#dc2626', marginBottom: 12 }} />
                        <h3>Excluir equipamento?</h3>
                        <p>
                            Tem certeza que deseja excluir <strong>{deleteTarget.marcaModelo || deleteTarget.tipo}</strong>?
                            Esta ação não pode ser desfeita.
                        </p>
                        <ConfirmActions>
                            <CancelConfirmBtn onClick={() => setDeleteTarget(null)}>
                                Cancelar
                            </CancelConfirmBtn>
                            <DeleteConfirmBtn onClick={handleDelete}>
                                <FiTrash2 /> Excluir
                            </DeleteConfirmBtn>
                        </ConfirmActions>
                    </ConfirmBox>
                </ConfirmOverlay>
            )}
        </Page>
    );
};

export default EquipamentosPage;
