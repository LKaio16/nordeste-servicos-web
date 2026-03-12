import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, ApartmentOutlined } from '@ant-design/icons';
import * as fornecedorService from '../../services/fornecedorService';
import { Button, Space, message, Table, Popconfirm, Tooltip, Tag, Input } from 'antd';
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

const Fornecedores = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const data = await fornecedorService.getAllFornecedores(searchTerm || undefined, statusFilter || undefined);
      setList(data);
    } catch (err) {
      console.error(err);
      message.error('Não foi possível carregar os fornecedores.');
    }
  }, [searchTerm, statusFilter]);

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

  const handleDelete = async (id, nome) => {
    try {
      await fornecedorService.deleteFornecedor(id);
      setList(prev => prev.filter(x => x.id !== id));
      message.success('Fornecedor excluído com sucesso.');
    } catch (err) {
      message.error(err.response?.data?.message || 'Falha ao excluir fornecedor.');
    }
  };

  const columns = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome', render: (t) => <strong style={{ color: '#00529b' }}>{t}</strong> },
    { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj', width: 160 },
    { title: 'Cidade / Estado', key: 'cidade', render: (_, r) => `${r.cidade || ''} / ${r.estado || ''}` },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (s) => <Tag color={s === 'ATIVO' ? 'green' : 'default'}>{s}</Tag> },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Editar">
            <ActionButton type="default" size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/fornecedores/editar/${record.id}`)} />
          </Tooltip>
          <Popconfirm title="Excluir fornecedor?" description={`Excluir "${record.nome}"?`} onConfirm={() => handleDelete(record.id, record.nome)} okText="Sim" cancelText="Não" okType="danger">
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
          <Space><ApartmentOutlined /><span>Fornecedores</span></Space>
        </TitleStyled>
        <Space wrap>
          <Input.Search placeholder="Buscar por nome" allowClear onSearch={setSearchTerm} style={{ width: 200 }} />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing}>Atualizar</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/fornecedores/novo')}>Novo Fornecedor</Button>
        </Space>
      </HeaderContainer>
      <StyledTable
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        onRow={(record) => ({ onClick: () => navigate(`/admin/fornecedores/editar/${record.id}`), style: { cursor: 'pointer' } })}
        pagination={{ pageSize: 10, showTotal: (total) => `${total} fornecedores` }}
        locale={{ emptyText: 'Nenhum fornecedor cadastrado' }}
      />
    </PageContainer>
  );
};

export default Fornecedores;
