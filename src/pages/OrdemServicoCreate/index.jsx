import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as osService from '../../services/osService';
import * as clienteService from '../../services/clienteService';
import * as equipamentoService from '../../services/equipamentoService';
import * as usuarioService from '../../services/usuarioService';
import { PageContainer, Form, FormGroup, Label, Input, Select, Button } from '../../styles/common';

function OrdemServicoCreatePage() {
    const navigate = useNavigate();
    const [osData, setOsData] = useState({
        problemaRelatado: '',
        analiseFalha: '',
        solucaoAplicada: '',
        status: 'EM_ABERTO', // Corrigido de 'ABERTA' para o valor esperado pela API
        prioridade: 'MEDIA', // Default priority
        cliente: { id: '' },
        equipamento: { id: '' },
        tecnicoAtribuido: { id: '' }
    });
    const [clientes, setClientes] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [clientesRes, equipamentosRes, tecnicosRes] = await Promise.all([
                    clienteService.getAllClientes(),
                    equipamentoService.getAllEquipamentos(),
                    usuarioService.getAllUsuarios()
                ]);
                setClientes(clientesRes);
                setEquipamentos(equipamentosRes);
                setTecnicos(tecnicosRes.filter(u => u.perfil === 'TECNICO'));
            } catch (err) {
                setError('Falha ao carregar dados para os menus.');
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

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
        // Validação simples
        if (!osData.cliente.id || !osData.equipamento.id || !osData.problemaRelatado) {
            setError('Cliente, Equipamento e Problema Relatado são obrigatórios.');
            return;
        }
        try {
            const novaOS = await osService.createOrdemServico(osData);
            alert('Ordem de Serviço criada com sucesso!');
            navigate(`/os/${novaOS.id}`); // Navega para a página de detalhes da nova OS
        } catch (err) {
            setError('Falha ao criar a Ordem de Serviço.');
        }
    };

    if (isLoading) return <p>Carregando...</p>;

    return (
        <PageContainer>
            <h1>Nova Ordem de Serviço</h1>
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Cliente:</Label>
                    <Select name="cliente" value={osData.cliente.id} onChange={handleChange} required>
                        <option value="">Selecione um cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>{cliente.nomeCompleto}</option>
                        ))}
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>Equipamento:</Label>
                    <Select name="equipamento" value={osData.equipamento.id} onChange={handleChange} required>
                        <option value="">Selecione um equipamento</option>
                        {equipamentos.map(equip => (
                            <option key={equip.id} value={equip.id}>{equip.marcaModelo} (S/N: {equip.numeroSerieChassi})</option>
                        ))}
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>Técnico Responsável (Opcional):</Label>
                    <Select name="tecnicoAtribuido" value={osData.tecnicoAtribuido.id} onChange={handleChange}>
                        <option value="">Selecione um técnico</option>
                        {tecnicos.map(tecnico => (
                            <option key={tecnico.id} value={tecnico.id}>{tecnico.nome}</option>
                        ))}
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
                    <Input as="textarea" name="problemaRelatado" value={osData.problemaRelatado} onChange={handleChange} required />
                </FormGroup>
                <Button type="submit">Criar OS</Button>
            </Form>
        </PageContainer>
    );
}

export default OrdemServicoCreatePage; 