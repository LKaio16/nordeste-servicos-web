import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    ToolOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    CameraOutlined,
    EditFilled,
    UploadOutlined,
    BellOutlined,
    PlusOutlined
} from '@ant-design/icons';
import * as osService from '../../services/osService';
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Spin,
    Row,
    Col,
    Popconfirm,
    Modal,
    Table,
    Image,
    Avatar,
    Descriptions,
    Statistic,
    Switch,
    InputNumber
} from 'antd';
import styled, { keyframes } from 'styled-components';
import { FiArrowLeft, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';

const { Title, Text } = Typography;

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

const Page = styled.div`
    padding-bottom: 32px;
    animation: ${fadeIn} 0.3s ease both;
`;

const Hero = styled.div`
    background: linear-gradient(145deg, #0c2d6b 0%, #1a4494 40%, #1e5bb5 70%, #2b6fc2 100%);
    margin: -24px -32px 0;
    padding: 32px 36px 72px;
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
        padding: 24px 20px 64px;
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
`;

const BackBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    svg {
        width: 18px;
        height: 18px;
    }
`;

const HeroInfo = styled.div`
    h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.3px;
    }
    p {
        margin: 4px 0 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
    }
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
    svg {
        width: 16px;
        height: 16px;
    }
`;

const PrimaryBtn = styled(Btn)`
    background: #fff;
    color: #1a4494;
    &:hover {
        background: #f0f7ff;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
    }
`;

const GhostBtn = styled(Btn)`
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const DangerGhostBtn = styled(Btn)`
    background: rgba(220, 38, 38, 0.15);
    color: #fca5a5;
    border: 1px solid rgba(220, 38, 38, 0.3);
    &:hover {
        background: rgba(220, 38, 38, 0.25);
        color: #fff;
    }
`;

const Content = styled.div`
    margin-top: -44px;
    position: relative;
    z-index: 2;
`;

const Section = styled.div`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(12, 45, 107, 0.06);
    border: 1px solid rgba(26, 68, 148, 0.06);
    margin-bottom: 18px;
    overflow: hidden;
    animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: ${(p) => p.$d || '0.15s'};
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 24px;
    border-bottom: 1px solid #eef2f9;
    svg {
        width: 18px;
        height: 18px;
        color: #1a4494;
    }
    h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: #0c2d6b;
    }
`;

const SectionHeaderRow = styled(SectionHeader)`
    justify-content: space-between;
    flex-wrap: wrap;
`;

const SectionBody = styled.div`
    padding: 24px;
`;

const LoadWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    gap: 16px;
    flex-direction: column;
    .ant-spin-dot-item {
        background-color: #1a4494 !important;
    }
`;

const ImageGallery = styled.div`
  display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;

    .ant-image {
    border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

    &:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
  }
`;

const ImageContainer = styled.div`
    position: relative;
    display: inline-block;
    
    .delete-button {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 10;
        background: rgba(255, 77, 79, 0.9);
        border: none;
        border-radius: 4px;
        color: white;
        padding: 4px 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        transition: all 0.3s ease;
        
        &:hover {
            background: rgba(255, 77, 79, 1);
            transform: scale(1.05);
        }
    }
`;

const SignatureContainer = styled.div`
    display: flex;
    gap: 24px;
    flex-wrap: wrap;

    .signature-item {
        text-align: center;
        
        .signature-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #0c2d6b;
        }
        
        .ant-image {
            border: 2px solid #d9d9d9;
        border-radius: 8px;
            padding: 8px;
            background: white;
        }
    }
`;

const StatisticCard = styled(Card)`
    text-align: center;
    border-radius: 12px;
    border: 1px solid #eef2f9;
    transition: all 0.3s ease;

    &:hover {
        border-color: #1a4494;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(26, 68, 148, 0.1);
    }

    .ant-statistic-title {
        color: #1a4494;
        font-weight: 600;
        font-size: 14px;
    }

    .ant-statistic-content {
        color: #0c2d6b;
        font-weight: 700;
    }
