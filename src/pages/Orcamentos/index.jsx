import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
    FiPlus,
    FiRefreshCw,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiDownload,
    FiSearch,
    FiChevronLeft,
    FiChevronRight,
    FiX,
    FiAlertCircle,
    FiFileText,
    FiUser,
} from 'react-icons/fi';
import orcamentoService from '../../services/orcamentoService';
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

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    svg {
        width: 16px;
        height: 16px;
    }
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

    svg {
        color: #6b86b8;
        flex-shrink: 0;
        width: 18px;
        height: 18px;
    }

    input {
        flex: 1;
        border: none;
        background: none;
        outline: none;
        font-size: 14px;
        font-family: inherit;
        color: #0c2d6b;

        &::placeholder {
            color: #a8b8d0;
        }
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

    &:hover {
        background: #1a4494;
        color: #fff;
    }

    svg {
        width: 14px;
        height: 14px;
    }
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
    overflow-x: auto;
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
`;

const THead = styled.div`
    display: grid;
    grid-template-columns: 180px minmax(160px, 1fr) 130px 140px 168px;
    min-width: 680px;
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

const TRow = styled.div`
    display: grid;
    grid-template-columns: 180px minmax(160px, 1fr) 130px 140px 168px;
    min-width: 680px;
    padding: 0 24px;
    align-items: center;
    border-bottom: 1px solid #f5f8fd;
    cursor: pointer;
    transition: background 0.15s;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #f8faff;
    }

    @media (max-width: 768px) {
        min-width: 0;
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

const NumCell = styled.div`
    font-size: 15px;
    font-weight: 700;
    color: #0c2d6b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ClientLine = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #334155;

    svg {
        color: #1a4494;
        flex-shrink: 0;
    }
`;

const ValorCell = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #237804;
`;

const StatusPill = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    ${(p) => {
        switch (p.$tone) {
            case 'orange':
                return 'background: #fff4e6; color: #d46b08;';
            case 'green':
                return 'background: #e6f7e6; color: #237804;';
            case 'red':
                return 'background: #fff1f0; color: #cf1322;';
            case 'gray':
                return 'background: #f4f4f5; color: #595959;';
            default:
                return 'background: #e8f1ff; color: #1a4494;';
        }
    }}
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
    color: #6b86b8;
    transition: all 0.15s;

    &:hover {
        background: #f0f4fa;
        border-color: #d6e0f0;
        color: #1a4494;
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
    }

    svg {
        width: 15px;
        height: 15px;
    }
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
    border: 1px solid ${(p) => (p.$active ? '#1a4494' : '#eef2f9')};
    background: ${(p) => (p.$active ? '#1a4494' : '#fff')};
    color: ${(p) => (p.$active ? '#fff' : '#6b86b8')};
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;

    &:hover:not(:disabled) {
        border-color: #1a4494;
        color: ${(p) => (p.$active ? '#fff' : '#1a4494')};
        background: ${(p) => (p.$active ? '#0c2d6b' : '#f0f4fa')};
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    svg {
        width: 16px;
        height: 16px;
    }
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

    &:focus {
        border-color: #1a4494;
    }
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 24px;
    color: #6b86b8;
    gap: 12px;

    svg {
        width: 48px;
        height: 48px;
        opacity: 0.4;
    }

    p {
        font-size: 15px;
        font-weight: 500;
        margin: 0;
    }
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
    &:hover {
        background: #eef2f9;
        color: #0c2d6b;
    }
`;

const DeleteConfirmBtn = styled(ConfirmBtn)`
    background: #dc2626;
    color: #fff;
    &:hover:not(:disabled) {
        background: #b91c1c;
    }
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

const ErrorBanner = styled.div`
    background: #fff1f0;
    border: 1px solid #ffccc7;
    color: #cf1322;
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom: 16px;
    font-size: 14px;
`;

const STATUS_LABELS = {
    PENDENTE: 'Pendente',
    APROVADO: 'Aprovado',
    REJEITADO: 'Rejeitado',
    CANCELADO: 'Cancelado',
};

const statusTone = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'PENDENTE') return 'orange';
    if (s === 'APROVADO') return 'green';
    if (s === 'REJEITADO') return 'red';
    if (s === 'CANCELADO') return 'gray';
    return 'default';
};

