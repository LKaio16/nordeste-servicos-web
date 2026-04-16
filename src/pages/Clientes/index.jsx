import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import {
    FiPlus,
    FiRefreshCw,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiSearch,
    FiDownload,
    FiPhone,
    FiMail,
    FiUser,
    FiUsers,
    FiChevronLeft,
    FiChevronRight,
    FiX,
    FiAlertCircle,
} from 'react-icons/fi';
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

const SearchPanel = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 18px;
    box-shadow: 0 4px 20px rgba(12, 45, 107, 0.1);
    border: 1px solid rgba(26, 68, 148, 0.06);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: ${fadeUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const SearchInput = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: #f4f7fb;
    border: 1.5px solid #eef2f9;
    border-radius: 12px;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus-within {
        border-color: #1a4494;
        box-shadow: 0 0 0 3px rgba(26, 68, 148, 0.1);
        background: #fff;
    }

    svg { color: #6b86b8; flex-shrink: 0; width: 18px; height: 18px; }

    input {
        flex: 1;
        border: none;
        background: none;
        outline: none;
        font-size: 14px;
        font-family: inherit;
        color: #0c2d6b;

        &::placeholder { color: #a8b8d0; }
    }
`;

const ClearBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: #dde4f0;
    color: #6b86b8;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;

    &:hover { background: #1a4494; color: #fff; }

    svg { width: 14px; height: 14px; }
`;

const SearchBtn = styled(Btn)`
    background: #1a4494;
    color: #fff;
    padding: 11px 24px;

    &:hover:not(:disabled) {
        background: #0c2d6b;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(12, 45, 107, 0.25);
    }
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
    grid-template-columns: 1fr 200px 160px;
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
    grid-template-columns: 1fr 200px 160px;
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

const ClientCell = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
`;

const ClientAvatar = styled.div`
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

const ClientDetails = styled.div``;

const ClientName = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #0c2d6b;
    margin-bottom: 3px;
`;

const ClientEmail = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6b86b8;

    svg { width: 13px; height: 13px; }
`;

const PhoneCell = styled.div`
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

const Clientes = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [busca, setBusca] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchClientes = useCallback(async () => {
        try {
            const termo = busca.trim() || undefined;
            const data = await clienteService.getAllClientes(termo);
            setClientes(data);
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
            message.error(err.message || 'Não foi possível carregar a lista de clientes.');
        }
    }, [busca]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await fetchClientes();
            setIsLoading(false);
        })();
    }, [fetchClientes]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchClientes();
        setIsRefreshing(false);
    };

    const handleSearch = () => {
        setPage(1);
        setIsLoading(true);
        fetchClientes().finally(() => setIsLoading(false));
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await clienteService.deleteCliente(deleteTarget.id);
            setClientes(prev => prev.filter(c => c.id !== deleteTarget.id));
            message.success('Cliente excluído com sucesso!');
        } catch (err) {
            message.error(err.message || 'Falha ao excluir o cliente.');
        }
        setDeleteTarget(null);
    };

    const handleDownloadExcel = async () => {
        setIsDownloading(true);
        try {
            const blob = await clienteService.downloadClientesExcel();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'clientes.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            message.success('Arquivo Excel baixado com sucesso!');
        } catch (err) {
            message.error(err.message || 'Falha ao baixar o arquivo Excel.');
        } finally {
            setIsDownloading(false);
        }
    };

    const totalPages = Math.ceil(clientes.length / perPage);
    const paginatedClientes = useMemo(() => {
        const start = (page - 1) * perPage;
        return clientes.slice(start, start + perPage);
    }, [clientes, page, perPage]);

    const startItem = clientes.length > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = Math.min(page * perPage, clientes.length);

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

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <HeroIcon><FiUsers /></HeroIcon>
                        <h1>
                            Clientes
                            {!isLoading && (
                                <HeroCount>{clientes.length}</HeroCount>
                            )}
                        </h1>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={handleRefresh} disabled={isRefreshing}>
                            <RefreshCwIcon $spinning={isRefreshing} />
                            Atualizar
                        </GhostBtn>
                        <GhostBtn onClick={handleDownloadExcel} disabled={isDownloading}>
                            <FiDownload />
                            Exportar
                        </GhostBtn>
                        <PrimaryBtn onClick={() => navigate('/admin/clientes/novo')}>
                            <FiPlus />
                            Novo Cliente
                        </PrimaryBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <SearchPanel>
                    <SearchInput>
                        <FiSearch />
                        <input
                            placeholder="Buscar por nome, CPF/CNPJ ou e-mail..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {busca && (
                            <ClearBtn onClick={() => { setBusca(''); }}>
                                <FiX />
                            </ClearBtn>
                        )}
                    </SearchInput>
                    <SearchBtn onClick={handleSearch}>
                        <FiSearch /> Buscar
                    </SearchBtn>
                </SearchPanel>

                <TableWrapper>
                    {isLoading ? (
                        <LoadingOverlay>
                            <FiRefreshCw />
                        </LoadingOverlay>
                    ) : clientes.length === 0 ? (
                        <EmptyState>
                            <FiUsers />
                            <p>Nenhum cliente encontrado</p>
                        </EmptyState>
                    ) : (
                        <>
                            <THead>
                                <TH>Cliente</TH>
                                <TH>Contato</TH>
                                <TH style={{ textAlign: 'right' }}>Ações</TH>
                            </THead>
                            <TBody>
                                {paginatedClientes.map((cliente) => (
                                    <TRow
                                        key={cliente.id}
                                        onClick={() => navigate(`/admin/clientes/detalhes/${cliente.id}`)}
                                    >
                                        <TD>
                                            <MobileLabel>Cliente</MobileLabel>
                                            <ClientCell>
                                                <ClientAvatar>
                                                    {getInitials(cliente.nomeCompleto)}
                                                </ClientAvatar>
                                                <ClientDetails>
                                                    <ClientName>{cliente.nomeCompleto}</ClientName>
                                                    {cliente.email && (
                                                        <ClientEmail>
                                                            <FiMail /> {cliente.email}
                                                        </ClientEmail>
                                                    )}
                                                </ClientDetails>
                                            </ClientCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Contato</MobileLabel>
                                            {cliente.telefonePrincipal ? (
                                                <PhoneCell>
                                                    <FiPhone /> {cliente.telefonePrincipal}
                                                </PhoneCell>
                                            ) : (
                                                <span style={{ color: '#a8b8d0', fontSize: 13 }}>—</span>
                                            )}
                                        </TD>
                                        <TD>
                                            <ActionsCell onClick={(e) => e.stopPropagation()}>
                                                <ActionBtn
                                                    title="Ver detalhes"
                                                    onClick={() => navigate(`/admin/clientes/detalhes/${cliente.id}`)}
                                                >
                                                    <FiEye />
                                                </ActionBtn>
                                                <ActionBtn
                                                    title="Editar"
                                                    onClick={() => navigate(`/admin/clientes/editar/${cliente.id}`)}
                                                >
                                                    <FiEdit2 />
                                                </ActionBtn>
                                                <DeleteBtn
                                                    title="Excluir"
                                                    onClick={() => setDeleteTarget(cliente)}
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
                                    {startItem}–{endItem} de {clientes.length} clientes
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
                        <h3>Excluir cliente?</h3>
                        <p>
                            Tem certeza que deseja excluir <strong>{deleteTarget.nomeCompleto}</strong>?
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

export default Clientes;