`;

function OrdemServicoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [os, setOs] = useState(null);
    const [fotos, setFotos] = useState([]);
    const [assinatura, setAssinatura] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const [uploadInputKey, setUploadInputKey] = useState(0);

    // Registros de tempo (somente no web)
    const [registrosTempo, setRegistrosTempo] = useState([]);
    const [isLoadingRegistrosTempo, setIsLoadingRegistrosTempo] = useState(false);
    const [editTempoModalOpen, setEditTempoModalOpen] = useState(false);
    const [tempoEditRegistroId, setTempoEditRegistroId] = useState(null);
    const [tempoEditHoraInicio, setTempoEditHoraInicio] = useState(null);
    const [tempoEditHoras, setTempoEditHoras] = useState(null);

    const [novoTempoModalOpen, setNovoTempoModalOpen] = useState(false);
    const [novoTempoHoras, setNovoTempoHoras] = useState(1);
    const [novoTempoSaving, setNovoTempoSaving] = useState(false);

    const [lembreteAtivo, setLembreteAtivo] = useState(false);
    const [lembreteDias, setLembreteDias] = useState(30);
    const [lembreteSaving, setLembreteSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await osService.getOrdemServicoById(id);
                setOs(data);
                const fotosData = await osService.getFotosByOsId(id);
                setFotos(fotosData);
                const assinaturaData = await osService.getAssinaturaByOsId(id);
                setAssinatura(assinaturaData);

                // Registros de tempo
                setIsLoadingRegistrosTempo(true);
                try {
                    const registrosData = await osService.getRegistrosTempoByOsId(id);
                    setRegistrosTempo(registrosData || []);
                } catch (e) {
                    // Se falhar, não impede carregar o restante da tela
                    setRegistrosTempo([]);
                } finally {
                    setIsLoadingRegistrosTempo(false);
                }
            } catch (error) {
                message.error('Erro ao carregar dados da OS: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!os) return;
        setLembreteAtivo(!!os.lembreteAtivo);
        setLembreteDias(os.lembreteDiasAposFechamento ?? 30);
    }, [os]);

    const handleDeleteFoto = async (fotoId) => {
        try {
            await osService.deleteFoto(id, fotoId);
            message.success('Foto excluída com sucesso!');
            setFotos(fotos.filter(foto => foto.id !== fotoId));
        } catch (error) {
            message.error('Erro ao excluir foto: ' + (error.message || 'Erro desconhecido'));
        }
    };

    const refreshRegistrosTempo = async () => {
        setIsLoadingRegistrosTempo(true);
        try {
            const registrosData = await osService.getRegistrosTempoByOsId(id);
            setRegistrosTempo(registrosData || []);
        } catch (e) {
            setRegistrosTempo([]);
        } finally {
            setIsLoadingRegistrosTempo(false);
        }
    };

    const openEditarTempo = (registro) => {
        setTempoEditRegistroId(registro?.id ?? null);
        const inicio = registro?.horaInicio ? dayjs(registro.horaInicio) : dayjs();
        setTempoEditHoraInicio(inicio);
        let horas = 1;
        if (registro?.horaTermino) {
            horas = Math.max(0.01, dayjs(registro.horaTermino).diff(inicio, 'hour', true));
        } else if (registro?.horasTrabalhadas != null && Number(registro.horasTrabalhadas) > 0) {
            horas = Number(registro.horasTrabalhadas);
        }
        setTempoEditHoras(Number(horas.toFixed(2)));
        setEditTempoModalOpen(true);
    };

    const handleSalvarEdicaoTempo = async () => {
        if (!tempoEditRegistroId || !tempoEditHoraInicio) return;
        const horas = Number(tempoEditHoras);
        if (!horas || horas <= 0) {
            message.warning('Informe a duração em horas (maior que zero).');
            return;
        }
        try {
            const horaTerminoStr = tempoEditHoraInicio.add(horas, 'hour').format('YYYY-MM-DDTHH:mm:ss');
            await osService.finalizarRegistroTempo(id, tempoEditRegistroId, horaTerminoStr);
            message.success('Registro de tempo atualizado com sucesso!');
            setEditTempoModalOpen(false);
            await refreshRegistrosTempo();
        } catch (e) {
            message.error('Erro ao atualizar registro de tempo.');
        }
    };

    const handleExcluirRegistroTempo = async (registroId) => {
        try {
            await osService.deleteRegistroTempo(id, registroId);
            message.success('Registro de tempo excluído.');
            await refreshRegistrosTempo();
        } catch (e) {
            message.error('Erro ao excluir registro de tempo.');
        }
    };

    const openNovoRegistroTempo = () => {
        setNovoTempoHoras(1);
        setNovoTempoModalOpen(true);
    };

    const handleSalvarNovoRegistroTempo = async () => {
        const tecnicoId = os?.tecnicoAtribuido?.id;
        if (!tecnicoId) {
            message.warning('Atribua um técnico à OS antes de criar um registro de tempo.');
            return;
        }
        const horas = Number(novoTempoHoras);
        if (!horas || horas <= 0) {
            message.warning('Informe a duração em horas (maior que zero).');
            return;
        }
        setNovoTempoSaving(true);
        try {
            const criado = await osService.iniciarRegistroTempo(id, tecnicoId);
            const inicio = criado?.horaInicio ? dayjs(criado.horaInicio) : dayjs();
            const horaTerminoStr = inicio.add(horas, 'hour').format('YYYY-MM-DDTHH:mm:ss');
            await osService.finalizarRegistroTempo(id, criado.id, horaTerminoStr);
            message.success('Registro de tempo criado.');
            setNovoTempoModalOpen(false);
            await refreshRegistrosTempo();
        } catch (e) {
            message.error('Erro ao criar registro de tempo.');
        } finally {
            setNovoTempoSaving(false);
        }
    };

    const handleFinalizarTempo = async (registroId) => {
        try {
            await osService.finalizarRegistroTempo(id, registroId);
            message.success('Registro de tempo finalizado!');
            await refreshRegistrosTempo();
        } catch (e) {
            message.error('Erro ao finalizar registro de tempo.');
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result;
                const base64 = dataUrl.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleUploadFoto = async (e) => {
        const files = e?.target?.files;
        if (!files || files.length === 0) return;

        const acceptTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const toUpload = [];
        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            if (acceptTypes.includes(f.type)) {
                toUpload.push(f);
            } else {
                message.warning(`Arquivo ignorado: ${f.name} (tipo não permitido)`);
            }
        }
        if (toUpload.length === 0) {
            message.warning('Envie apenas imagens (JPEG, PNG, GIF ou WebP).');
            e.target.value = '';
            return;
        }

        setUploadingFoto(true);
        try {
            for (const file of toUpload) {
                const base64 = await fileToBase64(file);
                const payload = {
                    fotoBase64: base64,
                    descricao: null,
                    nomeArquivoOriginal: file.name,
                    tipoConteudo: file.type || 'image/jpeg',
                    tamanhoArquivo: file.size
                };
                const novaFoto = await osService.uploadFoto(id, payload);
                setFotos((prev) => [...prev, novaFoto]);
            }
            message.success(`${toUpload.length} foto(s) enviada(s) com sucesso!`);
        } catch (error) {
            message.error('Erro ao enviar foto: ' + (error?.message || 'Erro desconhecido'));
        } finally {
            setUploadingFoto(false);
            setUploadInputKey((k) => k + 1);
            e.target.value = '';
        }
    };

    const getFotoSrc = (foto) => {
        if (foto.fotoUrl) return foto.fotoUrl;
        if (foto.fotoBase64) {
            const base64 = String(foto.fotoBase64).trim();
            if (!base64) return null;
            if (base64.startsWith('data:')) return base64;
            const tipo = foto.tipoConteudo || 'image/jpeg';
            return `data:${tipo};base64,${base64}`;
        }
        return null;
    };


    const handleDelete = async () => {
        try {
            await osService.deleteOrdemServico(id);
            message.success('Ordem de Serviço excluída com sucesso!');
            navigate('/admin/os');
        } catch (err) {
            message.error('Erro ao excluir a Ordem de Serviço: ' + err.message);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            await osService.downloadOsPdf(id);
            message.success('Download iniciado!');
        } catch (err) {
            message.error('Erro ao baixar PDF: ' + err.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatLembreteDataAlvo = (v) => {
        if (v == null || v === '') return '—';
        if (typeof v === 'string') return dayjs(v).format('DD/MM/YYYY');
        if (Array.isArray(v) && v.length >= 3) {
            return dayjs(new Date(v[0], (v[1] || 1) - 1, v[2] || 1)).format('DD/MM/YYYY');
        }
        return formatDate(v);
    };

    const rawStatus = (s) => {
        if (!s) return '';
        if (typeof s === 'string') return s;
        return s.name || s.status || '';
    };

    // Função para extrair o valor do status/prioridade
    const extractValue = (value) => {
        if (!value) return 'N/A';

        // Se é string, retorna diretamente
        if (typeof value === 'string') {
            return value;
        }

        // Se é objeto, tenta diferentes propriedades
        if (typeof value === 'object') {
            return value.value ||
                value.nome ||
                value.descricao ||
                value.status ||
                value.name ||
                value.label ||
                value.text ||
                value.descricaoStatus ||
                value.nomeStatus ||
                Object.values(value).find(val => typeof val === 'string') ||
                'Valor Desconhecido';
        }

        return String(value);
    };

    const getStatusColor = (status) => {
        const statusValue = extractValue(status);
        const statusString = String(statusValue).toUpperCase();

        switch (statusString) {
            case 'EM_ABERTO': return 'orange';
            case 'EM_ANDAMENTO': return 'blue';
            case 'CONCLUIDA': return 'green';
            case 'CANCELADA': return 'red';
            case 'PENDENTE': return 'yellow';
            default: return 'blue';
        }
    };

    const getPrioridadeColor = (prioridade) => {
        const prioridadeValue = extractValue(prioridade);
        const prioridadeString = String(prioridadeValue).toUpperCase();

        switch (prioridadeString) {
            case 'BAIXA': return 'green';
            case 'MEDIA': return 'orange';
            case 'ALTA': return 'red';
            case 'URGENTE': return 'purple';
            default: return 'blue';
        }
    };

    const handleSalvarLembrete = async () => {
        if (!os?.dataFechamento) {
            message.warning('Esta OS não possui data de fechamento.');
            return;
        }
        if (lembreteAtivo) {
            const d = Number(lembreteDias);
            if (!d || d < 1 || d > 365) {
                message.error('Informe entre 1 e 365 dias após o fechamento.');
                return;
            }
        }
        setLembreteSaving(true);
        try {
            const updated = await osService.patchOrdemServicoLembrete(id, {
                ativo: lembreteAtivo,
                diasAposFechamento: lembreteAtivo ? Number(lembreteDias) : undefined
            });
            setOs(updated);
            message.success('Lembrete atualizado.');
        } catch (e) {
            message.error(e?.message || 'Erro ao salvar lembrete.');
        } finally {
            setLembreteSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Page>
                <Hero>
                    <HeroInner>
                        <HeroInfo>
                            <h1>Ordem de Serviço</h1>
                        </HeroInfo>
                    </HeroInner>
                </Hero>
                <Content>
                    <LoadWrap>
                        <Spin size="large" />
                        <span style={{ color: '#6b86b8', fontWeight: 600 }}>Carregando detalhes da OS...</span>
                    </LoadWrap>
                </Content>
            </Page>
        );
    }

    if (!os) {
        return (
            <Page>
                <Hero>
                    <HeroInner>
                        <HeroInfo>
                            <h1>OS não encontrada</h1>
                            <p>Verifique o ID informado</p>
                        </HeroInfo>
                    </HeroInner>
                </Hero>
                <Content>
                    <Section $d="0.1s">
                        <SectionBody style={{ textAlign: 'center' }}>
                            <ExclamationCircleOutlined style={{ fontSize: 48, color: '#dc2626', marginBottom: 16 }} />
                            <Title level={3} style={{ color: '#dc2626', margin: 0 }}>
                                Ordem de Serviço não encontrada
                            </Title>
                            <Text>Verifique se o ID da OS está correto.</Text>
                        </SectionBody>
                    </Section>
                </Content>
            </Page>
        );
    }

    const statusStr =
        rawStatus(os.status) ||
        String(extractValue(os.status) || '')
            .replace(/\s+/g, '_')
            .toUpperCase();
    const isOsFechada = statusStr === 'CONCLUIDA' || statusStr === 'ENCERRADA';

    return (
        <Page>
            <Hero>
                <HeroInner>
                    <HeroLeft>
                        <BackBtn onClick={() => navigate(-1)}>
                            <FiArrowLeft />
                        </BackBtn>
                        <HeroInfo>
                            <h1>OS #{id}</h1>
                            <p>
                                {extractValue(os.status)}
                                {os.cliente?.nomeCompleto ? ` · ${os.cliente.nomeCompleto}` : ''}
                            </p>
                        </HeroInfo>
                    </HeroLeft>
                    <HeroActions>
                        <GhostBtn type="button" onClick={handleDownloadPdf}>
                            <FiDownload /> PDF
                        </GhostBtn>
                        <PrimaryBtn type="button" onClick={() => navigate(`/admin/os/editar/${id}`)}>
                            <FiEdit2 /> Editar
                        </PrimaryBtn>
                        <Popconfirm
                            title="Excluir Ordem de Serviço"
                            description={`Deseja realmente excluir a OS #${id}?`}
                            onConfirm={handleDelete}
                            okText="Sim"
                            cancelText="Não"
                            okType="danger"
                        >
                            <DangerGhostBtn type="button">
                                <FiTrash2 /> Excluir
                            </DangerGhostBtn>
                        </Popconfirm>
                    </HeroActions>
                </HeroInner>
            </Hero>

            <Content>
                <Section $d="0.1s">
                    <SectionHeader>
                        <CheckCircleOutlined />
                        <h3>Status e prazos</h3>
                    </SectionHeader>
                    <SectionBody>
                    <Row gutter={[24, 16]}>
                        <Col xs={24} md={8}>
                            <StatisticCard>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '8px',
                                        color: '#1a4494',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}>
                                        <CheckCircleOutlined style={{ marginRight: '8px' }} />
                                        <span>Status</span>
                                    </div>
                                    <div style={{
                                        backgroundColor: getStatusColor(os.status) === 'orange' ? '#fa8c16' :
                                            getStatusColor(os.status) === 'blue' ? '#1890ff' :
                                                getStatusColor(os.status) === 'green' ? '#52c41a' :
                                                    getStatusColor(os.status) === 'red' ? '#ff4d4f' :
                                                        getStatusColor(os.status) === 'yellow' ? '#fadb14' : '#1890ff',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        display: 'inline-block'
                                    }}>
                                        {extractValue(os.status)}
                                    </div>
                                </div>
                            </StatisticCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <StatisticCard>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '8px',
                                        color: '#1a4494',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}>
                                        <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
                                        <span>Prioridade</span>
                                    </div>
                                    <div style={{
                                        backgroundColor: getPrioridadeColor(os.prioridade) === 'green' ? '#52c41a' :
                                            getPrioridadeColor(os.prioridade) === 'orange' ? '#fa8c16' :
                                                getPrioridadeColor(os.prioridade) === 'red' ? '#ff4d4f' :
                                                    getPrioridadeColor(os.prioridade) === 'purple' ? '#722ed1' : '#1890ff',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        display: 'inline-block'
                                    }}>
                                        {extractValue(os.prioridade)}
                                    </div>
                                </div>
                            </StatisticCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <StatisticCard>
                                <Statistic
                                    title={
                                        <Space>
                                            <CalendarOutlined />
                                            <span>Data de Abertura</span>
                                        </Space>
                                    }
                                    value={formatDate(os.dataAbertura)}
                                    valueStyle={{ color: '#1a4494', fontSize: '16px' }}
                                />
                            </StatisticCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <StatisticCard>
                                <Statistic
                                    title={
                                        <Space>
                                            <CalendarOutlined />
                                            <span>Data de Agendamento</span>
                                        </Space>
                                    }
                                    value={formatDate(os.dataAgendamento)}
                                    valueStyle={{ color: '#1a4494', fontSize: '16px' }}
                                />
                            </StatisticCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <StatisticCard>
                                <Statistic
                                    title={
                                        <Space>
                                            <CalendarOutlined />
                                            <span>Data de Fechamento</span>
                                        </Space>
                                    }
                                    value={formatDate(os.dataFechamento)}
                                    valueStyle={{ color: '#1a4494', fontSize: '16px' }}
                                />
                            </StatisticCard>
                        </Col>
                    </Row>
                    </SectionBody>
                </Section>

                {isOsFechada && (
                    <Section $d="0.14s">
                        <SectionHeader>
                            <BellOutlined />
                            <h3>Lembrete pós-fechamento</h3>
                        </SectionHeader>
                        <SectionBody>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                                Dias corridos após a data de fechamento da OS. O lembrete não fica vinculado a um
                                usuário.
                            </Text>
                            {!os.dataFechamento ? (
                                <Text type="warning">
                                    Sem data de fechamento registrada — não é possível definir lembrete.
                                </Text>
                            ) : (
                                <>
                                    <Row gutter={[24, 16]} align="middle">
                                        <Col xs={24} sm={12}>
                                            <Space align="center" wrap>
                                                <Text strong>Lembrete ativo</Text>
                                                <Switch checked={lembreteAtivo} onChange={setLembreteAtivo} />
                                            </Space>
                                        </Col>
                                        {lembreteAtivo && (
                                            <Col xs={24} sm={12}>
                                                <Space align="center" wrap>
                                                    <Text strong>Dias após o fechamento</Text>
                                                    <InputNumber
                                                        min={1}
                                                        max={365}
                                                        value={lembreteDias}
                                                        onChange={(v) => setLembreteDias(v ?? 30)}
                                                    />
                                                </Space>
                                            </Col>
                                        )}
                                    </Row>
                                    <div style={{ marginTop: 16 }}>
                                        <Text type="secondary">Data alvo atual: </Text>
                                        <Text strong>{formatLembreteDataAlvo(os.lembreteDataAlvo)}</Text>
                                        {lembreteAtivo && (
                                            <Text type="secondary" style={{ marginLeft: 8 }}>
                                                (atualize ao salvar para recalcular)
                                            </Text>
                                        )}
                                    </div>
                                    <Button
                                        type="primary"
                                        loading={lembreteSaving}
                                        onClick={handleSalvarLembrete}
                                        style={{ marginTop: 16 }}
                                    >
                                        Salvar lembrete
                                    </Button>
                                </>
                            )}
                        </SectionBody>
                    </Section>
                )}

                <Section $d="0.18s">
                    <SectionHeader>
                        <UserOutlined />
                        <h3>Envolvidos</h3>
                    </SectionHeader>
                    <SectionBody>
                    <Row gutter={[24, 16]}>
                        <Col xs={24} md={8}>
                            <StatisticCard>
                                <Statistic
                                    title={
                                        <Space>
                                            <UserOutlined />
                                            <span>Cliente</span>
                                        </Space>
                                    }
                                    value={os.cliente?.nomeCompleto || 'N/A'}
                                    valueStyle={{ color: '#1a4494', fontSize: '18px' }}
                                />
                            </StatisticCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <StatisticCard>
                                <Statistic
                                    title={
                                        <Space>
                                            <ToolOutlined />
                                            <span>Equipamento</span>
                                        </Space>
                                    }
                                    value={os.equipamento ? `${os.equipamento.marcaModelo} (S/N: ${os.equipamento.numeroSerieChassi})` : 'N/A'}
                                    valueStyle={{ color: '#1a4494', fontSize: '16px' }}
                                />
                            </StatisticCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <StatisticCard>
                                <Statistic
                                    title={
                                        <Space>
                                            <UserOutlined />
                                            <span>Técnico Responsável</span>
                                        </Space>
                                    }
                                    value={os.tecnicoAtribuido?.nome || 'Não atribuído'}
                                    valueStyle={{ color: '#1a4494', fontSize: '18px' }}
                                />
                            </StatisticCard>
                        </Col>
                    </Row>
                    </SectionBody>
                </Section>

                <Section $d="0.22s">
                    <SectionHeader>
                        <FileTextOutlined />
                        <h3>Descrição do serviço</h3>
                    </SectionHeader>
                    <SectionBody>
                    <Row gutter={[24, 16]}>
                        <Col xs={24}>
                            <Descriptions column={1} size="large">
                                <Descriptions.Item
                                    label={
                                        <Space>
                                            <ExclamationCircleOutlined />
                                            <span>Problema Relatado</span>
                                        </Space>
                                    }
                                >
                                    <Text>{os.problemaRelatado || 'N/A'}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={
                                        <Space>
                                            <ToolOutlined />
                                            <span>Análise da Falha</span>
                                        </Space>
                                    }
                                >
                                    <Text>{os.analiseFalha || 'N/A'}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={
                                        <Space>
                                            <CheckCircleOutlined />
                                            <span>Solução Aplicada</span>
                                        </Space>
                                    }
                                >
                                    <Text>{os.solucaoAplicada || 'N/A'}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                    </SectionBody>
                </Section>

                <Section $d="0.26s">
                    <SectionHeaderRow>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CalendarOutlined />
                            <h3 style={{ margin: 0 }}>Registro de tempo</h3>
                        </div>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openNovoRegistroTempo}>
                            Novo registro
                        </Button>
                    </SectionHeaderRow>
                    <SectionBody>
                    {isLoadingRegistrosTempo ? (
                        <div style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                            Carregando registros de tempo...
                        </div>
                    ) : registrosTempo && registrosTempo.length > 0 ? (
                        <Table
                            size="small"
                            rowKey="id"
                            pagination={false}
                            dataSource={registrosTempo}
                            columns={[
                                {
                                    title: 'Técnico',
                                    key: 'tecnico',
                                    render: (_, record) => record?.nomeTecnico || `Técnico #${record?.tecnicoId ?? '-'}`,
                                },
                                {
                                    title: 'Início',
                                    key: 'inicio',
                                    render: (_, record) => (record?.horaInicio ? formatDate(record.horaInicio) : 'N/A'),
                                },
                                {
                                    title: 'Término',
                                    key: 'termino',
                                    render: (_, record) => (record?.horaTermino ? formatDate(record.horaTermino) : 'Em andamento'),
                                },
                                {
                                    title: 'Horas',
                                    key: 'horas',
                                    render: (_, record) => {
                                        const h = record?.horasTrabalhadas;
                                        return h != null ? `${Number(h).toFixed(2)} h` : '--';
                                    },
                                },
                                {
                                    title: 'Ações',
                                    key: 'acoes',
                                    render: (_, record) => (
                                        <Space>
                                            {record?.horaTermino == null && (
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    icon={<CheckCircleOutlined />}
                                                    onClick={() => handleFinalizarTempo(record.id)}
                                                >
                                                    Finalizar
                                                </Button>
                                            )}
                                            <Button
                                                size="small"
                                                icon={<EditOutlined />}
                                                onClick={() => openEditarTempo(record)}
                                            >
                                                Editar
                                            </Button>
                                            <Popconfirm
                                                title="Excluir este registro de tempo?"
                                                description="Esta ação não pode ser desfeita."
                                                okText="Excluir"
                                                cancelText="Cancelar"
                                                okButtonProps={{ danger: true }}
                                                onConfirm={() => handleExcluirRegistroTempo(record.id)}
                                            >
                                                <Button size="small" danger icon={<DeleteOutlined />}>
                                                    Excluir
                                                </Button>
                                            </Popconfirm>
                                        </Space>
                                    ),
                                },
                            ]}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                            Nenhum registro de tempo para esta OS.
                        </div>
                    )}
                    </SectionBody>
                </Section>

                <Section $d="0.3s">
                    <SectionHeaderRow>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CameraOutlined style={{ fontSize: 18, color: '#1a4494' }} />
                            <h3 style={{ margin: 0 }}>Fotos ({fotos?.length || 0})</h3>
                        </div>
                        <div>
                            <input
                                key={uploadInputKey}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                multiple
                                style={{ display: 'none' }}
                                id="upload-foto-os"
                                onChange={handleUploadFoto}
                            />
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                loading={uploadingFoto}
                                onClick={() => document.getElementById('upload-foto-os')?.click()}
                                style={{ borderRadius: 10 }}
                            >
                                Enviar fotos
                            </Button>
                        </div>
                    </SectionHeaderRow>
                    <SectionBody>
                    {fotos && fotos.length > 0 ? (
                        <ImageGallery>
                            {fotos.map((foto) => {
                                const src = getFotoSrc(foto);
                                if (!src) return null;
                                return (
                                    <ImageContainer key={foto.id}>
                                        <Popconfirm
                                            title="Excluir foto"
                                            description="Tem certeza que deseja excluir esta foto?"
                                            onConfirm={() => handleDeleteFoto(foto.id)}
                                            okText="Sim"
                                            cancelText="Não"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button
                                                type="primary"
                                                danger
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                className="delete-button"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Excluir
                                            </Button>
                                        </Popconfirm>
                                        <Image
                                            src={src}
                                            alt={foto.descricao || foto.nomeArquivoOriginal || 'Foto da OS'}
                                            preview={{
                                                mask: 'Clique para ampliar'
                                            }}
                                        />
                                    </ImageContainer>
                                );
                            })}
                        </ImageGallery>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                            <CameraOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <p>Nenhuma foto ainda. Clique em &quot;Enviar fotos&quot; para adicionar.</p>
                        </div>
                    )}
                    </SectionBody>
                </Section>

                {assinatura && (
                    <Section $d="0.34s">
                        <SectionHeader>
                            <EditFilled />
                            <h3>Assinaturas</h3>
                        </SectionHeader>
                        <SectionBody>
                        <SignatureContainer>
                            {assinatura.assinaturaClienteBase64 && (
                                <div className="signature-item">
                                    <span className="signature-label">
                                        Cliente: {assinatura.nomeClienteResponsavel || 'N/A'}
                                    </span>
                                    <Image
                                        src={`data:image/png;base64,${assinatura.assinaturaClienteBase64}`}
                                        alt="Assinatura do Cliente"
                                        preview={{
                                            mask: 'Clique para ampliar'
                                        }}
                                    />
                                </div>
                            )}
                            {assinatura.assinaturaTecnicoBase64 && (
                                <div className="signature-item">
                                    <span className="signature-label">
                                        Técnico: {os.nomeTecnicoResponsavel || 'N/A'}
                                    </span>
                                    <Image
                                        src={`data:image/png;base64,${assinatura.assinaturaTecnicoBase64}`}
                                        alt="Assinatura do Técnico"
                                        preview={{
                                            mask: 'Clique para ampliar'
                                        }}
                                    />
                                </div>
                            )}
                        </SignatureContainer>
                        </SectionBody>
                    </Section>
                )}

            </Content>

            <Modal
                title="Editar registro de tempo"
                open={editTempoModalOpen}
                onCancel={() => setEditTempoModalOpen(false)}
                onOk={handleSalvarEdicaoTempo}
                okText="Salvar"
            >
                <div style={{ marginBottom: 12, color: '#555' }}>
                    O término é calculado a partir da <strong>hora de início</strong> do registro e da{' '}
                    <strong>duração</strong> informada (ex.: 1,5 = 1h30).
                </div>
                {tempoEditHoraInicio && (
                    <div style={{ marginBottom: 12 }}>
                        <Text type="secondary">Início (fixo): </Text>
                        <Text strong>{formatDate(tempoEditHoraInicio.toISOString())}</Text>
                    </div>
                )}
                <div style={{ marginBottom: 8 }}>
                    <Text>Duração (horas)</Text>
                    <InputNumber
                        style={{ width: '100%', marginTop: 6 }}
                        min={0.01}
                        max={999}
                        step={0.25}
                        precision={2}
                        value={tempoEditHoras}
                        onChange={(v) => setTempoEditHoras(v)}
                    />
                </div>
                {tempoEditHoraInicio && tempoEditHoras > 0 && (
                    <div style={{ marginTop: 12, padding: '10px 12px', background: '#f5f7fb', borderRadius: 8 }}>
                        <Text type="secondary">Término calculado: </Text>
                        <Text strong>
                            {formatDate(tempoEditHoraInicio.add(tempoEditHoras, 'hour').toISOString())}
                        </Text>
                    </div>
                )}
            </Modal>

            <Modal
                title="Novo registro de tempo"
                open={novoTempoModalOpen}
                onCancel={() => setNovoTempoModalOpen(false)}
                onOk={handleSalvarNovoRegistroTempo}
                okText="Criar"
                confirmLoading={novoTempoSaving}
            >
                <div style={{ marginBottom: 12, color: '#555' }}>
                    Será criado um registro para <strong>{os?.tecnicoAtribuido?.nome || 'o técnico atribuído'}</strong>{' '}
                    com início no momento da criação e a duração abaixo.
                </div>
                {!os?.tecnicoAtribuido?.id && (
                    <div style={{ marginBottom: 12 }}>
                        <Text type="warning">Atribua um técnico à OS na edição da ordem para usar esta função.</Text>
                    </div>
                )}
                <div>
                    <Text>Duração (horas)</Text>
                    <InputNumber
                        style={{ width: '100%', marginTop: 6 }}
                        min={0.01}
                        max={999}
                        step={0.25}
                        precision={2}
                        value={novoTempoHoras}
                        onChange={(v) => setNovoTempoHoras(v ?? 1)}
                    />
                </div>
            </Modal>
        </Page>
    );
}

export default OrdemServicoDetailPage; 
