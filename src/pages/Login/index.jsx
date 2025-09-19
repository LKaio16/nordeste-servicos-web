import React, { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import AuthContext from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Title, FormGroup, Label, Input, Button } from '../../styles/common';
import logo from '../../assets/logo.png';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const BrandSection = styled.div`
  flex: 1;
  background: linear-gradient(45deg, #004e92, #000428);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 15s infinite linear;
  }

  @media (max-width: 800px) {
    flex: 1;
    justify-content: center;
    padding: 1rem;
  }
`;

const Logo = styled.img`
  width: 380px;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 800px) {
    width: 280px;
    margin-bottom: 0.5rem;
  }
`;

const BrandTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  animation: ${fadeIn} 0.8s ease-out 0.1s;
  animation-fill-mode: backwards;

  @media (max-width: 800px) {
    font-size: 1.8rem;
  }
`;

const BrandSubtitle = styled.p`
    font-size: 1rem;
    margin-top: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    animation: ${fadeIn} 0.8s ease-out 0.2s;
    animation-fill-mode: backwards;

  @media (max-width: 800px) {
      font-size: 0.9rem;
  }
`;

const FormSection = styled.div`
  flex: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f8f9fa;
  
  @media (max-width: 800px) {
    flex: 2;
  }
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.6s ease-out 0.3s;
  animation-fill-mode: backwards;
`;

const MobileLogo = styled.img`
    display: none;
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  color: #102a43;
`;

const StyledFormGroup = styled(FormGroup)`
    text-align: left;
    margin-bottom: 1.25rem;
`;

const StyledInput = styled(Input)`
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.2s ease-in-out;

    &:focus {
        border-color: #00529b;
        box-shadow: 0 0 0 3px rgba(0, 82, 155, 0.15);
    }
`;

const StyledButton = styled(Button)`
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    background-color: #00529b;
    transition: all 0.2s ease-in-out;
    
    &:hover {
        background-color: #003d73;
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
`;

const ErrorMessage = styled.p`
    color: #e03131;
    text-align: center;
    margin-bottom: 1.5rem;
`;

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, senha });
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);

      // Tratamento mais robusto de erros
      if (err.response) {
        // Erro de resposta do servidor
        if (err.response.status === 401) {
          setError('Email ou senha incorretos. Verifique suas credenciais.');
        } else if (err.response.status === 403) {
          setError('Acesso negado. Entre em contato com o administrador.');
        } else if (err.response.data && typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Erro no servidor. Tente novamente mais tarde.');
        }
      } else if (err.request) {
        // Erro de rede
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (err.message) {
        // Erro lançado pelo AuthContext ou outros
        setError(err.message);
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <BrandSection>
        <Logo src={logo} alt="Nordeste Serviços Logo" />
        {/* <BrandTitle>Nordeste Serviços</BrandTitle> */}
        <BrandSubtitle>Plataforma de Gestão de Serviços</BrandSubtitle>
      </BrandSection>
      <FormSection>
        <LoginForm onSubmit={handleLogin}>
          <StyledTitle>Bem-vindo de volta</StyledTitle>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <StyledFormGroup>
            <Label htmlFor="email">Email</Label>
            <StyledInput
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="seuemail@exemplo.com"
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <Label htmlFor="password">Senha</Label>
            <StyledInput
              type="password"
              id="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Sua senha"
            />
          </StyledFormGroup>
          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </StyledButton>
        </LoginForm>
      </FormSection>
    </LoginContainer>
  );
}

export default Login; 
