import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeftOutlined, SaveOutlined, ApartmentOutlined } from '@ant-design/icons';
import * as fornecedorService from '../../services/fornecedorService';
import { Card, Button, Form, Input, Select, Space, message } from 'antd';
import { Typography } from 'antd';

const { Title } = Typography;
const PageContainer = styled.div`padding: 0 24px 24px; background: #f8f9fa; min-height: 100vh;`;
const HeaderContainer = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 20px; background: white; border-radius: 12px; border: 1px solid #e8e8e8;`;
const TitleStyled = styled(Title)`color: #00529b !important; margin: 0 !important; font-weight: 700 !important;`;
const StyledCard = styled(Card)`
  border-radius: 16px; border: none; overflow: hidden;
  .ant-card-head { background: linear-gradient(135deg, #00529b 0%, #003d73 100%); color: white; }
  .ant-card-body { padding: 24px; }
`;

const FornecedorCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await fornecedorService.createFornecedor(values);
      message.success('Fornecedor cadastrado com sucesso.');
      navigate('/admin/fornecedores');
    } catch (err) {
      message.error(err.response?.data?.message || 'Falha ao cadastrar fornecedor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <TitleStyled level={2}><Space><ApartmentOutlined /><span>Novo Fornecedor</span></Space></TitleStyled>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/fornecedores')}>Voltar</Button>
      </HeaderContainer>
      <StyledCard title="Dados do fornecedor">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="nome" label="Nome" rules={[{ required: true }, { max: 200 }]}>
            <Input placeholder="Nome ou razão social" />
          </Form.Item>
          <Form.Item name="cnpj" label="CNPJ" rules={[{ required: true }, { max: 18 }]}>
            <Input placeholder="00.000.000/0000-00" />
          </Form.Item>
          <Form.Item name="email" label="E-mail" rules={[{ max: 100 }, { type: 'email' }]}>
            <Input placeholder="email@exemplo.com" />
          </Form.Item>
          <Form.Item name="telefone" label="Telefone" rules={[{ max: 20 }]}>
            <Input placeholder="(00) 00000-0000" />
          </Form.Item>
          <Form.Item name="endereco" label="Endereço" rules={[{ required: true }, { max: 200 }]}>
            <Input placeholder="Rua, número" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="middle">
            <Form.Item name="cidade" label="Cidade" rules={[{ required: true }, { max: 100 }]} style={{ flex: 1 }}>
              <Input placeholder="Cidade" />
            </Form.Item>
            <Form.Item name="estado" label="UF" rules={[{ required: true }, { len: 2 }]}>
              <Input placeholder="CE" maxLength={2} style={{ width: 70 }} />
            </Form.Item>
          </Space>
          <Form.Item name="status" label="Status" initialValue="ATIVO" rules={[{ required: true }]}>
            <Select options={[{ value: 'ATIVO', label: 'Ativo' }, { value: 'INATIVO', label: 'Inativo' }]} />
          </Form.Item>
          <Form.Item name="observacoes" label="Observações" rules={[{ max: 500 }]}>
            <Input.TextArea rows={3} placeholder="Observações" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Salvar</Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </PageContainer>
  );
};

export default FornecedorCreate;
