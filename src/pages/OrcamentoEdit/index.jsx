import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import orcamentoService from '../../services/orcamentoService';
import * as osService from '../../services/osService';
import {
    PageContainer,
    Title,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Select,
    Textarea,
    PageHeader,
    HeaderActions
} from '../../styles/common';
import styled from 'styled-components';

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

function OrcamentoEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        clienteId: '',
        ordemServicoOrigemId: '',
        dataValidade: '',
        observacoesCondicoes: '',
        status: 'PENDENTE',
    });
    const [ordensServico, setOrdensServico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrcamentoData = async () => {
            try {
                const [orcamentoData, osData] = await Promise.all([
                    orcamentoService.getOrcamentoById(id),
                    osService.getAllOrdensServico(),
                ]);

                const formattedDate = orcamentoData.dataValidade
                    ? new Date(orcamentoData.dataValidade).toISOString().split('T')[0]
                    : '';

                setFormData({
                    clienteId: orcamentoData.clienteId,
                    ordemServicoOrigemId: orcamentoData.ordemServicoOrigemId || '',
                    dataValidade: formattedDate,
                    observacoesCondicoes: orcamentoData.observacoesCondicoes || '',
                    status: orcamentoData.status || 'PENDENTE',
                });
                setOrdensServico(osData);
            } catch (err) {
                setError('Falha ao carregar dados do orçamento.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrcamentoData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            ordemServicoOrigemId: formData.ordemServicoOrigemId || null,
        };

        try {
            await orcamentoService.updateOrcamento(id, payload);
            navigate(`/admin/orcamentos/detalhes/${id}`);
        } catch (err) {
            setError('Falha ao atualizar o orçamento.');
            console.error(err);
        }
    };

    if (isLoading) return <PageContainer><p>Carregando...</p></PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>{error}</p></PageContainer>;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Editar Orçamento</Title>
                <HeaderActions>
                    <Button as={Link} to={`/admin/orcamentos/detalhes/${id}`} variant="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" form="orcamento-form">
                        Salvar Alterações
                    </Button>
                </HeaderActions>
            </PageHeader>
            <Card>
                <Form onSubmit={handleSubmit} id="orcamento-form">
                    <FormGrid>
                        <FormGroup>
                            <Label htmlFor="status">Status do Orçamento</Label>
                            <Select id="status" name="status" value={formData.status} onChange={handleChange}>
                                <option value="PENDENTE">Pendente</option>
                                <option value="APROVADO">Aprovado</option>
                                <option value="REJEITADO">Rejeitado</option>
                                <option value="CANCELADO">Cancelado</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="ordemServicoOrigemId">Ordem de Serviço Associada (Opcional)</Label>
                            <Select
                                id="ordemServicoOrigemId"
                                name="ordemServicoOrigemId"
                                value={formData.ordemServicoOrigemId}
                                onChange={handleChange}
                            >
                                <option value="">Nenhuma OS</option>
                                {ordensServico.map(os => (
                                    <option key={os.id} value={os.id}>
                                        OS nº {os.id} - ({os.cliente?.nomeCompleto || 'Cliente não informado'})
                                    </option>
                                ))}
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="dataValidade">Data de Validade</Label>
                            <Input
                                type="date"
                                id="dataValidade"
                                name="dataValidade"
                                value={formData.dataValidade}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        
                        <FormGroup style={{ gridColumn: '1 / -1' }}>
                            <Label htmlFor="observacoesCondicoes">Observações e Condições</Label>
                            <Textarea
                                id="observacoesCondicoes"
                                name="observacoesCondicoes"
                                rows="5"
                                value={formData.observacoesCondicoes}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </FormGrid>
                </Form>
            </Card>
        </PageContainer>
    );
}

export default OrcamentoEditPage; 