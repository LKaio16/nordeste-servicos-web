import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as usuarioService from '../../services/usuarioService';
import { PageContainer, Form, FormGroup, Label, Input, Select, Button } from '../../styles/common';

function UsuarioEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await usuarioService.getUsuarioById(id);
                // A senha não deve ser pré-preenchida por segurança
                data.senha = '';
                setUsuario(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchUsuario();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = { ...usuario };
        // Se a senha estiver vazia, não a envie no payload para não sobrescrever a existente
        if (!payload.senha) {
            delete payload.senha;
        }

        try {
            await usuarioService.updateUsuario(id, { ...usuario, perfis: [usuario.perfil] });
            alert('Usuário atualizado com sucesso!');
            navigate(`/admin/usuarios/detalhes/${id}`);
        } catch (err) {
            setError(err.message || 'Falha ao atualizar usuário.');
        }
    };

    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
    if (!usuario) return <p>Funcionário não encontrado.</p>;

    return (
        <PageContainer>
            <h1>Editar Funcionário: {usuario.nome}</h1>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="nome">Nome</Label>
                    <Input type="text" id="nome" name="nome" value={usuario.nome || ''} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="cracha">Crachá</Label>
                    <Input type="text" id="cracha" name="cracha" value={usuario.cracha || ''} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" value={usuario.email || ''} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="senha">Nova Senha (deixe em branco para não alterar)</Label>
                    <Input type="password" id="senha" name="senha" value={usuario.senha} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="perfil">Perfil</Label>
                    <Select id="perfil" name="perfil" value={usuario.perfil || 'TECNICO'} onChange={handleChange} required>
                        <option value="ADMIN">Admin</option>
                        <option value="TECNICO">Técnico</option>
                    </Select>
                </FormGroup>

                <Button type="submit">Salvar Alterações</Button>
            </Form>
        </PageContainer>
    );
}

export default UsuarioEditPage; 