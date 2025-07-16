import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tipoServicoService from '../../services/tipoServicoService';
import { PageContainer, Form, FormGroup, Label, Input, Button } from '../../styles/common';

function ServicoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [servico, setServico] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServico = async () => {
            try {
                const data = await tipoServicoService.getTipoServicoById(id);
                setServico(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchServico();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServico(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await tipoServicoService.updateTipoServico(id, servico);
            navigate('/servicos');
        } catch (err) {
            setError(err.message || 'Falha ao atualizar o tipo de serviço.');
        }
    };

    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
    if (!servico) return <p>Tipo de serviço não encontrado.</p>;

    return (
        <PageContainer>
            <h1>Editar Tipo de Serviço</h1>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input type="text" id="descricao" name="descricao" value={servico.descricao || ''} onChange={handleChange} required />
                </FormGroup>

                <Button type="submit">Salvar Alterações</Button>
            </Form>
        </PageContainer>
    );
}

export default ServicoEditPage; 