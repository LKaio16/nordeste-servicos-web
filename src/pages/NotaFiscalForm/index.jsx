import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeftOutlined, SaveOutlined, FileTextOutlined } from '@ant-design/icons';
import * as notaFiscalService from '../../services/notaFiscalService';
import * as clienteService from '../../services/clienteService';
import * as fornecedorService from '../../services/fornecedorService';
import { Card, Button, Form, Input, Select, InputNumber, Space, message, Spin } from 'antd';
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

const TIPO_OPCOES = [
  { value: 'ENTRADA', label: 'Entrada' },
  { value: 'SAIDA', label: 'Saída' },
];
const FORMA_PAGAMENTO_OPCOES = [
  { value: 'BOLETO', label: 'Boleto' },
  { value: 'CARTAO', label: 'Cartão' },
  { value: 'PIX', label: 'PIX' },
  { value: 'TRANSFERENCIA', label: 'Transferência' },
];

const NotaFiscalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [clientesRes, fornecedoresRes] = await Promise.all([
          clienteService.getAllClientes(),
          fornecedorService.getAllFornecedores(),
        ]);
        setClientes(Array.isArray(clientesRes) ? clientesRes : []);
        setFornecedores(Array.isArray(fornecedoresRes) ? fornecedoresRes : []);
      } catch (e) {
        console.error(e);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (!id) {
      setLoadingData(false);
      return;
    }
    const load = async () => {
      try {
        const data = await notaFiscalService.getNotaFiscalById(id);
        form.setFieldsValue({
          tipo: data.tipo,
          fornecedorId: data.fornecedorId || undefined,
          clienteId: data.clienteId || undefined,
          nomeEmitente: data.nomeEmitente,
          cnpjEmitente: data.cnpjEmitente,
          dataEmissao: data.dataEmissao || undefined,
          numeroNota: data.numeroNota,
          valorTotal: data.valorTotal,
          formaPagamento: data.formaPagamento || undefined,
          descricao: data.descricao,
          observacoes: data.observacoes,
        });
      } catch (err) {
        message.error('Nota fiscal não encontrada.');
        navigate('/admin/notas-fiscais');
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [id, form, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const temCliente = values.clienteId != null && values.clienteId !== '';
      const temFornecedor = values.fornecedorId != null && values.fornecedorId !== '';
      const payload = {
        tipo: values.tipo,
        fornecedorId: temFornecedor && !temCliente ? values.fornecedorId : null,
        clienteId: temCliente && !temFornecedor ? values.clienteId : null,
        nomeEmitente: values.nomeEmitente || null,
        cnpjEmitente: values.cnpjEmitente || null,
        dataEmissao: values.dataEmissao,
        numeroNota: values.numeroNota,
        valorTotal: Number(values.valorTotal),
        formaPagamento: values.formaPagamento || null,
        descricao: values.descricao || null,
        observacoes: values.observacoes || null,
      };
      if (isEdit) {
        await notaFiscalService.updateNotaFiscal(id, payload);
        message.success('Nota fiscal atualizada com sucesso.');
      } else {
        await notaFiscalService.createNotaFiscal(payload);
        message.success('Nota fiscal cadastrada com sucesso.');
      }
      navigate('/admin/notas-fiscais');
    } catch (err) {
      message.error(err.response?.data?.message || (isEdit ? 'Falha ao atualizar nota fiscal.' : 'Falha ao cadastrar nota fiscal.'));
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <PageContainer><Spin size="large" /></PageContainer>;

  return (
    <PageContainer>
      <HeaderContainer>
        <TitleStyled level={2}><Space><FileTextOutlined /><span>{isEdit ? 'Editar nota fiscal' : 'Nova nota fiscal'}</span></Space></TitleStyled>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/notas-fiscais')}>Voltar</Button>
      </HeaderContainer>
      <StyledCard title="Dados da nota fiscal">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]} style={{ maxWidth: 200 }}>
            <Select options={TIPO_OPCOES} placeholder="Entrada ou Saída" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="middle" wrap>
            <Form.Item name="fornecedorId" label="Fornecedor (apenas um: cliente ou fornecedor)" style={{ minWidth: 200 }}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Selecione o fornecedor"
                options={fornecedores.map((f) => ({ value: f.id, label: f.nome || `Fornecedor #${f.id}` }))}
                onChange={() => form.setFieldValue('clienteId', undefined)}
              />
            </Form.Item>
            <Form.Item name="clienteId" label="Cliente (apenas um: cliente ou fornecedor)" style={{ minWidth: 200 }}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Selecione o cliente"
                options={clientes.map((c) => ({ value: c.id, label: c.nomeCompleto || c.nome || `Cliente #${c.id}` }))}
                onChange={() => form.setFieldValue('fornecedorId', undefined)}
              />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="middle" wrap>
            <Form.Item name="nomeEmitente" label="Nome do emitente" rules={[{ max: 200 }]} style={{ minWidth: 220 }}>
              <Input placeholder="Nome ou razão social do emitente" />
            </Form.Item>
            <Form.Item name="cnpjEmitente" label="CNPJ do emitente" rules={[{ max: 18 }]} style={{ minWidth: 180 }}>
              <Input placeholder="00.000.000/0000-00" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="middle" wrap>
            <Form.Item name="dataEmissao" label="Data de emissão" rules={[{ required: true }]} style={{ minWidth: 180 }}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="numeroNota" label="Número da nota" rules={[{ required: true }, { max: 50 }]} style={{ minWidth: 180 }}>
              <Input placeholder="Número da NF" />
            </Form.Item>
            <Form.Item name="valorTotal" label="Valor total (R$)" rules={[{ required: true }]} style={{ minWidth: 160 }}>
              <InputNumber min={0} step={0.01} placeholder="0,00" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="formaPagamento" label="Forma de pagamento" style={{ minWidth: 160 }}>
              <Select allowClear options={FORMA_PAGAMENTO_OPCOES} placeholder="Selecione" />
            </Form.Item>
          </Space>
          <Form.Item name="descricao" label="Descrição" rules={[{ max: 500 }]}>
            <Input placeholder="Descrição" />
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

export default NotaFiscalForm;
