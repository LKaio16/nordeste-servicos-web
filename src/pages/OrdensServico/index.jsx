import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
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
    FiCalendar,
    FiClipboard,
    FiUser,
} from 'react-icons/fi';
import { Calendar, Modal, List, Avatar, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import * as osService from '../../services/osService';

const { Title } = Typography;

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
    overflow-y: hidden;
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
`;

const THead = styled.div`
    display: grid;
    grid-template-columns: minmax(180px, 1.2fr) 120px 140px minmax(100px, 1fr) 168px;
    column-gap: 12px;
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

const TBody = styled.div``;

const TRow = styled.div`
    display: grid;
    grid-template-columns: minmax(180px, 1.2fr) 120px 140px minmax(100px, 1fr) 168px;
    column-gap: 12px;
    min-width: 720px;
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

const OSCell = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
`;

const OSAvatar = styled.div`
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
    font-size: 13px;
`;

const OSDetails = styled.div``;

const OSIdLine = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #0c2d6b;
    margin-bottom: 3px;
`;

const OSClientLine = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6b86b8;

    svg {
        width: 13px;
        height: 13px;
    }
`;

const DateCell = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: #334155;
`;

const StatusPill = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    margin-right: 8px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${(p) => {
        switch (p.$tone) {
            case 'blue':
                return 'background: #e8f1ff; color: #1a4494;';
            case 'orange':
                return 'background: #fff4e6; color: #d46b08;';
            case 'green':
                return 'background: #e6f7e6; color: #237804;';
            case 'red':
                return 'background: #fff1f0; color: #cf1322;';
            case 'purple':
                return 'background: #f9f0ff; color: #531dab;';
            default:
                return 'background: #f4f7fb; color: #6b86b8;';
        }
    }}
`;

const TechCell = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

const StyledModal = styled(Modal)`
    .ant-modal-header {
        border-bottom: 1px solid #eef2f9;
        padding: 16px 24px;
    }
    .ant-modal-title {
        font-weight: 700;
        color: #0c2d6b;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .ant-modal-close {
        color: #6b86b8;
    }
`;

const CalendarDayPanel = styled.div`
    margin-top: 20px;
    padding: 16px;
    background: #f8faff;
    border-radius: 12px;
    border: 1px solid #eef2f9;
`;

const STATUS_LABELS = {
    EM_ABERTO: 'Em aberto',
    EM_ANDAMENTO: 'Em andamento',
    AGUARDANDO_APROVACAO: 'A. Aprovação',
    PAUSADA: 'Pausada',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
};

const statusTone = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'EM_ABERTO') return 'blue';
    if (s === 'EM_ANDAMENTO') return 'orange';
    if (s === 'AGUARDANDO_APROVACAO') return 'orange';
    if (s === 'CONCLUIDA') return 'green';
    if (s === 'CANCELADA') return 'red';
    if (s === 'PAUSADA') return 'purple';
    return 'default';
};

