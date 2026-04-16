import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { message, Select } from 'antd';
import dayjs from 'dayjs';
import {
    FiBell,
    FiRefreshCw,
    FiSearch,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiCalendar,
    FiUser,
    FiClipboard,
} from 'react-icons/fi';
import * as osService from '../../services/osService';

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
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
`;

const HeroLeft = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 16px;
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
    flex-shrink: 0;
`;

const HeroText = styled.div`
    h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.3px;
    }
    p {
        margin: 8px 0 0;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.75);
        max-width: 560px;
    }
`;

const HeroBadges = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
`;

const HeroBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.95);
`;

const HeroBadgeWarn = styled(HeroBadge)`
    background: rgba(220, 38, 38, 0.25);
    color: #fecaca;
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
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    svg {
        width: 16px;
        height: 16px;
    }
`;

const GhostBtn = styled(Btn)`
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const Content = styled.div`
    margin-top: -48px;
    position: relative;
    z-index: 2;
`;

const FiltersCard = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 16px 20px;
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
    &:focus-within {
        border-color: #1a4494;
        box-shadow: 0 0 0 3px rgba(26, 68, 148, 0.1);
        background: #fff;
    }
    svg {
        color: #6b86b8;
        flex-shrink: 0;
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
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background: #dde4f0;
    color: #6b86b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SearchBtn = styled(Btn)`
    background: #1a4494;
    color: #fff;
    &:hover:not(:disabled) {
        background: #0c2d6b;
    }
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
    grid-template-columns: 88px minmax(140px, 1.1fr) 120px 130px 120px;
    min-width: 720px;
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
    grid-template-columns: 88px minmax(140px, 1.1fr) 120px 130px 120px;
    min-width: 720px;
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

const OsCell = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 700;
    color: #1a4494;
    svg {
        flex-shrink: 0;
    }
`;

const ClientCell = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #0c2d6b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const DateCell = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #334155;
    white-space: nowrap;
`;

const MutedCell = styled.div`
    font-size: 14px;
    color: #334155;
`;

const SitPill = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: ${(p) => (p.$late ? '#a61b1b' : '#1a4494')};
    background: ${(p) => (p.$late ? '#fff1f0' : '#e8f1ff')};
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
    margin-left: 8px;
