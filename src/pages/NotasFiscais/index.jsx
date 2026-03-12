import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, FilterOutlined } from '@ant-design/icons';
import * as notaFiscalService from '../../services/notaFiscalService';
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

const TIPO_OPCOES = [{ value: 'ENTRADA', label: 'Entrada' }, { value: 'SAIDA', label: 'Saída' }];

const NotasFiscais = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState(undefined);
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
      const data = await notaFiscalService.getAllNotasFiscais(filtroFornecedorId, filtroClienteId, filtroTipo);
      setList(data);
    } catch (err) {
      console.error(err);
      message.error('Não foi possível carregar as notas fiscais.');
    }
  }, [filtroFornecedorId, filtroClienteId, filtroTipo]);

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
      await notaFiscalService.deleteNotaFiscal(id);
      setList(prev => prev.filter(x => x.id !== id));
      message.success('Nota fiscal excluída com sucesso.');
    } catch (err) {
      message.error(err.response?.data?.message || 'Falha ao excluir nota.');
    }
  };

  const columns = [
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', width: 100, render: (t) => <Tag color={t === 'ENTRADA' ? 'green' : 'blue'}>{t}</Tag> },
    { title: 'Número', dataIndex: 'numeroNota', key: 'numeroNota', width: 140 },
    { title: 'Emitente', dataIndex: 'nomeEmitente', key: 'nomeEmitente', ellipsis: true, render: (t, r) => t || r.fornecedorNome || r.clienteNome || '–' },
    { title: 'Data emissão', dataIndex: 'dataEmissao', key: 'dataEmissao', width: 110, render: formatDate },
    { title: 'Valor total', dataIndex: 'valorTotal', key: 'valorTotal', width: 120, render: formatMoney },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Editar">
            <ActionButton type="default" size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/notas-fiscais/editar/${record.id}`)} />
          </Tooltip>
          <Popconfirm title="Excluir nota fiscal?" description={record.numeroNota} onConfirm={() => handleDelete(record.id)} okText="Sim" cancelText="Não" okType="danger">
            <Tooltip title="Excluir">
              <ActionButton type="default" danger size="small" icon={<DeleteOutlined />} />
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
          <Space><FileTextOutlined /><span>Notas fiscais</span></Space>
        </TitleStyled>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing}>Atualizar</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/notas-fiscais/novo')}>Nova nota</Button>
        </Space>
      </HeaderContainer>
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap align="center">
          <FilterOutlined /> <Typography.Text type="secondary">Filtros:</Typography.Text>
          <Select allowClear placeholder="Tipo" value={filtroTipo} onChange={setFiltroTipo} style={{ width: 140 }} options={TIPO_OPCOES} />
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
        onRow={(record) => ({ onClick: () => navigate(`/admin/notas-fiscais/editar/${record.id}`), style: { cursor: 'pointer' } })}
        pagination={{ pageSize: 10, showTotal: (total) => `${total} notas` }}
        locale={{ emptyText: 'Nenhuma nota fiscal cadastrada' }}
      />
    </PageContainer>
  );
};

export default NotasFiscais;
