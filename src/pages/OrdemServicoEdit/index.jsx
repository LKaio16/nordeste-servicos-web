import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as osService from '../../services/osService';
import * as clienteService from '../../services/clienteService';
import * as equipamentoService from '../../services/equipamentoService';
import * as usuarioService from '../../services/usuarioService';
import { PageContainer, Form, FormGroup, Label, Input, Select, Button, PageHeader, Title } from '../../styles/common';

function OrdemServicoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [osData, setOsData] = useState({
        problemaRelatado: '',
        analiseFalha: '',
        solucaoAplicada: '',
        status: '',
        prioridade: '',
        // IDs para relacionamentos
        cliente: { id: '' },
        equipamento: { id: '' },
        tecnicoAtribuido: { id: '' }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [clientes, setClientes] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Busca os dados da OS
                const osData = await osService.getOrdemServicoById(id);
                setOsData({
                    problemaRelatado: osData.problemaRelatado || '',
                    analiseFalha: osData.analiseFalha || '',
                    solucaoAplicada: osData.solucaoAplicada || '',
                    status: osData.status || '',
                    prioridade: osData.prioridade || '',
                    cliente: { id: osData.cliente?.id || '' },
                    equipamento: { id: osData.equipamento?.id || '' },
                    tecnicoAtribuido: { id: osData.tecnicoAtribuido?.id || '' }
                });

                // Busca as listas para os selects
                const clientesData = await clienteService.getAllClientes();
                setClientes(clientesData);

                const equipamentosData = await equipamentoService.getAllEquipamentos();
                setEquipamentos(equipamentosData);

                // Busca apenas usuários com perfil de técnico
                const tecnicosData = await usuarioService.getAllUsuarios();
                setTecnicos(tecnicosData.filter(u => u.perfil === 'TECNICO'));

            } catch {
                setError('Falha ao carregar dados da página.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['cliente', 'equipamento', 'tecnicoAtribuido'].includes(name)) {
            setOsData(prev => ({ ...prev, [name]: { id: value } }));
        } else {
            setOsData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await osService.updateOrdemServico(id, osData);
            alert('Ordem de Serviço atualizada com sucesso!');
            navigate(`/os/${id}`);
        } catch {
            setError('Falha ao atualizar a Ordem de Serviço.');
        }
    };

    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Editar Ordem de Serviço</Title>
            </PageHeader>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Cliente:</Label>
                    <Select name="cliente" value={osData.cliente.id} onChange={handleChange}>
                        <option value="">Selecione um cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>{cliente.nomeCompleto}</option>
                        ))}
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>Equipamento:</Label>
                    <Select name="equipamento" value={osData.equipamento.id} onChange={handleChange}>
                        <option value="">Selecione um equipamento</option>
                        {equipamentos.map(equip => (
                            <option key={equip.id} value={equip.id}>{equip.marcaModelo} (S/N: {equip.numeroSerieChassi})</option>
                        ))}
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>Técnico Responsável:</Label>
                    <Select name="tecnicoAtribuido" value={osData.tecnicoAtribuido.id} onChange={handleChange}>
                        <option value="">Selecione um técnico</option>
                        {tecnicos.map(tecnico => (
                            <option key={tecnico.id} value={tecnico.id}>{tecnico.nome}</option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Status</Label>
                    <Select name="status" value={osData.status} onChange={handleChange}>
                        <option value="EM_ABERTO">Em Aberto</option>
                        <option value="ATRIBUIDA">Atribuída</option>
                        <option value="EM_ANDAMENTO">Em Andamento</option>
                        <option value="PENDENTE_PECAS">Pendente de Peças</option>
                        <option value="AGUARDANDO_APROVACAO">Aguardando Aprovação</option>
                        <option value="CONCLUIDA">Concluída</option>
                        <option value="ENCERRADA">Encerrada</option>
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

                <FormGroup>
                    <Label>Problema Relatado</Label>
                    <Input as="textarea" name="problemaRelatado" value={osData.problemaRelatado} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label>Análise da Falha</Label>
                    <Input as="textarea" name="analiseFalha" value={osData.analiseFalha} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label>Solução Aplicada</Label>
                    <Input as="textarea" name="solucaoAplicada" value={osData.solucaoAplicada} onChange={handleChange} />
                </FormGroup>

                <Button type="submit">Salvar Alterações</Button>
            </Form>
        </PageContainer>
    );
}

export default OrdemServicoEditPage; 