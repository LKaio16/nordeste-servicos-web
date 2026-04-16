import { useState, useEffect, useCallback, useMemo } from 'react';
import reciboService from '../../services/reciboService';
import { message, Modal, Form, Input, InputNumber, Button, Space } from 'antd';
import {
    FiFileText,
    FiRefreshCw,
    FiPlus,
    FiSearch,
    FiX,
    FiTrash2,
    FiDownload,
    FiDollarSign,
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
    FiAlertCircle,
    FiUser,
} from 'react-icons/fi';
import styled, { keyframes, css } from 'styled-components';
import dayjs from 'dayjs';

const { TextArea } = Input;

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
    grid-template-columns: 150px minmax(180px, 1fr) 160px 180px 130px;
    min-width: 720px;
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
    grid-template-columns: 150px minmax(180px, 1fr) 160px 180px 130px;
    min-width: 720px;
    padding: 0 24px;
    align-items: center;
    border-bottom: 1px solid #f5f8fd;
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

const NumberCell = styled.div`
    font-size: 15px;
    font-weight: 700;
    color: #0c2d6b;
`;

const ClientCell = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #334155;

    svg {
        color: #1a4494;
    }
`;

const ValueCell = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #237804;
`;

const DateCell = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
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

const ErrorBanner = styled.div`
    background: #fff1f0;
    border: 1px solid #ffccc7;
    color: #cf1322;
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom: 16px;
    font-size: 14px;
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

const StyledModal = styled(Modal)`
    .ant-modal-header {
        border-bottom: 1px solid #eef2f9;
        padding: 16px 24px;
    }
    .ant-modal-title {
        font-weight: 700;
        color: #0c2d6b;
    }
    .ant-modal-body {
        padding: 20px 24px 24px;
    }
    .ant-form-item-label > label {
        font-size: 13px;
        font-weight: 600;
        color: #0c2d6b;
    }
    .ant-input,
    .ant-input-number {
        border-radius: 10px;
        border: 1.5px solid #dde4f0;
    }
    .ant-input-number {
        width: 100%;
    }
