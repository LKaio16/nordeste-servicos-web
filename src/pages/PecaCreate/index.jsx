import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pecaMaterialService } from '../../services/pecaMaterialService';
import { PageContainer, Title, Form, FormGroup, Label, Input, Button } from '../../styles/common';
import styled from 'styled-components';

const ErrorMessage = styled.p`
    color: #e53e3e;
    background-color: #fed7d7;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: center;
`;

function PecaCreate() {
    const [peca, setPeca] = useState({
        descricao: '',
        fabricante: '',
        modelo: '',
        codigo: '',
        preco: '',
        estoque: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPeca(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!peca.codigo) {
            setError("O campo 'Código' é obrigatório.");
            return;
        }

        const codigoExists = await pecaMaterialService.checkCodigoExists(peca.codigo);
        if (codigoExists) {
            setError(`O código '${peca.codigo}' já está em uso. Por favor, insira um código diferente.`);
            return;
        }

        try {
            const pecaData = {
                ...peca,
                preco: parseFloat(peca.preco),
                estoque: parseInt(peca.estoque, 10)
            };
            await pecaMaterialService.createPeca(pecaData);
            navigate('/admin/pecas');
        } catch (err) {
            console.error('Erro ao criar peça:', err);
            setError(err.message || 'Falha ao criar a peça. Tente novamente.');
        }
    };

    return (
        <PageContainer>
            <Title>Adicionar Nova Peça</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input type="text" id="descricao" name="descricao" value={peca.descricao} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="fabricante">Fabricante</Label>
                    <Input type="text" id="fabricante" name="fabricante" value={peca.fabricante} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input type="text" id="modelo" name="modelo" value={peca.modelo} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="codigo">Código</Label>
                    <Input type="text" id="codigo" name="codigo" value={peca.codigo} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="preco">Preço</Label>
                    <Input type="number" step="0.01" id="preco" name="preco" value={peca.preco} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="estoque">Estoque</Label>
                    <Input type="number" id="estoque" name="estoque" value={peca.estoque} onChange={handleChange} required />
                </FormGroup>
                <Button type="submit">Salvar</Button>
            </Form>
        </PageContainer>
    );
};

export default PecaCreate; 