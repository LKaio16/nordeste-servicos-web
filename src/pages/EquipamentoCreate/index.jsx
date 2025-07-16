import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEquipamento } from '../../services/equipamentoService';
import { getAllClientes } from '../../services/clienteService';
import { PageContainer, Form, FormGroup, Label, Input, Select, Button, Title } from '../../styles/common';

const initialEquipamentoState = {
    tipo: '',
    marcaModelo: '',
    numeroSerieChassi: '',
    horimetro: 0,
    clienteId: ''
};

function EquipamentoCreatePage() {
    const navigate = useNavigate();
    const [equipamento, setEquipamento] = useState(initialEquipamentoState);
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await getAllClientes();
                setClientes(data);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        };
        fetchClientes();
    }, []);

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
            await createEquipamento(equipamento);
            navigate('/admin/equipamentos');
        } catch (err) {
            setError(err.message || 'Falha ao criar o equipamento.');
        }
    };

    return (
        <PageContainer>
            <Title>Novo Equipamento</Title>
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Input type="text" id="tipo" name="tipo" value={equipamento.tipo} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="marcaModelo">Marca/Modelo</Label>
                    <Input type="text" id="marcaModelo" name="marcaModelo" value={equipamento.marcaModelo} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="numeroSerieChassi">Nº Série/Chassi</Label>
                    <Input type="text" id="numeroSerieChassi" name="numeroSerieChassi" value={equipamento.numeroSerieChassi} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="horimetro">Horímetro</Label>
                    <Input type="number" id="horimetro" name="horimetro" value={equipamento.horimetro} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="clienteId">Cliente</Label>
                    <Select id="clienteId" name="clienteId" value={equipamento.clienteId} onChange={handleChange} required>
                        <option value="">Selecione um Cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nomeCompleto}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <Button type="submit">Salvar Equipamento</Button>
            </Form>
        </PageContainer>
    );
}

export default EquipamentoCreatePage; 