import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, DollarOutlined, CheckOutlined, FilterOutlined } from '@ant-design/icons';
import * as contaService from '../../services/contaService';
import * as clienteService from '../../services/clienteService';
import * as fornecedorService from '../../services/fornecedorService';
import { Button, Space, message, Table, Popconfirm, Tooltip, Tag, Select, Card } from 'antd';
import { Typography } from 'antd';

const { Title } = Typography;

const PageContainer = styled.div`
  padding: 0 24px 24px 24px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleStyled = styled(Title)`
  color: #00529b !important;
  margin: 0 !important;
  font-weight: 700 !important;
  font-size: 28px !important;
`;

const StyledTable = styled(Table)`
  .ant-table { border-radius: 12px; overflow: hidden; }
  .ant-table-thead > tr > th {
    background: #fff;
    border-bottom: 2px solid #00529b;
    font-weight: 600;
    color: #00529b;
    padding: 16px 12px;
  }
  .ant-table-tbody > tr:hover {
    background: linear-gradient(135deg, #f8f9ff 0%, #e6f7ff 100%);
    transform: translateY(-1px);
  }
  .ant-table-tbody > tr > td { padding: 16px 12px; border-bottom: 1px solid #f0f0f0; }
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  &.ant-btn-primary { background: #00529b; border-color: #00529b; }
  &.ant-btn-default:hover { border-color: #00529b; color: #00529b; }
`;

const formatMoney = (v) => v != null ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) : '–';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '–';

const TIPO_OPCOES = [{ value: 'PAGAR', label: 'A pagar' }, { value: 'RECEBER', label: 'A receber' }];
const STATUS_OPCOES = [{ value: 'PENDENTE', label: 'Pendente' }, { value: 'PAGO', label: 'Pago' }, { value: 'VENCIDO', label: 'Vencido' }];

const Contas = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState(undefined);
  const [filtroStatus, setFiltroStatus] = useState(undefined);
  const [filtroClienteId, setFiltroClienteId] = useState(undefined);
  const [filtroFornecedorId, setFiltroFornecedorId] = useState(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, f] = await Promise.all([clienteService.getAllClientes(), fornecedorService.getAllFornecedores()]);
        setClientes(Array.isArray(c) ? c : []);
        setFornecedores(Array.isArray(f) ? f : []);
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await contaService.getAllContas(filtroClienteId, filtroFornecedorId, filtroTipo, filtroStatus);
      setList(data);
    } catch (err) {
      console.error(err);
      message.error('Não foi possível carregar as contas.');
    }
  }, [filtroClienteId, filtroFornecedorId, filtroTipo, filtroStatus]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    load();
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    try {
      await contaService.deleteConta(id);
      setList(prev => prev.filter(x => x.id !== id));
      message.success('Conta excluída com sucesso.');
    } catch (err) {
      message.error(err.response?.data?.message || 'Falha ao excluir conta.');
    }
  };

  const handleMarcarPaga = async (id) => {
    try {
      await contaService.marcarComoPaga(id);
      await fetchData();
      message.success('Conta marcada como paga.');
    } catch (err) {
      message.error(err.response?.data?.message || 'Falha ao marcar como paga.');
    }
  };

  const columns = [
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', width: 100, render: (t) => <Tag color={t === 'RECEBER' ? 'blue' : 'orange'}>{t === 'PAGAR' ? 'A pagar' : 'A receber'}</Tag> },
    { title: 'Descrição', dataIndex: 'descricao', key: 'descricao', ellipsis: true },
    { title: 'Cliente / Fornecedor', key: 'parte', render: (_, r) => r.clienteNome || r.fornecedorNome || '–' },
    { title: 'Valor', dataIndex: 'valor', key: 'valor', width: 120, render: formatMoney },
    { title: 'Vencimento', dataIndex: 'dataVencimento', key: 'dataVencimento', width: 110, render: formatDate },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (s) => <Tag color={s === 'PAGO' ? 'green' : s === 'VENCIDO' ? 'red' : 'default'}>{s}</Tag> },
    {
      title: 'Ações',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          {record.status !== 'PAGO' && (
            <Popconfirm
              title="Confirmar pagamento"
              description="Todas as parcelas desta conta serão marcadas como pagas. Deseja continuar?"
              onConfirm={(e) => {
                e?.stopPropagation?.();
                handleMarcarPaga(record.id);
              }}
              okText="Sim, marcar como pago"
              cancelText="Cancelar"
            >
              <span onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Marcar como paga">
                  <ActionButton type="default" size="small" icon={<CheckOutlined />} />
                </Tooltip>
              </span>
            </Popconfirm>
          )}
          <Tooltip title="Editar">
            <ActionButton type="default" size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); navigate(`/admin/contas/editar/${record.id}`); }} />
          </Tooltip>
          <Popconfirm title="Excluir conta?" description={record.descricao} onConfirm={(e) => { e?.stopPropagation?.(); handleDelete(record.id); }} okText="Sim" cancelText="Não" okType="danger">
            <Tooltip title="Excluir">
              <ActionButton type="default" danger size="small" icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <HeaderContainer>
        <TitleStyled level={2}>
          <Space><DollarOutlined /><span>Contas a pagar e receber</span></Space>
        </TitleStyled>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing}>Atualizar</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/contas/novo')}>Nova conta</Button>
        </Space>
      </HeaderContainer>
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap align="center">
          <FilterOutlined /> <Typography.Text type="secondary">Filtros:</Typography.Text>
          <Select allowClear placeholder="Tipo" value={filtroTipo} onChange={setFiltroTipo} style={{ width: 140 }} options={TIPO_OPCOES} />
          <Select allowClear placeholder="Status" value={filtroStatus} onChange={setFiltroStatus} style={{ width: 140 }} options={STATUS_OPCOES} />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Cliente"
            value={filtroClienteId}
            onChange={(v) => { setFiltroClienteId(v); if (v) setFiltroFornecedorId(undefined); }}
            style={{ width: 220 }}
            options={clientes.map((c) => ({ value: c.id, label: c.nomeCompleto || c.nome || `Cliente #${c.id}` }))}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Fornecedor"
            value={filtroFornecedorId}
            onChange={(v) => { setFiltroFornecedorId(v); if (v) setFiltroClienteId(undefined); }}
            style={{ width: 220 }}
            options={fornecedores.map((f) => ({ value: f.id, label: f.nome || `Fornecedor #${f.id}` }))}
          />
        </Space>
      </Card>
      <StyledTable
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        onRow={(record) => ({
          onClick: (e) => {
            if (e.target.closest('button') || e.target.closest('.ant-popover')) return;
            navigate(`/admin/contas/editar/${record.id}`);
          },
          style: { cursor: 'pointer' },
        })}
        pagination={{ pageSize: 10, showTotal: (total) => `${total} contas` }}
        locale={{ emptyText: 'Nenhuma conta cadastrada' }}
      />
    </PageContainer>
  );
};

export default Contas;
