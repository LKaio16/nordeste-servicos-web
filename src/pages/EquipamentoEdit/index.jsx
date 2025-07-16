import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipamentoById, updateEquipamento } from '../../services/equipamentoService';
import { getAllClientes } from '../../services/clienteService';
import { PageContainer, Form, FormGroup, Label, Input, Select, Button, Title } from '../../styles/common';

function EquipamentoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipamento, setEquipamento] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [equipamentoData, clientesData] = await Promise.all([
                    getEquipamentoById(id),
                    getAllClientes()
                ]);
                setEquipamento(equipamentoData);
                setClientes(clientesData);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipamento(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!equipamento.clienteId) {
            setError('Por favor, selecione um cliente.');
            return;
        }
        try {
            await updateEquipamento(id, equipamento);
            navigate('/admin/equipamentos');
        } catch (err) {
            setError(err.message || 'Falha ao atualizar o equipamento.');
        }
    };

    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
    if (!equipamento) return <p>Equipamento não encontrado.</p>;

    return (
        <PageContainer>
            <Title>Editar Equipamento: {equipamento.marcaModelo}</Title>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Input type="text" id="tipo" name="tipo" value={equipamento.tipo || ''} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="marcaModelo">Marca/Modelo</Label>
                    <Input type="text" id="marcaModelo" name="marcaModelo" value={equipamento.marcaModelo || ''} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="numeroSerieChassi">Nº Série/Chassi</Label>
                    <Input type="text" id="numeroSerieChassi" name="numeroSerieChassi" value={equipamento.numeroSerieChassi || ''} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="horimetro">Horímetro</Label>
                    <Input type="number" id="horimetro" name="horimetro" value={equipamento.horimetro || 0} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="clienteId">Cliente</Label>
                    <Select id="clienteId" name="clienteId" value={equipamento.clienteId || ''} onChange={handleChange} required>
                        <option value="">Selecione um Cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nomeCompleto}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <Button type="submit">Salvar Alterações</Button>
            </Form>
        </PageContainer>
    );
}

export default EquipamentoEditPage; 