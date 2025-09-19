import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeftOutlined,
    DownloadOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    ToolOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    CameraOutlined,
    EditFilled
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
    Divider,
    Tag,
    Popconfirm,
    Modal,
    Image,
    Avatar,
    Descriptions,
    Statistic
} from 'antd';
import styled from 'styled-components';
import { getStatusLabel, getPrioridadeLabel } from '../../utils/enumLabels';

const { Title, Text } = Typography;

// Styled Components
const PageContainer = styled.div`
    padding: 0 24px 24px 24px;
    background-color: #f5f5f5;
    min-height: 100vh;
`;

const StyledCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: none;
    margin-bottom: 24px;
    
    .ant-card-body {
        padding: 32px;
    }
    
    .ant-card-head {
        border-bottom: 2px solid #f0f0f0;
        
        .ant-card-head-title {
            color: #00529b;
            font-weight: 700;
            font-size: 18px;
        }
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const TitleStyled = styled(Title)`
    color: #00529b !important;
    margin: 0 !important;
    font-size: 28px !important;
    font-weight: 700 !important;
`;

const ActionButtons = styled(Space)`
    .ant-btn {
        height: 40px;
        padding: 0 20px;
        border-radius: 8px;
  font-weight: 600;
        transition: all 0.3s ease;
        
        &.ant-btn-primary {
            background: linear-gradient(135deg, #00529b 0%, #0066cc 100%);
            border: none;
            box-shadow: 0 2px 8px rgba(0, 82, 155, 0.3);
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 82, 155, 0.4);
            }
        }
        
        &.ant-btn-default {
            border: 2px solid #d9d9d9;
            color: #666;
            
            &:hover {
                border-color: #00529b;
                color: #00529b;
            }
        }
        
        &.ant-btn-dangerous {
            border: 2px solid #ff4d4f;
            color: #ff4d4f;
            
            &:hover {
                background-color: #ff4d4f;
                color: white;
            }
        }
    }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    
    .ant-spin {
        margin-bottom: 16px;
    }
    
    .loading-text {
        color: #00529b;
        font-size: 18px;
        font-weight: 600;
    }
`;

const StatusTag = styled(Tag)`
    border-radius: 20px;
    padding: 4px 12px;
  font-weight: 500;
    border: none;
    font-size: 12px;
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
            color: #00529b;
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
    border: 2px solid #f0f0f0;
    transition: all 0.3s ease;
    
    &:hover {
        border-color: #00529b;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 82, 155, 0.1);
    }
    
    .ant-statistic-title {
        color: #00529b;
        font-weight: 600;
        font-size: 14px;
    }
    
    .ant-statistic-content {
        color: #333;
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await osService.getOrdemServicoById(id);
                setOs(data);
                const fotosData = await osService.getFotosByOsId(id);
                setFotos(fotosData);
                const assinaturaData = await osService.getAssinaturaByOsId(id);
                setAssinatura(assinaturaData);
            } catch (error) {
                message.error('Erro ao carregar dados da OS: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);


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

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingContainer>
                    <Spin size="large" />
                    <div className="loading-text">Carregando detalhes da OS...</div>
                </LoadingContainer>
            </PageContainer>
        );
    }

    if (!os) {
        return (
            <PageContainer>
                <StyledCard>
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
                        <Title level={3} style={{ color: '#ff4d4f' }}>Ordem de Serviço não encontrada</Title>
                        <Text>Verifique se o ID da OS está correto.</Text>
                    </div>
                </StyledCard>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <StyledCard>
                <HeaderContainer>
                    <TitleContainer>
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            style={{ fontSize: '18px', color: '#00529b' }}
                        />
                        <TitleStyled level={2}>
                            <Space>
                                <FileTextOutlined />
                                <span>Detalhes da OS #{id}</span>
                            </Space>
                        </TitleStyled>
                    </TitleContainer>
                    <ActionButtons>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadPdf}
                        >
                            Baixar PDF
                        </Button>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/os/editar/${id}`)}
                        >
                            Editar
                        </Button>
                        <Popconfirm
                            title="Excluir Ordem de Serviço"
                            description={`Deseja realmente excluir a OS #${id}?`}
                            onConfirm={handleDelete}
                            okText="Sim"
                            cancelText="Não"
                            okType="danger"
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                            >
                                Excluir
                            </Button>
                        </Popconfirm>
                    </ActionButtons>
                </HeaderContainer>

                <StyledCard title={
                    <Space>
                        <CheckCircleOutlined />
                        <span>Status e Prazos</span>
                    </Space>
                }>
                    <Row gutter={[24, 16]}>
                        <Col xs={24} md={8}>
                            <StatisticCard>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '8px',
                                        color: '#00529b',
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
                                        color: '#00529b',
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
                                    valueStyle={{ color: '#00529b', fontSize: '16px' }}
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
                                    valueStyle={{ color: '#00529b', fontSize: '16px' }}
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
                                    valueStyle={{ color: '#00529b', fontSize: '16px' }}
                                />
                            </StatisticCard>
                        </Col>
                    </Row>
                </StyledCard>

                <StyledCard title={
                    <Space>
                        <UserOutlined />
                        <span>Envolvidos</span>
                    </Space>
                }>
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
                                    valueStyle={{ color: '#00529b', fontSize: '18px' }}
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
                                    valueStyle={{ color: '#00529b', fontSize: '16px' }}
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
                                    valueStyle={{ color: '#00529b', fontSize: '18px' }}
                                />
                            </StatisticCard>
                        </Col>
                    </Row>
                </StyledCard>

                <StyledCard title={
                    <Space>
                        <FileTextOutlined />
                        <span>Descrição do Serviço</span>
                    </Space>
                }>
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
                </StyledCard>

                {fotos && fotos.length > 0 && (
                    <StyledCard title={
                        <Space>
                            <CameraOutlined />
                            <span>Fotos ({fotos.length})</span>
                        </Space>
                    }>
                        <ImageGallery>
                            {fotos.map((foto) => (
                                <Image
                                    key={foto.id}
                                    src={`data:image/jpeg;base64,${foto.fotoBase64}`}
                                    alt={foto.descricao || 'Foto da OS'}
                                    preview={{
                                        mask: 'Clique para ampliar'
                                    }}
                                />
                            ))}
                        </ImageGallery>
                    </StyledCard>
                )}

                {assinatura && (
                    <StyledCard title={
                        <Space>
                            <EditFilled />
                            <span>Assinaturas</span>
                        </Space>
                    }>
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
                    </StyledCard>
                )}

            </StyledCard>
        </PageContainer>
    );
}

export default OrdemServicoDetailPage; 