const formatCurrency = (val) => {
    if (val == null || val === undefined) return '0,00';
    const formatted = Math.abs(Number(val)).toFixed(2);
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
};

function OrcamentosPage() {
    const [orcamentos, setOrcamentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [busca, setBusca] = useState('');
    const [buscaAplicada, setBuscaAplicada] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        hasNext: false,
    });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const navigate = useNavigate();

    const fetchOrcamentos = useCallback(async (page = 0, size = 10, search = '') => {
        try {
            setError(null);
            const response = await orcamentoService.getOrcamentosPage(search, page, size);
            const content = response?.content || [];
            setOrcamentos(content);
            setPagination((prev) => ({
                ...prev,
                total: Number(response?.totalElements || 0),
                hasNext: Boolean(response?.hasNext),
            }));
        } catch (err) {
            setError(err.message || 'Erro ao carregar orçamentos.');
        }
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const page = pagination.current - 1;
            await fetchOrcamentos(page, pagination.pageSize, buscaAplicada);
            setIsLoading(false);
        })();
    }, [fetchOrcamentos, pagination.current, pagination.pageSize, buscaAplicada]);

    const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize) || 1);

    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, pagination.current - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [pagination.current, totalPages]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        const page = pagination.current - 1;
        await fetchOrcamentos(page, pagination.pageSize, buscaAplicada);
        setIsRefreshing(false);
    };

    const handleSearch = () => {
        setBuscaAplicada(busca.trim());
        setPagination((p) => ({ ...p, current: 1 }));
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await orcamentoService.deleteOrcamento(deleteTarget.id);
            setOrcamentos((prev) => prev.filter((o) => o.id !== deleteTarget.id));
            message.success('Orçamento excluído com sucesso!');
        } catch (deleteError) {
            message.error('Erro ao excluir orçamento: ' + (deleteError.message || 'Erro desconhecido'));
        }
        setDeleteTarget(null);
    };

    const handleDownload = async (orcamento) => {
        try {
            await orcamentoService.downloadOrcamentoPdf(orcamento.id);
            message.success('Download iniciado!');
        } catch (downloadError) {
            message.error('Erro ao baixar PDF: ' + (downloadError.message || 'Erro desconhecido'));
        }
    };

    const startItem = orcamentos.length > 0 ? (pagination.current - 1) * pagination.pageSize + 1 : 0;
    const endItem = orcamentos.length > 0 ? (pagination.current - 1) * pagination.pageSize + orcamentos.length : 0;

    if (error && orcamentos.length === 0 && !isLoading) {
        return (
            <Page>
                <div style={{ padding: '8px 0 24px' }}>
                    <ErrorBanner>{error}</ErrorBanner>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <HeroIcon>
                            <FiFileText />
                        </HeroIcon>
                        <h1>
                            Orçamentos
                            {!isLoading && (
                                <HeroCount>
                                    {pagination.total}
                                </HeroCount>
                            )}
                        </h1>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={handleRefresh} disabled={isRefreshing}>
                            <RefreshCwIcon $spinning={isRefreshing} />
                            Atualizar
                        </GhostBtn>
                        <PrimaryBtn onClick={() => navigate('/admin/orcamentos/novo')}>
                            <FiPlus />
                            Novo orçamento
                        </PrimaryBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                {error && <ErrorBanner>{error}</ErrorBanner>}
                <SearchPanel>
                    <SearchInput>
                        <FiSearch />
                        <input
                            placeholder="Buscar por número, cliente ou status..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {busca && (
                            <ClearBtn
                                onClick={() => {
                                    setBusca('');
                                    setBuscaAplicada('');
                                    setPagination((p) => ({ ...p, current: 1 }));
                                }}
                            >
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
                    ) : orcamentos.length === 0 ? (
                        <EmptyState>
                            <FiFileText />
                            <p>Nenhum orçamento encontrado</p>
                        </EmptyState>
                    ) : (
                        <>
                            <THead>
                                <TH>Número</TH>
                                <TH>Cliente</TH>
                                <TH>Status</TH>
                                <TH>Valor</TH>
                                <TH style={{ textAlign: 'right' }}>Ações</TH>
                            </THead>
                            <div>
                                {orcamentos.map((record) => (
                                    <TRow
                                        key={record.id}
                                        onClick={() => navigate(`/admin/orcamentos/detalhes/${record.id}`)}
                                    >
                                        <TD>
                                            <MobileLabel>Número</MobileLabel>
                                            <NumCell>#{record.numeroOrcamento ?? record.id}</NumCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Cliente</MobileLabel>
                                            <ClientLine>
                                                <FiUser />
                                                {record.nomeCliente || 'N/A'}
                                            </ClientLine>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Status</MobileLabel>
                                            <StatusPill $tone={statusTone(record.status)}>
                                                {STATUS_LABELS[record.status] || record.status}
                                            </StatusPill>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Valor</MobileLabel>
                                            <ValorCell>R$ {formatCurrency(record.valorTotal)}</ValorCell>
                                        </TD>
                                        <TD>
                                            <ActionsCell onClick={(e) => e.stopPropagation()}>
                                                <ActionBtn
                                                    title="Ver"
                                                    onClick={() => navigate(`/admin/orcamentos/detalhes/${record.id}`)}
                                                >
                                                    <FiEye />
                                                </ActionBtn>
                                                <ActionBtn
                                                    title="Editar"
                                                    onClick={() => navigate(`/admin/orcamentos/editar/${record.id}`)}
                                                >
                                                    <FiEdit2 />
                                                </ActionBtn>
                                                <ActionBtn
                                                    title="PDF"
                                                    onClick={() => handleDownload(record)}
                                                >
                                                    <FiDownload />
                                                </ActionBtn>
                                                <DeleteBtn title="Excluir" onClick={() => setDeleteTarget(record)}>
                                                    <FiTrash2 />
                                                </DeleteBtn>
                                            </ActionsCell>
                                        </TD>
                                    </TRow>
                                ))}
                            </div>

                            <Pagination>
                                <PagInfo>
                                    {startItem}–{endItem} de {pagination.total} orçamentos
                                </PagInfo>
                                <PagControls>
                                    <PagBtn
                                        disabled={pagination.current === 1}
                                        onClick={() => setPagination((p) => ({ ...p, current: p.current - 1 }))}
                                    >
                                        <FiChevronLeft />
                                    </PagBtn>
                                    {pageNumbers.map((n) => (
                                        <PagBtn key={n} $active={n === pagination.current} onClick={() => setPagination((p) => ({ ...p, current: n }))}>
                                            {n}
                                        </PagBtn>
                                    ))}
                                    <PagBtn
                                        disabled={!pagination.hasNext}
                                        onClick={() => setPagination((p) => ({ ...p, current: p.current + 1 }))}
                                    >
                                        <FiChevronRight />
                                    </PagBtn>
                                    <PerPageSelect
                                        value={pagination.pageSize}
                                        onChange={(e) => {
                                            setPagination((p) => ({
                                                ...p,
                                                pageSize: Number(e.target.value),
                                                current: 1,
                                            }));
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
                        <h3>Excluir orçamento?</h3>
                        <p>
                            Confirma a exclusão do orçamento <strong>#{deleteTarget.numeroOrcamento}</strong>?
                        </p>
                        <ConfirmActions>
                            <CancelConfirmBtn onClick={() => setDeleteTarget(null)}>Cancelar</CancelConfirmBtn>
                            <DeleteConfirmBtn onClick={handleDelete}>
                                <FiTrash2 /> Excluir
                            </DeleteConfirmBtn>
                        </ConfirmActions>
                    </ConfirmBox>
                </ConfirmOverlay>
            )}
        </Page>
    );
}

export default OrcamentosPage;