const OrdensServicoPage = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateOS, setSelectedDateOS] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
        hasNext: false,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const navigate = useNavigate();

    const getImageSrc = (imageData) => {
        if (!imageData) return null;
        if (imageData.startsWith('http://') || imageData.startsWith('https://')) return imageData;
        if (imageData.startsWith('data:image/')) return imageData;
        if (imageData.startsWith('/9j/') || imageData.startsWith('iVBORw0KGgo') || imageData.startsWith('R0lGOD')) {
            return `data:image/jpeg;base64,${imageData}`;
        }
        return imageData;
    };

    const fetchOrdensServico = useCallback(async (page = 0, size = 20, search = '') => {
        try {
            const response = await osService.getOrdensServicoPage(search, page, size);
            const content = response?.content || [];
            setOrdensServico(content.map((os) => ({
                id: os.id,
                numeroOS: os.numeroOS,
                status: os.status,
                dataAbertura: os.dataAbertura,
                cliente: { nomeCompleto: os.clienteNome },
                tecnicoAtribuido: os.tecnicoNome ? { nome: os.tecnicoNome } : null
            })));
            setPagination((prev) => ({
                ...prev,
                total: Number(response?.totalElements || 0),
                hasNext: Boolean(response?.hasNext)
            }));
        } catch (err) {
            message.error('Falha ao carregar as Ordens de Serviço.');
            console.error('Erro ao buscar ordens de serviço:', err);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const page = pagination.current - 1;
            await fetchOrdensServico(page, pagination.pageSize, searchTerm);
            setIsLoading(false);
        };
        loadData();
    }, [pagination.current, pagination.pageSize, searchTerm, fetchOrdensServico]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        const page = pagination.current - 1;
        await fetchOrdensServico(page, pagination.pageSize, searchTerm);
        setIsRefreshing(false);
    };

    const handleSearch = () => {
        setSearchTerm(searchInput.trim());
        setPagination((p) => ({ ...p, current: 1 }));
    };

    const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize) || 1);

    const pageNumbers = useMemo(() => {
        const page = pagination.current;
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [pagination.current, totalPages]);

    const handleViewDetails = (id) => {
        navigate(`/admin/os/detalhes/${id}`);
    };

    const handleRowClick = (record) => {
        handleViewDetails(record.id);
    };

    const handleEdit = (id) => {
        navigate(`/admin/os/editar/${id}`);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await osService.deleteOrdemServico(deleteTarget.id);
            setOrdensServico((prev) => prev.filter((o) => o.id !== deleteTarget.id));
            message.success('Ordem de serviço excluída com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar ordem de serviço:', err);
            message.error('Falha ao excluir a Ordem de Serviço.');
        }
        setDeleteTarget(null);
    };

    const handleDownloadPdf = async (id) => {
        try {
            await osService.downloadOsPdf(id);
            message.success('Download iniciado!');
        } catch (err) {
            console.error('Erro ao baixar PDF:', err);
            message.error('Falha ao baixar o PDF.');
        }
    };

    const getOSByDate = (date) => {
        const dateStr = date.format('YYYY-MM-DD');
        return ordensServico.filter((os) => {
            const osDate = new Date(os.dataAbertura).toISOString().split('T')[0];
            return osDate === dateStr;
        });
    };

    const getStatusColorAnt = (status) => {
        switch (status) {
            case 'EM_ABERTO':
                return 'blue';
            case 'EM_ANDAMENTO':
                return 'orange';
            case 'CONCLUIDA':
                return 'green';
            case 'CANCELADA':
                return 'red';
            default:
                return 'default';
        }
    };

    const renderCalendar = () => {
        const dateCellRender = (value) => {
            const listData = getOSByDate(value);
            return (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {listData.map((os) => (
                        <li key={os.id} style={{ marginBottom: 2 }}>
                            <Tag color={getStatusColorAnt(os.status)} style={{ fontSize: '10px', padding: '1px 4px' }}>
                                OS #{os.id}
                            </Tag>
                        </li>
                    ))}
                </ul>
            );
        };

        return <Calendar dateCellRender={dateCellRender} onSelect={(date) => {
            const listData = getOSByDate(date);
            setSelectedDate(date);
            setSelectedDateOS(listData);
        }} />;
    };

    const renderOSList = () => {
        if (!selectedDate || selectedDateOS.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b86b8' }}>
                    <p>Nenhuma ordem de serviço encontrada para esta data.</p>
                </div>
            );
        }

        return (
            <List
                dataSource={selectedDateOS}
                renderItem={(os) => (
                    <List.Item
                        actions={[
                            <button
                                key="view"
                                type="button"
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: '#1a4494',
                                    color: '#fff',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: 13,
                                }}
                                onClick={() => {
                                    setShowCalendar(false);
                                    handleViewDetails(os.id);
                                }}
                            >
                                Ver detalhes
                            </button>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    size="small"
                                    src={getImageSrc(os.cliente?.fotoPerfil)}
                                    icon={!getImageSrc(os.cliente?.fotoPerfil) && <UserOutlined />}
                                    style={{
                                        backgroundColor: getImageSrc(os.cliente?.fotoPerfil) ? 'transparent' : '#1a4494',
                                    }}
                                />
                            }
                            title={
                                <div>
                                    <span style={{ fontWeight: 'bold', color: '#0c2d6b' }}>OS #{os.id}</span>
                                    <Tag color={getStatusColorAnt(os.status)} style={{ marginLeft: 8 }}>
                                        {STATUS_LABELS[os.status] || os.status}
                                    </Tag>
                                </div>
                            }
                            description={
                                <div style={{ color: '#6b86b8' }}>
                                    <div>
                                        <strong>Cliente:</strong> {os.cliente?.nomeCompleto || 'N/A'}
                                    </div>
                                    {os.tecnicoAtribuido?.nome && (
                                        <div>
                                            <strong>Técnico:</strong> {os.tecnicoAtribuido.nome}
                                        </div>
                                    )}
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        );
    };

    const rangeStart = ordensServico.length > 0 ? (pagination.current - 1) * pagination.pageSize + 1 : 0;
    const rangeEnd = ordensServico.length > 0 ? (pagination.current - 1) * pagination.pageSize + ordensServico.length : 0;

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <HeroIcon>
                            <FiClipboard />
                        </HeroIcon>
                        <h1>
                            Ordens de Serviço
                            {!isLoading && ordensServico.length > 0 && (
                                <HeroCount>
                                    <FiCalendar style={{ width: 14, height: 14 }} />
                                    Pág. {pagination.current}
                                </HeroCount>
                            )}
                        </h1>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn onClick={handleRefresh} disabled={isRefreshing}>
                            <RefreshCwIcon $spinning={isRefreshing} />
                            Atualizar
                        </GhostBtn>
                        <GhostBtn onClick={() => setShowCalendar(true)}>
                            <FiCalendar />
                            Calendário
                        </GhostBtn>
                        <PrimaryBtn onClick={() => navigate('/admin/os/novo')}>
                            <FiPlus />
                            Nova OS
                        </PrimaryBtn>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <SearchPanel>
                    <SearchInput>
                        <FiSearch />
                        <input
                            placeholder="Buscar por cliente, ID ou texto..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {searchInput && (
                            <ClearBtn
                                onClick={() => {
                                    setSearchInput('');
                                    setSearchTerm('');
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
                    ) : ordensServico.length === 0 ? (
                        <EmptyState>
                            <FiClipboard />
                            <p>Nenhuma ordem de serviço encontrada</p>
                        </EmptyState>
                    ) : (
                        <>
                            <THead>
                                <TH>Ordem / Cliente</TH>
                                <TH>Abertura</TH>
                                <TH>Status</TH>
                                <TH>Técnico</TH>
                                <TH style={{ textAlign: 'right' }}>Ações</TH>
                            </THead>
                            <TBody>
                                {ordensServico.map((os) => (
                                    <TRow key={os.id} onClick={() => handleRowClick(os)}>
                                        <TD>
                                            <MobileLabel>OS / Cliente</MobileLabel>
                                            <OSCell>
                                                <OSAvatar>#{os.id}</OSAvatar>
                                                <OSDetails>
                                                    <OSIdLine>OS #{os.id}</OSIdLine>
                                                    <OSClientLine>
                                                        <FiUser /> {os.cliente?.nomeCompleto || 'N/A'}
                                                    </OSClientLine>
                                                </OSDetails>
                                            </OSCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Abertura</MobileLabel>
                                            <DateCell>{new Date(os.dataAbertura).toLocaleDateString('pt-BR')}</DateCell>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Status</MobileLabel>
                                            <StatusPill $tone={statusTone(os.status)}>
                                                {STATUS_LABELS[os.status] || os.status}
                                            </StatusPill>
                                        </TD>
                                        <TD>
                                            <MobileLabel>Técnico</MobileLabel>
                                            <TechCell>{os.tecnicoAtribuido?.nome || '—'}</TechCell>
                                        </TD>
                                        <TD>
                                            <ActionsCell onClick={(e) => e.stopPropagation()}>
                                                <ActionBtn title="Ver detalhes" onClick={() => handleViewDetails(os.id)}>
                                                    <FiEye />
                                                </ActionBtn>
                                                <ActionBtn title="Editar" onClick={() => handleEdit(os.id)}>
                                                    <FiEdit2 />
                                                </ActionBtn>
                                                <ActionBtn title="Baixar PDF" onClick={() => handleDownloadPdf(os.id)}>
                                                    <FiDownload />
                                                </ActionBtn>
                                                <DeleteBtn title="Excluir" onClick={() => setDeleteTarget(os)}>
                                                    <FiTrash2 />
                                                </DeleteBtn>
                                            </ActionsCell>
                                        </TD>
                                    </TRow>
                                ))}
                            </TBody>

                            <Pagination>
                                <PagInfo>
                                    {rangeStart > 0 ? `${rangeStart}–${rangeEnd}` : '0'} de {pagination.total} registros
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

            <StyledModal
                title={
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiCalendar style={{ color: '#1a4494' }} />
                        Calendário de OS
                    </span>
                }
                open={showCalendar}
                onCancel={() => {
                    setShowCalendar(false);
                    setSelectedDate(null);
                    setSelectedDateOS([]);
                }}
                footer={null}
                width={800}
                style={{ top: 20 }}
            >
                <div style={{ marginBottom: 12 }}>{renderCalendar()}</div>
                {selectedDate && (
                    <CalendarDayPanel>
                        <Title level={5} style={{ margin: '0 0 16px', color: '#0c2d6b' }}>
                            Ordens — {selectedDate.format('DD/MM/YYYY')}
                        </Title>
                        {renderOSList()}
                    </CalendarDayPanel>
                )}
            </StyledModal>

            {deleteTarget && (
                <ConfirmOverlay onClick={() => setDeleteTarget(null)}>
                    <ConfirmBox onClick={(e) => e.stopPropagation()}>
                        <FiAlertCircle style={{ width: 40, height: 40, color: '#dc2626', marginBottom: 12 }} />
                        <h3>Excluir ordem de serviço?</h3>
                        <p>
                            Tem certeza que deseja excluir a <strong>OS #{deleteTarget.id}</strong>? Esta ação não pode ser desfeita.
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
};

export default OrdensServicoPage;
