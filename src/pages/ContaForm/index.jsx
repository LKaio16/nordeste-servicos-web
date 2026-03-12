import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeftOutlined, SaveOutlined, DollarOutlined, PlusOutlined, CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as contaService from '../../services/contaService';
import * as clienteService from '../../services/clienteService';
import * as fornecedorService from '../../services/fornecedorService';
import * as parcelaService from '../../services/parcelaService';
import { Card, Button, Form, Input, Select, InputNumber, Space, message, Spin, Table, Modal, Tag, Tooltip, Popconfirm } from 'antd';
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

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th { font-weight: 600; color: #00529b; }
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
      const valorPago = values.status === 'PAGO'
        ? valor
        : (values.valorPago != null && values.valorPago !== '' ? Number(values.valorPago) : null);
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

  if (loadingData) return <PageContainer><Spin size="large" /></PageContainer>;

  return (
    <PageContainer>
      <HeaderContainer>
        <TitleStyled level={2}><Space><DollarOutlined /><span>{isEdit ? 'Editar conta' : 'Nova conta'}</span></Space></TitleStyled>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/contas')}>Voltar</Button>
      </HeaderContainer>
      <StyledCard title="Dados da conta">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Space style={{ width: '100%' }} size="middle" wrap>
            <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]} style={{ minWidth: 140 }}>
              <Select options={TIPO_OPCOES} placeholder="Tipo" />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]} style={{ minWidth: 140 }}>
              <Select
                options={STATUS_OPCOES}
                placeholder="Status"
                onChange={(v) => { if (v === 'PAGO') form.setFieldValue('valorPago', form.getFieldValue('valor')); }}
              />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="middle" wrap>
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
          </Space>
          <Form.Item name="descricao" label="Descrição" rules={[{ required: true }, { max: 500 }]}>
            <Input placeholder="Descrição da conta" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="middle" wrap>
            <Form.Item name="valor" label="Valor (R$)" rules={[{ required: true }]} style={{ minWidth: 140 }}>
              <InputNumber min={0} step={0.01} placeholder="0,00" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="valorPago" label="Valor pago (R$)" style={{ minWidth: 140 }}>
              <InputNumber min={0} step={0.01} placeholder="0,00" style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="middle" wrap>
            <Form.Item name="dataVencimento" label="Data de vencimento" rules={[{ required: true }]} style={{ minWidth: 180 }}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="dataPagamento" label="Data de pagamento" style={{ minWidth: 180 }}>
              <Input type="date" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="middle" wrap>
            <Form.Item name="categoria" label="Categoria" rules={[{ max: 100 }]} style={{ minWidth: 160 }}>
              <Input placeholder="Categoria" />
            </Form.Item>
            <Form.Item name="categoriaFinanceira" label="Categoria financeira" style={{ minWidth: 180 }}>
              <Select allowClear options={CATEGORIA_FINANCEIRA_OPCOES} placeholder="Selecione" />
            </Form.Item>
            <Form.Item name="formaPagamento" label="Forma de pagamento" style={{ minWidth: 160 }}>
              <Select allowClear options={FORMA_PAGAMENTO_OPCOES} placeholder="Selecione" />
            </Form.Item>
          </Space>
          <Form.Item name="observacoes" label="Observações" rules={[{ max: 500 }]}>
            <Input.TextArea rows={3} placeholder="Observações" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Salvar</Button>
          </Form.Item>
        </Form>
      </StyledCard>

      {exibirParcelas && (
        <>
          <StyledCard
            title="Parcelas"
            extra={
              <Space>
                {parcelas.length === 0 ? (
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalGerarOpen(true)}>
                    Gerar parcelas
                  </Button>
                ) : (
                  <>
                    <Popconfirm
                      title="Remover todas as parcelas?"
                      description="Isso não exclui a conta. Você poderá gerar novas parcelas depois."
                      onConfirm={handleRemoverTodasParcelas}
                      okText="Sim, remover"
                      cancelText="Cancelar"
                      okType="danger"
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Remover todas as parcelas
                      </Button>
                    </Popconfirm>
                  </>
                )}
              </Space>
            }
          >
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
                      <Space size="small" wrap>
                        <Tooltip title="Editar parcela">
                          <Button
                            type="default"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleOpenEditParcela(row)}
                          >
                            Editar
                          </Button>
                        </Tooltip>
                        <Tooltip title="Confirmar pagamento">
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={() => handleConfirmarPagamentoParcela(row.id)}
                          >
                            Confirmar pagamento
                          </Button>
                        </Tooltip>
                      </Space>
                    ) : (
                      <Tooltip title="Parcela paga não pode ser editada">
                        <span><Tag color="green">Pago</Tag></span>
                      </Tooltip>
                    ),
                },
              ]}
            />
          </StyledCard>

          <Modal
            title="Gerar parcelas"
            open={modalGerarOpen}
            onOk={handleGerarParcelas}
            onCancel={() => { setModalGerarOpen(false); formGerar.resetFields(); }}
            okText="Gerar"
          >
            <Form form={formGerar} layout="vertical" style={{ marginTop: 16 }}>
              <Form.Item
                name="quantidade"
                label="Quantidade de parcelas"
                rules={[{ required: true }, { type: 'number', min: 1 }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="primeiraDataVencimento"
                label="Data do primeiro vencimento"
                rules={[{ required: true }]}
              >
                <Input type="date" />
              </Form.Item>
            </Form>
            <Typography.Text type="secondary">
              O valor total da conta será dividido igualmente entre as parcelas. As datas seguintes serão mensais.
            </Typography.Text>
          </Modal>

          <Modal
            title="Editar parcela"
            open={modalEditParcelaOpen}
            onOk={handleSaveEditParcela}
            onCancel={() => { setModalEditParcelaOpen(false); setParcelaEdit(null); }}
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
    </PageContainer>
  );
};

export default ContaForm;
