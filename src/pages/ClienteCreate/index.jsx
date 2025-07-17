import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCliente } from '../../services/clienteService';
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
import AlertModal from '../../components/AlertModal';

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


// --- Helper functions for masks ---
const formatCEP = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
};

const formatPhone = (value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 11);
    if (cleanValue.length > 10) {
        return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

const formatCPF_CNPJ = (value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 14);
    if (cleanValue.length <= 11) {
        return cleanValue
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cleanValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};
// ------------------------------------


function ClienteCreate() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({
        nomeCompleto: '',
        cpfCnpj: '',
        email: '',
        telefonePrincipal: '',
        telefoneAdicional: '',
        tipoCliente: 'PESSOA_FISICA',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        complemento: '',
    });
    const [alert, setAlert] = useState({ isOpen: false, message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        switch (name) {
            case 'cep':
                formattedValue = formatCEP(value);
                break;
            case 'telefonePrincipal':
            case 'telefoneAdicional':
                formattedValue = formatPhone(value);
                break;
            case 'cpfCnpj':
                formattedValue = formatCPF_CNPJ(value);
                break;
            default:
                break;
        }

        setCliente(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Remove masks before sending to backend
            const payload = {
                ...cliente,
                cep: cliente.cep.replace(/\D/g, ''),
                cpfCnpj: cliente.cpfCnpj.replace(/\D/g, ''),
                telefonePrincipal: cliente.telefonePrincipal.replace(/\D/g, ''),
                telefoneAdicional: cliente.telefoneAdicional.replace(/\D/g, ''),
            };
            await createCliente(payload);
            navigate('/admin/clientes');
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            const errorMessage = error.response?.data?.message || 'Falha ao criar o cliente. Verifique os dados e tente novamente.';
            setAlert({ isOpen: true, message: errorMessage });
        }
    };

    return (
        <>
            <PageContainer>
                <PageHeader>
                    <Title>Novo Cliente</Title>
                    <HeaderActions>
                        <Button as={Link} to="/admin/clientes" variant="secondary">
                            Cancelar
                        </Button>
                        <Button type="submit" form="cliente-form">
                            Salvar Cliente
                        </Button>
                    </HeaderActions>
                </PageHeader>
                <Card>
                    <Form onSubmit={handleSubmit} id="cliente-form">
                        <FormGrid>
                            <FormGroup style={{ gridColumn: '1 / -1' }}>
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
                                <Input type="text" id="cpfCnpj" name="cpfCnpj" value={cliente.cpfCnpj} onChange={handleChange} required placeholder="000.000.000-00" />
                            </FormGroup>

                             <FormGroup>
                                <Label htmlFor="telefonePrincipal">Telefone Principal</Label>
                                <Input type="text" id="telefonePrincipal" name="telefonePrincipal" value={cliente.telefonePrincipal} onChange={handleChange} required placeholder="(00) 00000-0000" />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="telefoneAdicional">Telefone Adicional</Label>
                                <Input type="text" id="telefoneAdicional" name="telefoneAdicional" value={cliente.telefoneAdicional} onChange={handleChange} placeholder="(00) 00000-0000"/>
                            </FormGroup>

                            <FormGroup style={{ gridColumn: '1 / -1' }}>
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" name="email" value={cliente.email} onChange={handleChange} required />
                            </FormGroup>

                            <SectionTitle>Endereço</SectionTitle>
                            
                            <FormGroup>
                                <Label htmlFor="cep">CEP</Label>
                                <Input type="text" id="cep" name="cep" value={cliente.cep} onChange={handleChange} required placeholder="00000-000" />
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
                        </FormGrid>
                    </Form>
                </Card>
            </PageContainer>
            <AlertModal
                isOpen={alert.isOpen}
                onClose={() => setAlert({ isOpen: false, message: '' })}
                title="Erro ao Criar Cliente"
                message={alert.message}
            />
        </>
    );
}

export default ClienteCreate; 