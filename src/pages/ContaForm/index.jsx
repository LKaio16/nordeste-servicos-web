import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiArrowLeft, FiSave, FiDollarSign, FiPlus, FiCheck, FiEdit2, FiTrash2, FiLayers } from 'react-icons/fi';
import * as contaService from '../../services/contaService';
import * as clienteService from '../../services/clienteService';
import * as fornecedorService from '../../services/fornecedorService';
import * as parcelaService from '../../services/parcelaService';
import { Form, Input, Select, InputNumber, message, Spin, Table, Modal, Tag, Tooltip, Popconfirm, Button, Row, Col } from 'antd';

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
  transition: all 0.15s;
  flex-shrink: 0;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  svg {
    width: 18px;
    height: 18px;
  }
`;

const HeroInfo = styled.div`
  h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
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
  animation: ${fadeUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
`;

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  white-space: nowrap;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PrimaryBtn = styled(Btn)`
  background: #fff;
  color: #1a4494;
  &:hover:not(:disabled) {
    background: #f0f7ff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const GhostBtn = styled(Btn)`
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Content = styled.div`
  margin-top: -44px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 18px;
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
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 18px 28px;
  background: #f8faff;
  border-bottom: 1px solid #eef2f9;
`;

const SectionHeadTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  .ant-input,
  .ant-select-selector {
    height: 44px !important;
    font-size: 14px;
    border: 1.5px solid #dde4f0 !important;
    border-radius: 10px !important;
    &:hover {
      border-color: #1a4494 !important;
    }
    &:focus,
    &.ant-input-focused {
      border-color: #1a4494 !important;
      box-shadow: 0 0 0 3px rgba(26, 68, 148, 0.08) !important;
    }
  }
  textarea.ant-input {
    min-height: 100px;
    height: auto !important;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .ant-select-selector {
    .ant-select-selection-item {
      line-height: 42px !important;
    }
  }
  .ant-select-focused .ant-select-selector {
    border-color: #1a4494 !important;
    box-shadow: 0 0 0 3px rgba(26, 68, 148, 0.08) !important;
  }
  .ant-input-number {
    width: 100%;
    border-radius: 10px;
    border: 1.5px solid #dde4f0 !important;
  }
  .ant-input-number-input {
    height: 42px;
  }
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
  }
  .ant-table-thead > tr > th {
    background: #f8faff !important;
    border-bottom: 2px solid #eef2f9 !important;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #6b86b8 !important;
  }
  .ant-table-tbody > tr:hover > td {
    background: #f8faff !important;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f5f8fd;
  }
`;

const LoadWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  .ant-spin-dot-item {
    background-color: #1a4494 !important;
  }
`;

const TIPO_OPCOES = [
  { value: 'PAGAR', label: 'A pagar' },
  { value: 'RECEBER', label: 'A receber' },
];
const STATUS_OPCOES = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGO', label: 'Pago' },
  { value: 'VENCIDO', label: 'Vencido' },
];
const CATEGORIA_FINANCEIRA_OPCOES = [
  { value: 'OPERACIONAL', label: 'Operacional' },
  { value: 'INVESTIMENTO', label: 'Investimento' },
  { value: 'FINANCIAMENTO', label: 'Financiamento' },
];
const FORMA_PAGAMENTO_OPCOES = [
  { value: 'BOLETO', label: 'Boleto' },
  { value: 'CARTAO', label: 'Cartão' },
  { value: 'PIX', label: 'PIX' },
  { value: 'TRANSFERENCIA', label: 'Transferência' },
];
const FORMAS_COM_PARCELAS = ['BOLETO', 'CARTAO', 'PIX'];

const ContaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [parcelas, setParcelas] = useState([]);
  const [loadingParcelas, setLoadingParcelas] = useState(false);
  const [modalGerarOpen, setModalGerarOpen] = useState(false);
  const [formGerar] = Form.useForm();
  const [modalEditParcelaOpen, setModalEditParcelaOpen] = useState(false);
  const [parcelaEdit, setParcelaEdit] = useState(null);
  const [formEditParcela] = Form.useForm();
  const formaPagamento = Form.useWatch('formaPagamento', form);
  const exibirParcelas = isEdit && FORMAS_COM_PARCELAS.includes(formaPagamento);

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
      form.setFieldsValue({
        tipo: 'PAGAR',
        status: 'PENDENTE',
        valorPago: undefined,
        dataPagamento: undefined,
      });
      return;
    }
    const load = async () => {
      try {
        const data = await contaService.getContaById(id);
        form.setFieldsValue({
          tipo: data.tipo,
          clienteId: data.clienteId || undefined,
          fornecedorId: data.fornecedorId || undefined,
          descricao: data.descricao,
          valor: data.valor,
          valorPago: data.valorPago ?? undefined,
          dataVencimento: data.dataVencimento || undefined,
          dataPagamento: data.dataPagamento || undefined,
          status: data.status,
          categoria: data.categoria,
          categoriaFinanceira: data.categoriaFinanceira || undefined,
          formaPagamento: data.formaPagamento || undefined,
          observacoes: data.observacoes,
        });
      } catch (err) {
        message.error('Conta não encontrada.');
        navigate('/admin/contas');
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [id, form, navigate]);

  const fetchParcelas = useCallback(async () => {
    if (!id) return;
    setLoadingParcelas(true);
    try {
      const data = await parcelaService.getParcelasByContaId(id);
      setParcelas(Array.isArray(data) ? data : []);
    } catch (e) {
      setParcelas([]);
    } finally {
      setLoadingParcelas(false);
    }
  }, [id]);

  useEffect(() => {
    if (exibirParcelas && !loadingData) fetchParcelas();
  }, [exibirParcelas, loadingData, fetchParcelas]);

  const handleGerarParcelas = async () => {
    try {
      const { quantidade, primeiraDataVencimento } = await formGerar.validateFields();
      await parcelaService.gerarParcelas(id, quantidade, primeiraDataVencimento);
      message.success(`${quantidade} parcela(s) criada(s).`);
      setModalGerarOpen(false);
      formGerar.resetFields();
      fetchParcelas();
      const contaAtual = await contaService.getContaById(id);
      form.setFieldsValue({
        valorPago: contaAtual.valorPago ?? undefined,
        dataPagamento: contaAtual.dataPagamento || undefined,
        status: contaAtual.status,
      });
    } catch (err) {
      if (err.errorFields) return;
      message.error(err.response?.data?.message || 'Falha ao gerar parcelas.');
    }
  };

  const handleConfirmarPagamentoParcela = async (parcelaId) => {
    try {
      await parcelaService.marcarParcelaComoPaga(id, parcelaId);
      message.success('Parcela marcada como paga.');
      fetchParcelas();
      const contaAtual = await contaService.getContaById(id);
      form.setFieldsValue({
        valorPago: contaAtual.valorPago ?? undefined,
        dataPagamento: contaAtual.dataPagamento || undefined,
        status: contaAtual.status,
      });
    } catch (err) {
      message.error(err.response?.data?.message || 'Falha ao confirmar pagamento.');
    }
  };

  const handleRemoverTodasParcelas = async () => {
    try {
      await parcelaService.deleteTodasParcelas(id);
      message.success('Todas as parcelas foram removidas.');
      fetchParcelas();
      form.setFieldsValue({
        valorPago: undefined,
        dataPagamento: undefined,
        status: 'PENDENTE',
      });
    } catch (err) {
      message.error(err.response?.data?.message || 'Falha ao remover parcelas.');
    }
  };

  const handleOpenEditParcela = (row) => {
    setParcelaEdit(row);
    formEditParcela.setFieldsValue({
      numeroParcela: row.numeroParcela,
      valor: row.valor,
      dataVencimento: row.dataVencimento || undefined,
    });
    setModalEditParcelaOpen(true);
  };

  const handleSaveEditParcela = async () => {
    try {
      const values = await formEditParcela.validateFields();
      await parcelaService.updateParcela(id, parcelaEdit.id, {
        numeroParcela: values.numeroParcela,
        valor: values.valor,
        dataVencimento: values.dataVencimento,
      });
      message.success('Parcela atualizada.');
      setModalEditParcelaOpen(false);
      setParcelaEdit(null);
      fetchParcelas();
    } catch (err) {
      if (err.errorFields) return;
      message.error(err.response?.data?.message || 'Falha ao atualizar parcela.');
    }
  };

  const formatMoney = (v) => (v != null ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) : '–');
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : '–');

  const doSubmit = async (values) => {
    setLoading(true);
    try {
      const temCliente = values.clienteId != null && values.clienteId !== '';
      const temFornecedor = values.fornecedorId != null && values.fornecedorId !== '';
      const valor = Number(values.valor);
      const valorPago =
        values.status === 'PAGO'
          ? valor
          : values.valorPago != null && values.valorPago !== ''
            ? Number(values.valorPago)
            : null;
      const payload = {
        tipo: values.tipo,
        clienteId: temCliente && !temFornecedor ? values.clienteId : null,
        fornecedorId: temFornecedor && !temCliente ? values.fornecedorId : null,
        descricao: values.descricao,
        valor,
        valorPago,
        dataVencimento: values.dataVencimento,
        dataPagamento: values.dataPagamento || null,
        status: values.status,
        categoria: values.categoria || null,
        categoriaFinanceira: values.categoriaFinanceira || null,
        formaPagamento: values.formaPagamento || null,
        observacoes: values.observacoes || null,
      };
      if (isEdit) {
        await contaService.updateConta(id, payload);
        message.success('Conta atualizada com sucesso.');
        const contaAtual = await contaService.getContaById(id);
        form.setFieldsValue({
          valorPago: contaAtual.valorPago ?? undefined,
          dataPagamento: contaAtual.dataPagamento || undefined,
          status: contaAtual.status,
        });
        await fetchParcelas();
      } else {
        await contaService.createConta(payload);
        message.success('Conta cadastrada com sucesso.');
        navigate('/admin/contas');
      }
    } catch (err) {
      message.error(err.response?.data?.message || (isEdit ? 'Falha ao atualizar conta.' : 'Falha ao cadastrar conta.'));
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (isEdit && values.status === 'PAGO' && parcelas.length > 0) {
      Modal.confirm({
        title: 'Confirmar pagamento',
        content: 'Ao marcar a conta como Paga, todas as parcelas serão marcadas como pagas. Deseja continuar?',
        okText: 'Sim, marcar tudo como pago',
        cancelText: 'Cancelar',
        onOk: async () => {
          await doSubmit(values);
        },
      });
      return;
    }
    await doSubmit(values);
  };

  if (loadingData) {
    return (
      <Page>
        <LoadWrap>
          <Spin size="large" />
        </LoadWrap>
      </Page>
    );
  }

  return (
    <Page>
      <Hero>
        <HeroInner>
          <HeroLeft>
            <BackBtn type="button" onClick={() => navigate('/admin/contas')} aria-label="Voltar">
              <FiArrowLeft />
            </BackBtn>
            <HeroInfo>
              <h1>{isEdit ? 'Editar conta' : 'Nova conta'}</h1>
              <p>Contas a pagar e receber</p>
            </HeroInfo>
          </HeroLeft>
          <HeroActions>
            <GhostBtn type="button" onClick={() => navigate('/admin/contas')}>
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
            <SectionHeadTitle>
              <FiDollarSign />
              <h3>Dados da conta</h3>
            </SectionHeadTitle>
          </SectionHead>
          <FormBody>
            <StyledForm form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
                    <Select options={TIPO_OPCOES} placeholder="Tipo" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select
                      options={STATUS_OPCOES}
                      placeholder="Status"
                      onChange={(v) => {
                        if (v === 'PAGO') form.setFieldValue('valorPago', form.getFieldValue('valor'));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="clienteId" label="Cliente (apenas um: cliente ou fornecedor)">
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      placeholder="Selecione o cliente"
                      options={clientes.map((c) => ({ value: c.id, label: c.nomeCompleto || c.nome || `Cliente #${c.id}` }))}
                      onChange={() => form.setFieldValue('fornecedorId', undefined)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="fornecedorId" label="Fornecedor (apenas um: cliente ou fornecedor)">
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      placeholder="Selecione o fornecedor"
                      options={fornecedores.map((f) => ({ value: f.id, label: f.nome || `Fornecedor #${f.id}` }))}
                      onChange={() => form.setFieldValue('clienteId', undefined)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="descricao" label="Descrição" rules={[{ required: true }, { max: 500 }]}>
                    <Input placeholder="Descrição da conta" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="valor" label="Valor (R$)" rules={[{ required: true }]}>
                    <InputNumber min={0} step={0.01} placeholder="0,00" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="valorPago" label="Valor pago (R$)">
                    <InputNumber min={0} step={0.01} placeholder="0,00" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="dataVencimento" label="Data de vencimento" rules={[{ required: true }]}>
                    <Input type="date" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="dataPagamento" label="Data de pagamento">
                    <Input type="date" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="categoria" label="Categoria" rules={[{ max: 100 }]}>
                    <Input placeholder="Categoria" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="categoriaFinanceira" label="Categoria financeira">
                    <Select allowClear options={CATEGORIA_FINANCEIRA_OPCOES} placeholder="Selecione" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="formaPagamento" label="Forma de pagamento">
                    <Select allowClear options={FORMA_PAGAMENTO_OPCOES} placeholder="Selecione" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="observacoes" label="Observações" rules={[{ max: 500 }]}>
                    <Input.TextArea rows={3} placeholder="Observações" />
                  </Form.Item>
                </Col>
              </Row>
            </StyledForm>
          </FormBody>
        </FormCard>

        {exibirParcelas && (
          <>
            <FormCard>
              <SectionHead>
                <SectionHeadTitle>
                  <FiLayers />
                  <h3>Parcelas</h3>
                </SectionHeadTitle>
                <div>
                  {parcelas.length === 0 ? (
                    <Button type="primary" icon={<FiPlus />} onClick={() => setModalGerarOpen(true)}>
                      Gerar parcelas
                    </Button>
                  ) : (
                    <Popconfirm
                      title="Remover todas as parcelas?"
                      description="Isso não exclui a conta. Você poderá gerar novas parcelas depois."
                      onConfirm={handleRemoverTodasParcelas}
                      okText="Sim, remover"
                      cancelText="Cancelar"
                      okType="danger"
                    >
                      <Button danger icon={<FiTrash2 />}>
                        Remover todas as parcelas
                      </Button>
                    </Popconfirm>
                  )}
                </div>
              </SectionHead>
              <FormBody style={{ paddingTop: 0 }}>
                <StyledTable
                  dataSource={parcelas}
                  rowKey="id"
                  loading={loadingParcelas}
                  pagination={false}
                  locale={{ emptyText: 'Nenhuma parcela. Clique em "Gerar parcelas" para dividir em boletos.' }}
                  columns={[
                    { title: 'Parcela', dataIndex: 'numeroParcela', key: 'numeroParcela', width: 80, render: (n) => `${n}ª` },
                    { title: 'Valor', dataIndex: 'valor', key: 'valor', width: 120, render: formatMoney },
                    { title: 'Vencimento', dataIndex: 'dataVencimento', key: 'dataVencimento', width: 120, render: formatDate },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      width: 100,
                      render: (s) => <Tag color={s === 'PAGO' ? 'green' : 'default'}>{s === 'PAGO' ? 'Pago' : 'Pendente'}</Tag>,
                    },
                    {
                      title: 'Data pagamento',
                      dataIndex: 'dataPagamento',
                      key: 'dataPagamento',
                      width: 120,
                      render: formatDate,
                    },
                    {
                      title: 'Ações',
                      key: 'actions',
                      width: 260,
                      render: (_, row) =>
                        row.status === 'PENDENTE' ? (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <Tooltip title="Editar parcela">
                              <Button type="default" size="small" icon={<FiEdit2 />} onClick={() => handleOpenEditParcela(row)}>
                                Editar
                              </Button>
                            </Tooltip>
                            <Tooltip title="Confirmar pagamento">
                              <Button
                                type="primary"
                                size="small"
                                icon={<FiCheck />}
                                onClick={() => handleConfirmarPagamentoParcela(row.id)}
                              >
                                Confirmar pagamento
                              </Button>
                            </Tooltip>
                          </div>
                        ) : (
                          <Tooltip title="Parcela paga não pode ser editada">
                            <span>
                              <Tag color="green">Pago</Tag>
                            </span>
                          </Tooltip>
                        ),
                    },
                  ]}
                />
              </FormBody>
            </FormCard>

            <Modal
              title="Gerar parcelas"
              open={modalGerarOpen}
              onOk={handleGerarParcelas}
              onCancel={() => {
                setModalGerarOpen(false);
                formGerar.resetFields();
              }}
              okText="Gerar"
            >
              <Form form={formGerar} layout="vertical" style={{ marginTop: 16 }}>
                <Form.Item name="quantidade" label="Quantidade de parcelas" rules={[{ required: true }, { type: 'number', min: 1 }]}>
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="primeiraDataVencimento" label="Data do primeiro vencimento" rules={[{ required: true }]}>
                  <Input type="date" />
                </Form.Item>
              </Form>
              <p style={{ color: '#6b86b8', margin: 0 }}>
                O valor total da conta será dividido igualmente entre as parcelas. As datas seguintes serão mensais.
              </p>
            </Modal>

            <Modal
              title="Editar parcela"
              open={modalEditParcelaOpen}
              onOk={handleSaveEditParcela}
              onCancel={() => {
                setModalEditParcelaOpen(false);
                setParcelaEdit(null);
              }}
              okText="Salvar"
            >
              <Form form={formEditParcela} layout="vertical" style={{ marginTop: 16 }}>
                <Form.Item name="numeroParcela" label="Número da parcela" rules={[{ required: true }, { type: 'number', min: 1 }]}>
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="valor" label="Valor (R$)" rules={[{ required: true }]}>
                  <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="dataVencimento" label="Data de vencimento" rules={[{ required: true }]}>
                  <Input type="date" />
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </Content>
    </Page>
  );
};

export default ContaForm;
