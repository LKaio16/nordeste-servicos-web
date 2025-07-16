import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getClienteById, updateCliente } from '../../services/clienteService';
import {
    PageContainer,
    Title,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Select,
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

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  grid-column: 1 / -1;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;


function ClienteEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            if (!id) {
                setIsLoading(false);
                setError("ID do cliente não fornecido.");
                return;
            }
            try {
                const data = await getClienteById(id);
                setCliente(data);
            } catch (err) {
                console.error('Erro ao buscar dados do cliente:', err);
                setError('Não foi possível carregar os dados do cliente.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCliente(id, cliente);
            navigate(`/admin/clientes/detalhe/${id}`);
        } catch (err) {
            console.error('Erro ao atualizar cliente:', err);
            alert('Falha ao atualizar cliente.');
        }
    };

    if (isLoading) return <PageContainer>Carregando...</PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>Erro: {error}</p></PageContainer>;
    if (!cliente) return <PageContainer>Cliente não encontrado.</PageContainer>;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Editar Cliente</Title>
                <HeaderActions>
                    <Button as={Link} to={`/admin/clientes/detalhe/${id}`} variant="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" form="cliente-form">
                        Salvar
                    </Button>
                </HeaderActions>
            </PageHeader>
            <Card>
                <Form onSubmit={handleSubmit} id="cliente-form">
                    <FormGrid>
                        <FormGroup style={{ gridColumn: '1 / -1' }}>
                            <Label htmlFor="nomeCompleto">Nome Completo</Label>
                            <Input type="text" id="nomeCompleto" name="nomeCompleto" value={cliente.nomeCompleto || ''} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="tipoCliente">Tipo de Cliente</Label>
                            <Select id="tipoCliente" name="tipoCliente" value={cliente.tipoCliente || 'PESSOA_FISICA'} onChange={handleChange}>
                                <option value="PESSOA_FISICA">Pessoa Física</option>
                                <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                            <Input type="text" id="cpfCnpj" name="cpfCnpj" value={cliente.cpfCnpj || ''} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" id="email" name="email" value={cliente.email || ''} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="telefonePrincipal">Telefone Principal</Label>
                            <Input type="text" id="telefonePrincipal" name="telefonePrincipal" value={cliente.telefonePrincipal || ''} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="telefoneAdicional">Telefone Adicional</Label>
                            <Input type="text" id="telefoneAdicional" name="telefoneAdicional" value={cliente.telefoneAdicional || ''} onChange={handleChange} />
                        </FormGroup>

                        <SectionTitle>Endereço</SectionTitle>

                        <FormGroup>
                            <Label htmlFor="cep">CEP</Label>
                            <Input type="text" id="cep" name="cep" value={cliente.cep || ''} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="rua">Rua</Label>
                            <Input type="text" id="rua" name="rua" value={cliente.rua || ''} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="numero">Número</Label>
                            <Input type="text" id="numero" name="numero" value={cliente.numero || ''} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="complemento">Complemento</Label>
                            <Input type="text" id="complemento" name="complemento" value={cliente.complemento || ''} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="bairro">Bairro</Label>
                            <Input type="text" id="bairro" name="bairro" value={cliente.bairro || ''} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="cidade">Cidade</Label>
                            <Input type="text" id="cidade" name="cidade" value={cliente.cidade || ''} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="estado">Estado (UF)</Label>
                            <Input type="text" id="estado" name="estado" value={cliente.estado || ''} onChange={handleChange} required maxLength="2" />
                        </FormGroup>
                    </FormGrid>
                </Form>
            </Card>
        </PageContainer>
    );
};

export default ClienteEdit; 