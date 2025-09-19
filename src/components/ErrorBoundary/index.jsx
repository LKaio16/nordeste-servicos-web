import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #e03131;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #495057;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  background-color: #00529b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #003d73;
  }
`;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Atualiza o state para mostrar a UI de erro
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log do erro para debugging
        console.error('ErrorBoundary capturou um erro:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleRetry = () => {
        // Limpa o estado de erro e recarrega a página
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorContainer>
                    <ErrorTitle>Ops! Algo deu errado</ErrorTitle>
                    <ErrorMessage>
                        Ocorreu um erro inesperado. Isso pode ter sido causado por um problema temporário
                        ou uma falha na aplicação. Tente recarregar a página.
                    </ErrorMessage>
                    <RetryButton onClick={this.handleRetry}>
                        Recarregar Página
                    </RetryButton>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ marginTop: '2rem', textAlign: 'left' }}>
                            <summary>Detalhes do erro (desenvolvimento)</summary>
                            <pre style={{
                                background: '#f1f3f4',
                                padding: '1rem',
                                borderRadius: '4px',
                                overflow: 'auto',
                                fontSize: '0.9rem'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </ErrorContainer>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