`;

function RecibosPage() {
    const [recibos, setRecibos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [busca, setBusca] = useState('');
    const [buscaAplicada, setBuscaAplicada] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form] = Form.useForm();

    const fetchRecibos = useCallback(async () => {
        try {
            const data = await reciboService.getAllRecibos();
            setRecibos(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Não foi possível carregar os recibos.');
            message.error(err.message || 'Não foi possível carregar os recibos.');
        }
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await fetchRecibos();
            setIsLoading(false);
        })();
    }, [fetchRecibos]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchRecibos();
        setIsRefreshing(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await reciboService.deleteRecibo(deleteTarget.id);
            setRecibos((prev) => prev.filter((r) => r.id !== deleteTarget.id));
            message.success('Recibo excluído com sucesso!');
        } catch (deleteError) {
            message.error('Erro ao excluir recibo: ' + (deleteError.message || 'Erro desconhecido'));
        }
        setDeleteTarget(null);
    };

    const handleDownload = async (recibo) => {
        try {
            await reciboService.downloadReciboPdf(recibo.id);
            message.success('Download iniciado!');
        } catch (downloadError) {
            message.error('Erro ao baixar PDF: ' + (downloadError.message || 'Erro desconhecido'));
        }
    };

    const handleCreateRecibo = async (values) => {
        try {
            setIsCreating(true);
            const reciboData = {
                valor: values.valor,
                cliente: values.cliente,
                referenteA: values.referenteA,
            };
            await reciboService.createRecibo(reciboData);
            await reciboService.generateReciboPdf(reciboData);
            message.success('Recibo criado e PDF gerado com sucesso!');
            form.resetFields();
            setIsModalOpen(false);
            await fetchRecibos();
        } catch (err) {
            message.error('Erro ao criar recibo: ' + (err.message || 'Erro desconhecido'));
        } finally {
            setIsCreating(false);
        }
    };

    const formatCurrency = (val) => {
        if (val == null || val === undefined) return '0,00';
        const formatted = Math.abs(val).toFixed(2);
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dayjs(dateString).format('DD/MM/YYYY HH:mm');
    };

    const filtrados = useMemo(() => {
        const t = buscaAplicada.trim().toLowerCase();
        if (!t) return recibos;
        return recibos.filter((r) => {
            const numero = String(r.numeroRecibo || '').toLowerCase();
            const cliente = String(r.cliente || '').toLowerCase();
            const referente = String(r.referenteA || '').toLowerCase();
            return numero.includes(t) || cliente.includes(t) || referente.includes(t);
        });
    }, [recibos, buscaAplicada]);

    const totalPages = Math.max(1, Math.ceil(filtrados.length / perPage) || 1);
    const paginated = useMemo(() => {
        const start = (page - 1) * perPage;
        return filtrados.slice(start, start + perPage);
    }, [filtrados, page, perPage]);

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

    const handleSearch = () => {
        setBuscaAplicada(busca.trim());
        setPage(1);
    };

    const startItem = filtrados.length > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = Math.min(page * perPage, filtrados.length);

    if (error && recibos.length === 0 && !isLoading) {
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
                            Recibos
                            {!isLoading && <HeroCount>{filtrados.length}/{recibos.length}</HeroCount>}
                        </h1>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={handleRefresh} disabled={isRefreshing}>
                            <RefreshCwIcon $spinning={isRefreshing} />
                            Atualizar
                        </GhostBtn>
                        <PrimaryBtn onClick={() => setIsModalOpen(true)}>
                            <FiPlus />
                            Novo recibo
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
                            placeholder="Buscar por número, cliente ou referência..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {busca && (
                            <ClearBtn
                                onClick={() => {
                                    setBusca('');
                                    setBuscaAplicada('');
                                    setPage(1);
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
                    ) : filtrados.length === 0 ? (
                        <EmptyState>
                            <FiFileText />
                            <p>Nenhum recibo encontrado</p>
                        </EmptyState>
                    ) : (
                        <>
                            <THead>
                                <TH>Número</TH>
                                <TH>Cliente</TH>
                                <TH>Valor</TH>
                                <TH>Criação</TH>
                                <TH style={{ textAlign: 'right' }}>Ações</TH>
                            </THead>

                            <div>
                                {paginated.map((record) => (
                                    <TRow key={record.id}>
                                        <TD>
                                            <MobileLabel>Número</MobileLabel>
                                            <NumberCell>{record.numeroRecibo || '—'}</NumberCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Cliente</MobileLabel>
                                            <ClientCell>
                                                <FiUser />
                                                {record.cliente || 'N/A'}
                                            </ClientCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Valor</MobileLabel>
                                            <ValueCell>
                                                <FiDollarSign />
                                                R$ {formatCurrency(record.valor)}
                                            </ValueCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Criação</MobileLabel>
                                            <DateCell>
                                                <FiCalendar />
                                                {formatDate(record.dataCriacao)}
                                            </DateCell>
                                        </TD>
                                        <TD>
                                            <ActionsCell>
                                                <ActionBtn title="Baixar PDF" onClick={() => handleDownload(record)}>
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
                                    {startItem}–{endItem} de {filtrados.length} recibos
                                </PagInfo>
                                <PagControls>
                                    <PagBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                                        <FiChevronLeft />
                                    </PagBtn>
                                    {pageNumbers.map((n) => (
                                        <PagBtn key={n} $active={n === page} onClick={() => setPage(n)}>
                                            {n}
                                        </PagBtn>
                                    ))}
                                    <PagBtn
                                        disabled={page === totalPages || totalPages === 0}
                                        onClick={() => setPage((p) => p + 1)}
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

            <StyledModal
                title="Novo recibo"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateRecibo} autoComplete="off">
                    <Form.Item
                        label="Valor (R$)"
                        name="valor"
                        rules={[
                            { required: true, message: 'Por favor, informe o valor!' },
                            {
                                validator: (_, value) => {
                                    if (!value || value <= 0) {
                                        return Promise.reject(new Error('O valor deve ser maior que zero!'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber placeholder="0,00" min={0} step={0.01} precision={2} />
                    </Form.Item>

                    <Form.Item
                        label="Cliente"
                        name="cliente"
                        rules={[
                            { required: true, message: 'Por favor, informe o nome do cliente!' },
                            { min: 3, message: 'O nome do cliente deve ter pelo menos 3 caracteres!' },
                        ]}
                    >
                        <Input placeholder="Nome do cliente" />
                    </Form.Item>

                    <Form.Item
                        label="Referente a"
                        name="referenteA"
                        rules={[
                            { required: true, message: 'Por favor, informe a descrição!' },
                            { min: 5, message: 'A descrição deve ter pelo menos 5 caracteres!' },
                        ]}
                    >
                        <TextArea placeholder="Descrição do serviço ou produto" rows={4} showCount maxLength={500} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<FiDownload />} loading={isCreating}>
                                {isCreating ? 'Criando...' : 'Criar e gerar PDF'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    form.resetFields();
                                }}
                                disabled={isCreating}
                            >
                                Cancelar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </StyledModal>

            {deleteTarget && (
                <ConfirmOverlay onClick={() => setDeleteTarget(null)}>
                    <ConfirmBox onClick={(e) => e.stopPropagation()}>
                        <FiAlertCircle style={{ width: 40, height: 40, color: '#dc2626', marginBottom: 12 }} />
                        <h3>Excluir recibo?</h3>
                        <p>
                            Confirma a exclusão do recibo <strong>{deleteTarget.numeroRecibo}</strong>?
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

export default RecibosPage;
