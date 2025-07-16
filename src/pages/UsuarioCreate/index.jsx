import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as usuarioService from '../../services/usuarioService';
import { PageContainer, Form, FormGroup, Label, Input, Select, Button } from '../../styles/common';

const initialUsuarioState = {
    nome: '',
    cracha: '',
    email: '',
    senha: '',
    perfil: 'TECNICO', // Valor padrão
    fotoPerfil: '' // Campo para a foto, pode ser um upload no futuro
};

function UsuarioCreatePage() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(initialUsuarioState);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!usuario.senha) {
            setError('O campo senha é obrigatório para criar um novo funcionário.');
            return;
        }
        try {
            await usuarioService.createUsuario({ ...usuario, perfis: [usuario.perfil] });
            alert('Usuário criado com sucesso!');
            navigate('/admin/usuarios');
        } catch (err) {
            setError(err.message || 'Falha ao criar usuário.');
        }
    };

    return (
        <PageContainer>
            <h1>Novo Funcionário</h1>
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="nome">Nome</Label>
                    <Input type="text" id="nome" name="nome" value={usuario.nome} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="cracha">Crachá</Label>
                    <Input type="text" id="cracha" name="cracha" value={usuario.cracha} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" value={usuario.email} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="senha">Senha</Label>
                    <Input type="password" id="senha" name="senha" value={usuario.senha} onChange={handleChange} required />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="perfil">Perfil</Label>
                    <Select id="perfil" name="perfil" value={usuario.perfil} onChange={handleChange} required>
                        <option value="ADMIN">Admin</option>
                        <option value="TECNICO">Técnico</option>
                    </Select>
                </FormGroup>

                <Button type="submit">Salvar Funcionário</Button>
            </Form>
        </PageContainer>
    );
}

export default UsuarioCreatePage; 