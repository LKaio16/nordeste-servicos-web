import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
`;

const Logo = styled.img`
  width: 150px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #00529b;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #003d73;
  }
`;

const ErrorMessage = styled.p`
    color: #e53e3e;
    background-color: #fed7d7;
    border-radius: 6px;
    padding: 1rem;
    margin-top: 1rem;
`;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(credentials);
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Credenciais inválidas. Tente novamente.';
      setError(errorMessage);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo src={logo} alt="Nordeste Serviços Logo" />
        <Title>Acesso ao Painel</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="senha"
            placeholder="Sua senha"
            value={credentials.senha}
            onChange={handleChange}
            required
          />
          <Button type="submit">Entrar</Button>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginCard>
    </LoginContainer>
  );
}

export default Login; 