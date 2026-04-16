import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import * as contaService from '../../services/contaService';
import * as clienteService from '../../services/clienteService';
import * as fornecedorService from '../../services/fornecedorService';
import { message, Select, Popconfirm } from 'antd';
import {
    FiPlus,
    FiRefreshCw,
    FiEdit2,
    FiTrash2,
    FiCheck,
    FiChevronLeft,
    FiChevronRight,
    FiAlertCircle,
    FiDollarSign,
    FiCalendar,
    FiUser,
    FiFilter,
} from 'react-icons/fi';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
`;
const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-30px); }
    to { transform: translateY(0); opacity: 1; }
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
    }
`;
const HeroIcon = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 22px;
`;
const HeroCount = styled.span`
    display: inline-flex;
    align-items: center;
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
`;
const Btn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    font-family: inherit;
    transition: all 0.2s;
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
    &:hover:not(:disabled) {
        background: #f0f7ff;
        transform: translateY(-1px);
    }
`;
const GhostBtn = styled(Btn)`
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
`;
const Content = styled.div`
    margin-top: -48px;
    position: relative;
    z-index: 2;
`;
const FiltersCard = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 10px rgba(12, 45, 107, 0.06);
    border: 1px solid rgba(26, 68, 148, 0.06);
`;
const FiltersRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
`;
const TableWrapper = styled.div`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(12, 45, 107, 0.06);
    border: 1px solid rgba(26, 68, 148, 0.06);
    overflow-x: auto;
`;
const THead = styled.div`
    display: grid;
    grid-template-columns: 108px minmax(140px, 1.15fr) minmax(110px, 0.85fr) 118px 112px 104px 176px;
    min-width: 920px;
    column-gap: 12px;
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
    grid-template-columns: 108px minmax(140px, 1.15fr) minmax(110px, 0.85fr) 118px 112px 104px 176px;
    min-width: 920px;
    column-gap: 12px;
    padding: 0 24px;
    align-items: center;
    border-bottom: 1px solid #f5f8fd;
    cursor: pointer;
    &:hover {
        background: #f8faff;
    }
    @media (max-width: 768px) {
        min-width: 0;
        grid-template-columns: 1fr;
        padding: 16px 20px;
        gap: 10px;
    }
`;
const TD = styled.div`
    padding: 16px 0;
    min-width: 0;
    @media (max-width: 768px) {
        padding: 0;
    }
`;
const TipoPill = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    margin-right: 4px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${(p) => (p.$receber ? '#1a4494' : '#ad4e00')};
    background: ${(p) => (p.$receber ? '#e8f1ff' : '#fff4e6')};
`;
const StatusPill = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${(p) => (p.$tone === 'ok' ? '#237804' : p.$tone === 'bad' ? '#a61b1b' : '#434343')};
    background: ${(p) => (p.$tone === 'ok' ? '#e6f7e6' : p.$tone === 'bad' ? '#fff1f0' : '#f5f5f5')};
`;
const DescCell = styled.div`
    font-weight: 600;
    color: #0c2d6b;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;
const ParteCell = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #334155;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const ValueCell = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #237804;
    font-weight: 700;
    white-space: nowrap;
`;
const DateCell = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #334155;
    white-space: nowrap;
`;
const ActionsCell = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    flex-wrap: wrap;
`;
const ActionBtn = styled.button`
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid #eef2f9;
    background: #fff;
    color: #6b86b8;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &:hover {
        color: #1a4494;
    }
`;
const PayBtn = styled(ActionBtn)`
    &:hover {
        color: #237804;
        border-color: #b7eb8f;
        background: #f6ffed;
    }
`;
const DeleteBtn = styled(ActionBtn)`
    &:hover {
        color: #dc2626;
        border-color: #fecaca;
        background: #fef2f2;
    }
`;
const LoadingOverlay = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 80px 24px;
    svg {
        animation: ${spin} 0.8s linear infinite;
        color: #1a4494;
    }
`;
const EmptyState = styled.div`
    text-align: center;
    color: #6b86b8;
    padding: 64px 24px;
`;
const MobileLabel = styled.span`
    display: none;
    font-size: 11px;
    color: #a8b8d0;
    text-transform: uppercase;
    font-weight: 700;
    @media (max-width: 768px) {
        display: block;
    }
