import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { SaveOutlined } from '@ant-design/icons';
import { FiArrowLeft, FiSave, FiFileText } from 'react-icons/fi';
import * as notaFiscalService from '../../services/notaFiscalService';
import * as clienteService from '../../services/clienteService';
import * as fornecedorService from '../../services/fornecedorService';
import { Card, Button, Form, Input, Select, InputNumber, Space, message, Spin } from 'antd';
import { Typography } from 'antd';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;
const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Page = styled.div`
  padding-bottom: 32px;
  animation: ${fadeIn} 0.3s ease both;
`;
const Hero = styled.div`
  background: linear-gradient(145deg, #0c2d6b 0%, #1a4494 40%, #1e5bb5 70%, #2b6fc2 100%);
  margin: -24px -32px 0;
  padding: 32px 36px 72px;
  position: relative;
  overflow: hidden;
  animation: ${slideDown} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  &::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -40px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
  }
  @media (max-width: 768px) {
    margin: -16px -16px 0;
    padding: 24px 20px 64px;
  }
`;
const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
`;
const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const BackBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
`;
const HeroInfo = styled.div`
  h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
  }
  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
  }
`;
const HeroActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;
const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const PrimaryBtn = styled(Btn)`
  background: #fff;
  color: #1a4494;
`;
const GhostBtn = styled(Btn)`
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;
const Content = styled.div`
  margin-top: -44px;
  position: relative;
  z-index: 2;
`;
const FormCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(12, 45, 107, 0.1);
  border: 1px solid rgba(26, 68, 148, 0.06);
  overflow: hidden;
  animation: ${fadeUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
`;
const SectionHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 28px;
  background: #f8faff;
  border-bottom: 1px solid #eef2f9;
  svg {
    width: 18px;
    height: 18px;
    color: #1a4494;
  }
  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #0c2d6b;
  }
`;
const FormBody = styled.div`
  padding: 24px 28px;
`;
const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-size: 13px;
    font-weight: 600;
    color: #0c2d6b;
  }
  .ant-input, .ant-input-number, .ant-select-selector {
    height: 44px !important;
    border-radius: 10px !important;
    border: 1.5px solid #dde4f0 !important;
  }
  .ant-input-number {
    width: 100%;
  }
  .ant-input, .ant-input-number-input, .ant-select-selection-item {
    font-size: 14px !important;
  }
  .ant-select-selector .ant-select-selection-item {
    line-height: 42px !important;
  }
  textarea.ant-input {
    min-height: 96px;
  }
`;
const LoadWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  flex-direction: column;
  gap: 12px;
  color: #6b86b8;
  .ant-spin-dot-item { background-color: #1a4494 !important; }
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

  if (loadingData) {
    return (
      <Page>
        <Hero>
          <HeroInner>
            <HeroInfo>
              <h1>{isEdit ? 'Editar nota fiscal' : 'Nova nota fiscal'}</h1>
            </HeroInfo>
          </HeroInner>
        </Hero>
        <Content>
          <LoadWrap>
            <Spin size="large" />
            Carregando...
          </LoadWrap>
        </Content>
      </Page>
    );
  }

  return (
    <Page>
      <Hero>
        <HeroInner>
          <HeroLeft>
            <BackBtn type="button" onClick={() => navigate('/admin/notas-fiscais')}>
              <FiArrowLeft />
            </BackBtn>
            <HeroInfo>
              <h1>{isEdit ? 'Editar nota fiscal' : 'Nova nota fiscal'}</h1>
              <p>{isEdit ? `Nota #${id}` : 'Preencha os dados para cadastrar'}</p>
            </HeroInfo>
          </HeroLeft>
          <HeroActions>
            <GhostBtn type="button" onClick={() => navigate('/admin/notas-fiscais')}>
              <FiArrowLeft /> Voltar
            </GhostBtn>
            <PrimaryBtn type="button" onClick={() => form.submit()} disabled={loading}>
              <FiSave /> {loading ? 'Salvando...' : 'Salvar'}
            </PrimaryBtn>
          </HeroActions>
        </HeroInner>
      </Hero>
      <Content>
      <FormCard>
        <SectionHead>
          <FiFileText />
          <h3>Dados da nota fiscal</h3>
        </SectionHead>
        <FormBody>
        <StyledForm form={form} layout="vertical" onFinish={onFinish}>
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
        </StyledForm>
        </FormBody>
      </FormCard>
      </Content>
    </Page>
  );
};

export default NotaFiscalForm;