`;

const SITUACAO_OPTIONS = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'ATRASADO', label: 'Atrasados' },
    { value: 'PRAZO', label: 'No prazo' },
];

function fmtAlvo(v) {
    if (v == null) return '—';
    if (typeof v === 'string') return dayjs(v).format('DD/MM/YYYY');
    if (Array.isArray(v) && v.length >= 3) {
        return dayjs(new Date(v[0], (v[1] || 1) - 1, v[2] || 1)).format('DD/MM/YYYY');
    }
    return '—';
}

function parseAlvoDayjs(v) {
    if (v == null) return null;
    if (typeof v === 'string') return dayjs(v).startOf('day');
    if (Array.isArray(v) && v.length >= 3) {
        return dayjs(new Date(v[0], (v[1] || 1) - 1, v[2] || 1)).startOf('day');
    }
    return null;
}

function isAtrasado(r, hoje) {
    const d = parseAlvoDayjs(r.lembreteDataAlvo);
    return d && d.isBefore(hoje);
}

function OsLembretesPage() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [situacao, setSituacao] = useState('TODOS');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const hoje = useMemo(() => dayjs().startOf('day'), []);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await osService.getLembretesAtivos();
            setList(Array.isArray(data) ? data : []);
        } catch (e) {
            message.error(e?.message || 'Erro ao carregar lembretes');
            setList([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const data = await osService.getLembretesAtivos();
            setList(Array.isArray(data) ? data : []);
        } catch (e) {
            message.error(e?.message || 'Erro ao carregar lembretes');
        } finally {
            setRefreshing(false);
        }
    };

    const counts = useMemo(() => {
        let atrasados = 0;
        for (const r of list) {
            if (isAtrasado(r, hoje)) atrasados += 1;
        }
        return { total: list.length, atrasados, noPrazo: list.length - atrasados };
    }, [list, hoje]);

    const filtered = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return list.filter((r) => {
            if (situacao === 'ATRASADO' && !isAtrasado(r, hoje)) return false;
            if (situacao === 'PRAZO' && isAtrasado(r, hoje)) return false;
            if (!q) return true;
            const idStr = String(r.id ?? '');
            const nome = (r.cliente?.nomeCompleto || '').toLowerCase();
            return idStr.includes(q) || nome.includes(q);
        });
    }, [list, searchTerm, situacao, hoje]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, situacao]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage) || 1);
    const paginated = useMemo(() => {
        const start = (page - 1) * perPage;
        return filtered.slice(start, start + perPage);
    }, [filtered, page, perPage]);

    const startItem = filtered.length > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = filtered.length > 0 ? Math.min(page * perPage, filtered.length) : 0;

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
                            <FiBell />
                        </HeroIcon>
                        <HeroText>
                            <h1>Lembretes de OS</h1>
                            <p>
                                Ordens de serviço fechadas com lembrete ativo (dias corridos após o fechamento), ordenadas
                                pela data alvo.
                            </p>
                            {!loading && (
                                <HeroBadges>
                                    <HeroBadge>{counts.total} ativo(s)</HeroBadge>
                                    {counts.atrasados > 0 && (
                                        <HeroBadgeWarn>{counts.atrasados} atrasado(s)</HeroBadgeWarn>
                                    )}
                                    {counts.noPrazo > 0 && <HeroBadge>{counts.noPrazo} no prazo</HeroBadge>}
                                </HeroBadges>
                            )}
                        </HeroText>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn type="button" onClick={handleRefresh} disabled={refreshing || loading}>
                            <FiRefreshCw style={refreshing ? { animation: `${spin} 0.8s linear infinite` } : undefined} />
                            Atualizar
                        </GhostBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <FiltersCard>
                    <FiltersRow>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#6b86b8' }}>Situação</span>
                        <Select
                            value={situacao}
                            onChange={setSituacao}
                            style={{ width: 180 }}
                            options={SITUACAO_OPTIONS}
                        />
                    </FiltersRow>
                </FiltersCard>

                <SearchPanel>
                    <SearchInput>
                        <FiSearch />
                        <input
                            placeholder="Buscar por nº da OS ou nome do cliente..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (setSearchTerm(searchInput.trim()), setPage(1))}
                        />
                        {searchInput && (
                            <ClearBtn
                                type="button"
                                onClick={() => {
                                    setSearchInput('');
                                    setSearchTerm('');
                                    setPage(1);
                                }}
                            >
                                <FiX />
                            </ClearBtn>
                        )}
                    </SearchInput>
                    <SearchBtn
                        type="button"
                        onClick={() => {
                            setSearchTerm(searchInput.trim());
                            setPage(1);
                        }}
                    >
                        <FiSearch /> Buscar
                    </SearchBtn>
                </SearchPanel>

                <TableWrapper>
                    {loading ? (
                        <LoadingOverlay>
                            <FiRefreshCw />
                        </LoadingOverlay>
                    ) : filtered.length === 0 ? (
                        <EmptyState>
                            <FiBell style={{ width: 42, height: 42, opacity: 0.4 }} />
                            <p>Nenhum lembrete encontrado</p>
                        </EmptyState>
                    ) : (
                        <>
                            <THead>
                                <TH>OS</TH>
                                <TH>Cliente</TH>
                                <TH>Data alvo</TH>
                                <TH>Dias p/ fech.</TH>
                                <TH>Situação</TH>
                            </THead>
                            <div>
                                {paginated.map((r) => {
                                    const late = isAtrasado(r, hoje);
                                    return (
                                        <TRow key={r.id} onClick={() => navigate(`/admin/os/detalhes/${r.id}`)}>
                                            <TD>
                                                <MobileLabel>OS</MobileLabel>
                                                <OsCell>
                                                    <FiClipboard />
                                                    #{r.id}
                                                </OsCell>
                                            </TD>
                                            <TD>
                                                <MobileLabel>Cliente</MobileLabel>
                                                <ClientCell>
                                                    <FiUser />
                                                    {r.cliente?.nomeCompleto || '—'}
                                                </ClientCell>
                                            </TD>
                                            <TD>
                                                <MobileLabel>Data alvo</MobileLabel>
                                                <DateCell>
                                                    <FiCalendar />
                                                    {fmtAlvo(r.lembreteDataAlvo)}
                                                </DateCell>
                                            </TD>
                                            <TD>
                                                <MobileLabel>Dias após fech.</MobileLabel>
                                                <MutedCell>{r.lembreteDiasAposFechamento != null ? r.lembreteDiasAposFechamento : '—'}</MutedCell>
                                            </TD>
                                            <TD>
                                                <MobileLabel>Situação</MobileLabel>
                                                <SitPill $late={late}>{late ? 'Atrasado' : 'No prazo'}</SitPill>
                                            </TD>
                                        </TRow>
                                    );
                                })}
                            </div>
                            <Pagination>
                                <PagInfo>
                                    {startItem}–{endItem} de {filtered.length} lembrete(s)
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
                                        <option value={15}>15 / pág</option>
                                        <option value={20}>20 / pág</option>
                                        <option value={50}>50 / pág</option>
                                    </PerPageSelect>
                                </PagControls>
                            </Pagination>
                        </>
                    )}
                </TableWrapper>
            </Content>
        </Page>
    );
}

export default OsLembretesPage;