`;
const Pagination = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-top: 1px solid #f5f8fd;
    flex-wrap: wrap;
    gap: 12px;
`;
const PagInfo = styled.span`
    font-size: 13px;
    color: #6b86b8;
`;
const PagControls = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;
const PagBtn = styled.button`
    min-width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid ${(p) => (p.$active ? '#1a4494' : '#eef2f9')};
    background: ${(p) => (p.$active ? '#1a4494' : '#fff')};
    color: ${(p) => (p.$active ? '#fff' : '#6b86b8')};
    cursor: pointer;
`;
const PerPageSelect = styled.select`
    height: 34px;
    border-radius: 8px;
    border: 1px solid #eef2f9;
    color: #6b86b8;
`;
const ConfirmOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(10, 30, 61, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
`;
const ConfirmBox = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    h3 {
        margin: 0 0 8px;
        color: #0c2d6b;
    }
    p {
        color: #6b86b8;
        margin: 0 0 24px;
    }
`;
const ConfirmActions = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;
const ConfirmBtn = styled(Btn)`
    padding: 10px 24px;
    font-size: 14px;
`;
const CancelConfirmBtn = styled(ConfirmBtn)`
    background: #f4f7fb;
    color: #6b86b8;
`;
const DeleteConfirmBtn = styled(ConfirmBtn)`
    background: #dc2626;
    color: #fff;
`;

const TIPO_OPCOES = [
    { value: 'PAGAR', label: 'A pagar' },
    { value: 'RECEBER', label: 'A receber' },
];
const STATUS_OPCOES = [
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'PAGO', label: 'Pago' },
    { value: 'VENCIDO', label: 'Vencido' },
];

const formatMoney = (v) =>
    v != null ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) : '–';
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : '–');

function statusTone(s) {
    if (s === 'PAGO') return 'ok';
    if (s === 'VENCIDO') return 'bad';
    return 'pend';
}

