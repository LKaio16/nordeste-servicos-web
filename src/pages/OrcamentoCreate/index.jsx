import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orcamentoService from '../../services/orcamentoService';
import { getAllClientes } from '../../services/clienteService';
import * as osService from '../../services/osService';
import { Button, Form, FormGroup, PageContainer } from '../../styles/common';

function OrcamentoCreatePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        clienteId: '',
        ordemServicoOrigemId: '',
        dataValidade: '',
        observacoesCondicoes: '',
        status: 'PENDENTE', // Valor padrão corrigido
    });
    const [clientes, setClientes] = useState([]);
    const [ordensServico, setOrdensServico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [clientesData, osData] = await Promise.all([
                    getAllClientes(),
                    osService.getAllOrdensServico()
                ]);
                setClientes(clientesData);
                setOrdensServico(osData);
            } catch (fetchError) {
                console.error("Erro ao carregar dados dos dropdowns:", fetchError);
                setError('Falha ao carregar dados da página.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDropdownData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.clienteId) {
            setError('Por favor, selecione um cliente.');
            return;
        }
        try {
            const novoOrcamento = await orcamentoService.createOrcamento(formData);
            alert('Orçamento criado com sucesso!');
            navigate(`/admin/orcamentos/detalhes/${novoOrcamento.id}`);
        } catch (submitError) {
            console.error("Erro ao criar orçamento:", submitError);
            setError('Falha ao criar o orçamento.');
        }
    };

    if (isLoading) return <p>Carregando...</p>;

    return (
        <PageContainer>
            <h1>Novo Orçamento</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <label>Cliente</label>
                    <select name="clienteId" value={formData.clienteId} onChange={handleChange} required>
                        <option value="">Selecione um Cliente</option>
                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nomeCompleto}</option>)}
                    </select>
                </FormGroup>

                <FormGroup>
                    <label>OS de Origem (Opcional)</label>
                    <select name="ordemServicoOrigemId" value={formData.ordemServicoOrigemId} onChange={handleChange}>
                        <option value="">Nenhuma</option>
                        {ordensServico.map(os => <option key={os.id} value={os.id}>{os.numeroOS} - {os.cliente.nomeCompleto}</option>)}
                    </select>
                </FormGroup>

                <FormGroup>
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} required>
                        <option value="PENDENTE">Pendente</option>
                        <option value="APROVADO">Aprovado</option>
                        <option value="REJEITADO">Rejeitado</option>
                        <option value="CANCELADO">Cancelado</option>
                    </select>
                </FormGroup>

                <FormGroup>
                    <label>Data de Validade</label>
                    <input type="date" name="dataValidade" value={formData.dataValidade} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <label>Observações e Condições</label>
                    <textarea name="observacoesCondicoes" value={formData.observacoesCondicoes} onChange={handleChange} rows="5" />
                </FormGroup>

                <Button type="submit">Criar Orçamento</Button>
            </Form>
        </PageContainer>
    );
}

export default OrcamentoCreatePage; 