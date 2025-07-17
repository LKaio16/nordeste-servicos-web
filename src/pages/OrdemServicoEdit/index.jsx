import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as osService from '../../services/osService';
import * as clienteService from '../../services/clienteService';
import * as equipamentoService from '../../services/equipamentoService';
import * as usuarioService from '../../services/usuarioService';
import { 
    PageContainer, 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    Select, 
    Button, 
    PageHeader, 
    Title,
    HeaderActions,
    Textarea
} from '../../styles/common';
import styled from 'styled-components';
import Spinner from '../../components/Spinner';

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

function OrdemServicoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [osData, setOsData] = useState({
        problemaRelatado: '',
        analiseFalha: '',
        solucaoAplicada: '',
        status: '',
        prioridade: '',
        clienteId: '',
        equipamentoId: '',
        tecnicoId: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [clientes, setClientes] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [os, clientesData, equipamentosData, tecnicosData] = await Promise.all([
                    osService.getOrdemServicoById(id),
                    clienteService.getAllClientes(),
                    equipamentoService.getAllEquipamentos(),
                    usuarioService.getAllUsuarios().then(users => users.filter(u => u.perfil === 'TECNICO'))
                ]);

                setOsData({
                    problemaRelatado: os.problemaRelatado || '',
                    analiseFalha: os.analiseFalha || '',
                    solucaoAplicada: os.solucaoAplicada || '',
                    status: os.status || '',
                    prioridade: os.prioridade || '',
                    clienteId: os.cliente?.id || '',
                    equipamentoId: os.equipamento?.id || '',
                    tecnicoId: os.tecnicoAtribuido?.id || ''
                });

                setClientes(clientesData);
                setEquipamentos(equipamentosData);
                setTecnicos(tecnicosData);

            } catch(err) {
                console.error('Falha ao carregar dados:', err);
                setError('Falha ao carregar dados da página.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOsData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Remapear para o formato esperado pela API se necessário
            const payload = {
                ...osData,
                cliente: { id: osData.clienteId },
                equipamento: { id: osData.equipamentoId },
                tecnicoAtribuido: osData.tecnicoId ? { id: osData.tecnicoId } : null,
            };
            await osService.updateOrdemServico(id, payload);
            navigate(`/admin/os/detalhes/${id}`);
        } catch(err) {
            console.error('Falha ao atualizar OS:', err);
            setError('Falha ao atualizar a Ordem de Serviço.');
        }
    };

    if (isLoading) return <PageContainer><Spinner /></PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>Erro: {error}</p></PageContainer>;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Editar Ordem de Serviço</Title>
                <HeaderActions>
                    <Button as={Link} to={`/admin/os/detalhes/${id}`} variant="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" form="os-edit-form">
                        Salvar Alterações
                    </Button>
                </HeaderActions>
            </PageHeader>
            <Card>
                <Form onSubmit={handleSubmit} id="os-edit-form">
                    <FormGrid>
                        <FormGroup>
                            <Label>Cliente:</Label>
                            <Select name="clienteId" value={osData.clienteId} onChange={handleChange}>
                                <option value="">Selecione um cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>{cliente.nomeCompleto}</option>
                                ))}
                            </Select>
                        </FormGroup>
                        <FormGroup>
                            <Label>Equipamento:</Label>
                            <Select name="equipamentoId" value={osData.equipamentoId} onChange={handleChange}>
                                <option value="">Selecione um equipamento</option>
                                {equipamentos
                                    .filter(e => e.clienteId === parseInt(osData.clienteId))
                                    .map(equip => (
                                    <option key={equip.id} value={equip.id}>{equip.marcaModelo} (S/N: {equip.numeroSerieChassi})</option>
                                ))}
                            </Select>
                        </FormGroup>
                        <FormGroup>
                            <Label>Técnico Responsável:</Label>
                            <Select name="tecnicoId" value={osData.tecnicoId} onChange={handleChange}>
                                <option value="">Selecione um técnico</option>
                                {tecnicos.map(tecnico => (
                                    <option key={tecnico.id} value={tecnico.id}>{tecnico.nome}</option>
                                ))}
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Status</Label>
                            <Select name="status" value={osData.status} onChange={handleChange}>
                                <option value="ABERTA">Aberta</option>
                                <option value="EM_ANDAMENTO">Em Andamento</option>
                                <option value="PAUSADA">Pausada</option>
                                <option value="CONCLUIDA">Concluída</option>
                                <option value="CANCELADA">Cancelada</option>
                            </Select>
                        </FormGroup>
                        <FormGroup>
                            <Label>Prioridade</Label>
                            <Select name="prioridade" value={osData.prioridade} onChange={handleChange}>
                                <option value="BAIXA">Baixa</option>
                                <option value="MEDIA">Média</option>
                                <option value="ALTA">Alta</option>
                                <option value="URGENTE">Urgente</option>
                            </Select>
                        </FormGroup>

                        <FormGroup style={{ gridColumn: '1 / -1' }}>
                            <Label>Problema Relatado</Label>
                            <Textarea name="problemaRelatado" value={osData.problemaRelatado} onChange={handleChange} rows="4" />
                        </FormGroup>

                        <FormGroup style={{ gridColumn: '1 / -1' }}>
                            <Label>Análise da Falha</Label>
                            <Textarea name="analiseFalha" value={osData.analiseFalha} onChange={handleChange} rows="4" />
                        </FormGroup>
                        <FormGroup style={{ gridColumn: '1 / -1' }}>
                            <Label>Solução Aplicada</Label>
                            <Textarea name="solucaoAplicada" value={osData.solucaoAplicada} onChange={handleChange} rows="4" />
                        </FormGroup>
                    </FormGrid>
                </Form>
            </Card>
        </PageContainer>
    );
}

export default OrdemServicoEditPage; 