const Contas = () => {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState(undefined);
    const [filtroStatus, setFiltroStatus] = useState(undefined);
    const [filtroClienteId, setFiltroClienteId] = useState(undefined);
    const [filtroFornecedorId, setFiltroFornecedorId] = useState(undefined);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [c, f] = await Promise.all([clienteService.getAllClientes(), fornecedorService.getAllFornecedores()]);
                setClientes(Array.isArray(c) ? c : []);
                setFornecedores(Array.isArray(f) ? f : []);
            } catch (e) {
                console.error(e);
            }
        };
        load();
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const data = await contaService.getContasPage({
                clienteId: filtroClienteId,
                fornecedorId: filtroFornecedorId,
                tipo: filtroTipo,
                status: filtroStatus,
                page: Math.max(0, page - 1),
                size: perPage,
            });
            setList(Array.isArray(data?.content) ? data.content : []);
            setTotal(Number(data?.totalElements ?? 0));
        } catch (err) {
            console.error(err);
            message.error('Não foi possível carregar as contas.');
        }
    }, [filtroClienteId, filtroFornecedorId, filtroTipo, filtroStatus, page, perPage]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchData();
            setLoading(false);
        };
        load();
    }, [fetchData]);

    useEffect(() => {
        setPage(1);
    }, [filtroClienteId, filtroFornecedorId, filtroTipo, filtroStatus]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await contaService.deleteConta(deleteTarget.id);
            setList((prev) => prev.filter((x) => x.id !== deleteTarget.id));
            setTotal((prev) => Math.max(0, prev - 1));
            message.success('Conta excluída com sucesso.');
        } catch (err) {
            message.error(err.response?.data?.message || 'Falha ao excluir conta.');
        }
        setDeleteTarget(null);
    };

    const handleMarcarPaga = async (id) => {
        try {
            await contaService.marcarComoPaga(id);
            await fetchData();
            message.success('Conta marcada como paga.');
        } catch (err) {
            message.error(err.response?.data?.message || 'Falha ao marcar como paga.');
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / perPage) || 1);
    const startItem = total > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = total > 0 ? startItem + Math.max(0, list.length - 1) : 0;
    const pages = useMemo(() => {
        const res = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) res.push(i);
        return res;
    }, [page, totalPages]);

    useEffect(() => {
        if (page > totalPages && totalPages > 0) setPage(totalPages);
    }, [page, totalPages]);

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <HeroIcon>
                            <FiDollarSign />
                        </HeroIcon>
                        <h1>
                            Contas a pagar e receber
                            {!loading && <HeroCount>{list.length}/{total}</HeroCount>}
                        </h1>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCwIcon $spinning={refreshing} />
                            Atualizar
                        </GhostBtn>
                        <PrimaryBtn onClick={() => navigate('/admin/contas/novo')}>
                            <FiPlus /> Nova conta
                        </PrimaryBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <FiltersCard>
                    <FiltersRow>
                        <FiFilter style={{ color: '#6b86b8' }} />
                        <Select
                            allowClear
                            placeholder="Tipo"
                            value={filtroTipo}
                            onChange={setFiltroTipo}
                            style={{ width: 140 }}
                            options={TIPO_OPCOES}
                        />
                        <Select
                            allowClear
                            placeholder="Status"
                            value={filtroStatus}
                            onChange={setFiltroStatus}
                            style={{ width: 140 }}
                            options={STATUS_OPCOES}
                        />
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            placeholder="Cliente"
                            value={filtroClienteId}
                            onChange={(v) => {
                                setFiltroClienteId(v);
                                if (v) setFiltroFornecedorId(undefined);
                            }}
                            style={{ width: 220 }}
                            options={clientes.map((c) => ({
                                value: c.id,
                                label: c.nomeCompleto || c.nome || `Cliente #${c.id}`,
                            }))}
                        />
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            placeholder="Fornecedor"
                            value={filtroFornecedorId}
                            onChange={(v) => {
                                setFiltroFornecedorId(v);
                                if (v) setFiltroClienteId(undefined);
                            }}
                            style={{ width: 220 }}
                            options={fornecedores.map((f) => ({
                                value: f.id,
                                label: f.nome || `Fornecedor #${f.id}`,
                            }))}
                        />
                    </FiltersRow>
                </FiltersCard>

                <TableWrapper>
                    {loading ? (
                        <LoadingOverlay>
                            <FiRefreshCw />
                        </LoadingOverlay>
                    ) : list.length === 0 ? (
                        <EmptyState>
                            <FiDollarSign style={{ width: 42, height: 42, opacity: 0.4 }} />
                            <p>Nenhuma conta cadastrada</p>
                        </EmptyState>
                    ) : (
                        <>
                            <THead>
                                <TH>Tipo</TH>
                                <TH>Descrição</TH>
                                <TH>Cliente / Fornec.</TH>
                                <TH>Valor</TH>
                                <TH>Vencimento</TH>
                                <TH>Status</TH>
                                <TH style={{ textAlign: 'right' }}>Ações</TH>
                            </THead>
                            <div>
                                {list.map((record) => (
                                    <TRow
                                        key={record.id}
                                        onClick={(e) => {
                                            if (e.target.closest('button') || e.target.closest('.ant-popover')) return;
                                            navigate(`/admin/contas/editar/${record.id}`);
                                        }}
                                    >
                                        <TD>
                                            <MobileLabel>Tipo</MobileLabel>
                                            <TipoPill $receber={record.tipo === 'RECEBER'}>
                                                {record.tipo === 'PAGAR' ? 'A pagar' : 'A receber'}
                                            </TipoPill>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Descrição</MobileLabel>
                                            <DescCell>{record.descricao || '—'}</DescCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Cliente / Fornec.</MobileLabel>
                                            <ParteCell>
                                                <FiUser />
                                                {record.clienteNome || record.fornecedorNome || '–'}
                                            </ParteCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Valor</MobileLabel>
                                            <ValueCell>
                                                <FiDollarSign />
                                                {formatMoney(record.valor)}
                                            </ValueCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Vencimento</MobileLabel>
                                            <DateCell>
                                                <FiCalendar />
                                                {formatDate(record.dataVencimento)}
                                            </DateCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Status</MobileLabel>
                                            <StatusPill $tone={statusTone(record.status)}>{record.status}</StatusPill>
                                        </TD>
                                        <TD>
                                            <ActionsCell onClick={(e) => e.stopPropagation()}>
                                                {record.status !== 'PAGO' && (
                                                    <Popconfirm
                                                        title="Confirmar pagamento"
                                                        description="Todas as parcelas desta conta serão marcadas como pagas. Deseja continuar?"
                                                        onConfirm={() => handleMarcarPaga(record.id)}
                                                        okText="Sim, marcar como pago"
                                                        cancelText="Cancelar"
                                                    >
                                                        <PayBtn type="button" title="Marcar como paga" onClick={(e) => e.stopPropagation()}>
                                                            <FiCheck />
                                                        </PayBtn>
                                                    </Popconfirm>
                                                )}
                                                <ActionBtn
                                                    type="button"
                                                    title="Editar"
                                                    onClick={() => navigate(`/admin/contas/editar/${record.id}`)}
                                                >
                                                    <FiEdit2 />
                                                </ActionBtn>
                                                <DeleteBtn type="button" title="Excluir" onClick={() => setDeleteTarget(record)}>
                                                    <FiTrash2 />
                                                </DeleteBtn>
                                            </ActionsCell>
                                        </TD>
                                    </TRow>
                                ))}
                            </div>
                            <Pagination>
                                <PagInfo>
                                    {startItem}–{endItem} de {total} contas
                                </PagInfo>
                                <PagControls>
                                    <PagBtn type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                                        <FiChevronLeft />
                                    </PagBtn>
                                    {pages.map((n) => (
                                        <PagBtn key={n} type="button" $active={n === page} onClick={() => setPage(n)}>
                                            {n}
                                        </PagBtn>
                                    ))}
                                    <PagBtn
                                        type="button"
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

            {deleteTarget && (
                <ConfirmOverlay onClick={() => setDeleteTarget(null)}>
                    <ConfirmBox onClick={(e) => e.stopPropagation()}>
                        <FiAlertCircle style={{ width: 40, height: 40, color: '#dc2626', marginBottom: 12 }} />
                        <h3>Excluir conta?</h3>
                        <p>
                            Confirma a exclusão de <strong>{deleteTarget.descricao}</strong>?
                        </p>
                        <ConfirmActions>
                            <CancelConfirmBtn type="button" onClick={() => setDeleteTarget(null)}>
                                Cancelar
                            </CancelConfirmBtn>
                            <DeleteConfirmBtn type="button" onClick={handleDelete}>
                                <FiTrash2 /> Excluir
                            </DeleteConfirmBtn>
                        </ConfirmActions>
                    </ConfirmBox>
                </ConfirmOverlay>
            )}
        </Page>
    );
};

export default Contas;
