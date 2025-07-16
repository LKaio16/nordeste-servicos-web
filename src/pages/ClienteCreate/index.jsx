import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCliente } from '../../services/clienteService';
import { PageContainer, Title, Form, FormGroup, Label, Input, Button, Select, SectionTitle } from '../../styles/common';

function ClienteCreate() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({
        nomeCompleto: '',
        cpfCnpj: '',
        email: '',
        telefonePrincipal: '',
        telefoneAdicional: '',
        tipoCliente: 'PESSOA_FISICA', // Valor padrão
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        complemento: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCliente(cliente);
            navigate('/admin/clientes');
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            alert('Falha ao criar cliente. Verifique o console para mais detalhes.');
        }
    };

    return (
        <PageContainer>
            <Title>Novo Cliente</Title>
            <Form onSubmit={handleSubmit}>
                {/* Campos do formulário idênticos ao de edição, mas para um novo cliente */}
                <FormGroup>
                    <Label htmlFor="nomeCompleto">Nome Completo</Label>
                    <Input type="text" id="nomeCompleto" name="nomeCompleto" value={cliente.nomeCompleto} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="tipoCliente">Tipo de Cliente</Label>
                    <Select id="tipoCliente" name="tipoCliente" value={cliente.tipoCliente} onChange={handleChange} required>
                        <option value="PESSOA_FISICA">Pessoa Física</option>
                        <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                    <Input type="text" id="cpfCnpj" name="cpfCnpj" value={cliente.cpfCnpj} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" value={cliente.email} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="telefonePrincipal">Telefone Principal</Label>
                    <Input type="text" id="telefonePrincipal" name="telefonePrincipal" value={cliente.telefonePrincipal} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="telefoneAdicional">Telefone Adicional</Label>
                    <Input type="text" id="telefoneAdicional" name="telefoneAdicional" value={cliente.telefoneAdicional} onChange={handleChange} />
                </FormGroup>

                <SectionTitle>Endereço</SectionTitle>
                <FormGroup>
                    <Label htmlFor="cep">CEP</Label>
                    <Input type="text" id="cep" name="cep" value={cliente.cep} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="rua">Rua</Label>
                    <Input type="text" id="rua" name="rua" value={cliente.rua} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="numero">Número</Label>
                    <Input type="text" id="numero" name="numero" value={cliente.numero} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input type="text" id="complemento" name="complemento" value={cliente.complemento} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input type="text" id="bairro" name="bairro" value={cliente.bairro} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input type="text" id="cidade" name="cidade" value={cliente.cidade} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="estado">Estado (UF)</Label>
                    <Input type="text" id="estado" name="estado" value={cliente.estado} onChange={handleChange} required maxLength="2" />
                </FormGroup>

                <Button type="submit">Salvar Cliente</Button>
            </Form>
        </PageContainer>
    );
};

export default ClienteCreate; 