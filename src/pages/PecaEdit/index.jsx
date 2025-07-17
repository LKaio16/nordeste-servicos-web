import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as pecaService from '../../services/pecaService';
import {
    PageContainer,
    Title,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    PageHeader,
    HeaderActions
} from '../../styles/common';
import styled from 'styled-components';
import Spinner from '../../components/Spinner';

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

function PecaEdit() {
    const { id } = useParams();
    const [peca, setPeca] = useState({
        descricao: '',
        codigo: '',
        preco: '',
        estoque: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPeca = async () => {
            try {
                const data = await pecaService.getPecaById(id);
                setPeca({
                    descricao: data.descricao || '',
                    codigo: data.codigo || '',
                    preco: data.preco || '',
                    estoque: data.estoque || ''
                });
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
        return <PageContainer><Spinner /></PageContainer>;
    }

    if (error) {
        return <PageContainer><p style={{ color: 'red' }}>{error}</p></PageContainer>;
    }

    return (
        <PageContainer>
            <PageHeader>
                <Title>Editar Peça</Title>
                <HeaderActions>
                    <Button as={Link} to="/admin/pecas" variant="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" form="peca-form">
                        Salvar Alterações
                    </Button>
                </HeaderActions>
            </PageHeader>
            <Card>
                <Form onSubmit={handleSubmit} id="peca-form">
                    <FormGrid>
                        <FormGroup style={{ gridColumn: '1 / -1' }}>
                            <Label htmlFor="descricao">Descrição</Label>
                            <Input type="text" id="descricao" name="descricao" value={peca.descricao} onChange={handleChange} required />
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
                    </FormGrid>
                </Form>
            </Card>
        </PageContainer>
    );
};

export default PecaEdit; 