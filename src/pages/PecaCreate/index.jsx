import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPeca } from '../../services/pecaService';
import { PageContainer, Title, Form, FormGroup, Label, Input, Button } from '../../styles/common';

function PecaCreate() {
    const [peca, setPeca] = useState({
        descricao: '',
        fabricante: '',
        modelo: '',
        codigo: '',
        preco: '',
        estoque: ''
    });
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
        try {
            const pecaData = {
                ...peca,
                preco: parseFloat(peca.preco),
                estoque: parseInt(peca.estoque, 10)
            };
            await createPeca(pecaData);
            navigate('/admin/pecas');
        } catch (error) {
            console.error('Erro ao criar peça:', error);
            alert('Falha ao criar peça. Verifique o console para mais detalhes.');
        }
    };

    return (
        <PageContainer>
            <Title>Adicionar Nova Peça</Title>
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
                    <Input type="text" id="codigo" name="codigo" value={peca.codigo} onChange={handleChange} />
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