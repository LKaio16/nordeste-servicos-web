import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tipoServicoService from '../../services/tipoServicoService';
import { PageContainer, Form, FormGroup, Label, Input, Button } from '../../styles/common';

const initialServicoState = {
  descricao: ''
};

function ServicoCreatePage() {
  const navigate = useNavigate();
  const [servico, setServico] = useState(initialServicoState);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServico(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await tipoServicoService.createTipoServico(servico);
      navigate('/servicos');
    } catch (err) {
      setError(err.message || 'Falha ao criar o tipo de serviço.');
    }
  };

  return (
    <PageContainer>
      <h1>Novo Tipo de Serviço</h1>
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="descricao">Descrição</Label>
          <Input type="text" id="descricao" name="descricao" value={servico.descricao} onChange={handleChange} required />
        </FormGroup>

        <Button type="submit">Salvar Serviço</Button>
      </Form>
    </PageContainer>
  );
}

export default ServicoCreatePage; 