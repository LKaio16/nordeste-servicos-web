import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as pecaService from '../../services/pecaService';
import { PageContainer, Title, Form, FormGroup, Label, Input, Button } from '../../styles/common';

function PecaEdit() {
    const { id } = useParams();
    const [peca, setPeca] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPeca = async () => {
            try {
                const data = await pecaService.getPecaById(id);
                setPeca(data);
            } catch (error) {
                console.error('Erro ao buscar dados da peça:', error);
                setError('Não foi possível carregar os dados da peça.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPeca();
    }, [id]);

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
            await pecaService.updatePeca(id, pecaData);
            navigate('/admin/pecas');
        } catch (error) {
            console.error('Erro ao atualizar peça:', error);
            alert('Falha ao atualizar peça. Verifique o console para mais detalhes.');
        }
    };

    if (isLoading) {
        return <PageContainer>Carregando...</PageContainer>;
    }

    if (error) {
        return <PageContainer><p style={{ color: 'red' }}>{error}</p></PageContainer>;
    }

    return (
        <PageContainer>
            <Title>Editar Peça</Title>
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
                <Button type="submit">Salvar Alterações</Button>
            </Form>
        </PageContainer>
    );
};

export default PecaEdit; 