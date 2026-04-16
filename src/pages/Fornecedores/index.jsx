import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import * as fornecedorService from '../../services/fornecedorService';
import { message, Select } from 'antd';
import {
    FiPlus,
    FiRefreshCw,
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiAlertCircle,
    FiPackage,
    FiMapPin,
} from 'react-icons/fi';

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
    grid-template-columns: minmax(180px, 1.2fr) 140px minmax(120px, 0.9fr) 100px 108px;
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
    grid-template-columns: minmax(180px, 1.2fr) 140px minmax(120px, 0.9fr) 100px 108px;
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
const NameCell = styled.div`
    font-size: 15px;
    font-weight: 700;
    color: #0c2d6b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const MutedCell = styled.div`
    font-size: 14px;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const LocCell = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const StatusPill = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: ${(p) => (p.$ativo ? '#237804' : '#595959')};
    background: ${(p) => (p.$ativo ? '#e6f7e6' : '#f5f5f5')};
`;
const ActionsCell = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 6px;
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
    margin-left: 8px;
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

const STATUS_OPTIONS = [
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' },
];

const Fornecedores = () => {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(undefined);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const data = await fornecedorService.getAllFornecedores(searchTerm || undefined, statusFilter || undefined);
            setList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            message.error('Não foi possível carregar os fornecedores.');
        }
    }, [searchTerm, statusFilter]);

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
    }, [searchTerm, statusFilter]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await fornecedorService.deleteFornecedor(deleteTarget.id);
            setList((prev) => prev.filter((x) => x.id !== deleteTarget.id));
            message.success('Fornecedor excluído com sucesso.');
        } catch (err) {
            message.error(err.response?.data?.message || 'Falha ao excluir fornecedor.');
        }
        setDeleteTarget(null);
    };

    const totalPages = Math.max(1, Math.ceil(list.length / perPage) || 1);
    const paginated = useMemo(() => {
        const start = (page - 1) * perPage;
        return list.slice(start, start + perPage);
    }, [list, page, perPage]);

    const startItem = list.length > 0 ? (page - 1) * perPage + 1 : 0;
    const endItem = list.length > 0 ? Math.min(page * perPage, list.length) : 0;

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
                            <FiPackage />
                        </HeroIcon>
                        <h1>
                            Fornecedores
                            {!loading && <HeroCount>{list.length}</HeroCount>}
                        </h1>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn type="button" onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCwIcon $spinning={refreshing} />
                            Atualizar
                        </GhostBtn>
                        <PrimaryBtn type="button" onClick={() => navigate('/admin/fornecedores/novo')}>
                            <FiPlus /> Novo fornecedor
                        </PrimaryBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <FiltersCard>
                    <FiltersRow>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#6b86b8' }}>Status</span>
                        <Select
                            allowClear
                            placeholder="Todos"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: 160 }}
                            options={STATUS_OPTIONS}
                        />
                    </FiltersRow>
                </FiltersCard>

                <SearchPanel>
                    <SearchInput>
                        <FiSearch />
                        <input
                            placeholder="Buscar por nome..."
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
                    ) : list.length === 0 ? (
                        <EmptyState>
                            <FiPackage style={{ width: 42, height: 42, opacity: 0.4 }} />
                            <p>Nenhum fornecedor cadastrado</p>
                        </EmptyState>
                    ) : (
                        <>
                            <THead>
                                <TH>Nome</TH>
                                <TH>CNPJ</TH>
                                <TH>Cidade / UF</TH>
                                <TH>Status</TH>
                                <TH style={{ textAlign: 'right' }}>Ações</TH>
                            </THead>
                            <div>
                                {paginated.map((record) => (
                                    <TRow
                                        key={record.id}
                                        onClick={() => navigate(`/admin/fornecedores/editar/${record.id}`)}
                                    >
                                        <TD>
                                            <MobileLabel>Nome</MobileLabel>
                                            <NameCell>{record.nome}</NameCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>CNPJ</MobileLabel>
                                            <MutedCell>{record.cnpj || '—'}</MutedCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Cidade / UF</MobileLabel>
                                            <LocCell>
                                                <FiMapPin />
                                                {(record.cidade || '—') + ' / ' + (record.estado || '—')}
                                            </LocCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Status</MobileLabel>
                                            <StatusPill $ativo={record.status === 'ATIVO'}>{record.status}</StatusPill>
                                        </TD>
                                        <TD>
                                            <ActionsCell onClick={(e) => e.stopPropagation()}>
                                                <ActionBtn
                                                    type="button"
                                                    title="Editar"
                                                    onClick={() => navigate(`/admin/fornecedores/editar/${record.id}`)}
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
                                    {startItem}–{endItem} de {list.length} fornecedores
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
                        <h3>Excluir fornecedor?</h3>
                        <p>
                            Confirma a exclusão de <strong>{deleteTarget.nome}</strong>?
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

export default Fornecedores;
