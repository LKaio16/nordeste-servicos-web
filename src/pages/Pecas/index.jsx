import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ToolOutlined,
  EyeOutlined,
  DollarOutlined,
  ShopOutlined
} from '@ant-design/icons';
import * as pecaService from '../../services/pecaService';
import {
  Card,
  Button,
  Typography,
  Space,
  message,
  Spin,
  Table,
  Popconfirm,
  Tooltip,
  Tag
} from 'antd';

const { Title, Text } = Typography;

// Styled Components
const PageContainer = styled.div`
  padding: 0 24px 24px 24px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 82, 155, 0.1);
  border: none;
  overflow: hidden;
  
  .ant-card-head {
    background: linear-gradient(135deg, #00529b 0%, #003d73 100%);
    border-bottom: none;
    
    .ant-card-head-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }
  }
  
  .ant-card-body {
    padding: 0 24px 24px 24px;
  }
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
  color: #333;
`;

const TitleStyled = styled(Title)`
  color: #00529b !important;
  margin: 0 !important;
  font-weight: 700 !important;
  font-size: 28px !important;
`;

const ActionButtons = styled(Space)`
  .ant-btn {
    border-radius: 8px;
    font-weight: 500;
    height: 40px;
    padding: 0 20px;
    
    &.ant-btn-primary {
      background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
      }
    }
    
    &.ant-btn-default {
      background: white;
      border: 1px solid #d9d9d9;
      color: #333;
      
      &:hover {
        background: #f5f5f5;
        border-color: #00529b;
        color: #00529b;
      }
    }
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
  }
  
  .ant-table-thead > tr > th {
    background: #fff;
    border-bottom: 2px solid #00529b;
    font-weight: 600;
    color: #00529b;
    padding: 16px 12px;
  }
  
  .ant-table-tbody > tr {
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      background: linear-gradient(135deg, #f8f9ff 0%, #e6f7ff 100%);
      transform: translateY(-1px);
    }
  }
  
  .ant-table-tbody > tr > td {
    padding: 16px 12px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }
`;

const ActionButton = styled(Button)`
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &.ant-btn-primary {
    background: #00529b;
    border-color: #00529b;
    
    &:hover {
      background: #0066cc;
      border-color: #0066cc;
      transform: translateY(-1px);
    }
  }
  
  &.ant-btn-default {
    border-color: #d9d9d9;
    
    &:hover {
      border-color: #00529b;
      color: #00529b;
    }
  }
  
  &.ant-btn-dangerous {
    border-color: #ff4d4f;
    color: #ff4d4f;
    
    &:hover {
      background: #ff4d4f;
      border-color: #ff4d4f;
      color: white;
    }
  }
`;

const PecaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .peca-name {
    color: #00529b;
    font-weight: 600;
    font-size: 16px;
  }
  
  .peca-details {
    color: #666;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  
  .price {
    color: #00529b;
    font-weight: 600;
    font-size: 16px;
  }
  
  .stock {
    color: #666;
    font-size: 14px;
  }
`;

function PecasPage() {
  const navigate = useNavigate();
  const [pecas, setPecas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPecas = useCallback(async () => {
    try {
      const data = await pecaService.getAllPecas();
      setPecas(data);
    } catch (err) {
      console.error('Erro ao buscar peças:', err);
      message.error('Não foi possível carregar as peças.');
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchPecas();
      setIsLoading(false);
    }
    loadData();
  }, [fetchPecas]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPecas();
    setIsRefreshing(false);
  };

  const handleRowClick = (record) => {
    navigate(`/admin/pecas/detalhes/${record.id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/pecas/editar/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await pecaService.deletePeca(id);
      setPecas(prev => prev.filter(p => p.id !== id));
      message.success('Peça excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar peça:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao excluir a peça. Verifique se ela não está associada a orçamentos ou ordens de serviço.';
      message.error(errorMessage);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  // Definição das colunas da tabela
  const columns = [
    {
      title: 'Peça',
      key: 'peca',
      render: (_, record) => (
        <PecaInfo>
          <div className="peca-name">{record.descricao}</div>
          <div className="peca-details">
            {record.fabricante && <div>Fabricante: {record.fabricante}</div>}
            {record.modelo && <div>Modelo: {record.modelo}</div>}
            {record.codigo && <div>Código: {record.codigo}</div>}
          </div>
        </PecaInfo>
      ),
    },
    {
      title: 'Preço',
      dataIndex: 'preco',
      key: 'preco',
      width: 120,
      render: (preco) => (
        <PriceInfo>
          <div className="price">{formatPrice(preco)}</div>
        </PriceInfo>
      ),
    },
    {
      title: 'Estoque',
      dataIndex: 'estoque',
      key: 'estoque',
      width: 100,
      render: (estoque) => (
        <PriceInfo>
          <div className="stock">
            <Tag color={estoque > 10 ? 'green' : estoque > 5 ? 'orange' : 'red'}>
              {estoque} unidades
            </Tag>
          </div>
        </PriceInfo>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Ver detalhes">
            <ActionButton
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <ActionButton
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record.id);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Excluir Peça"
            description={`Deseja realmente excluir a peça "${record.descricao}"?`}
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            okText="Sim"
            cancelText="Não"
            okType="danger"
          >
            <Tooltip title="Excluir">
              <ActionButton
                type="default"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
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
          <Space>
            <ToolOutlined />
            <span>Peças</span>
          </Space>
        </TitleStyled>
        <ActionButtons>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isRefreshing}
          >
            Atualizar
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/pecas/novo')}
          >
            Nova Peça
          </Button>
        </ActionButtons>
      </HeaderContainer>

      <StyledCard>
        <StyledTable
          columns={columns}
          dataSource={pecas}
          rowKey="id"
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' }
          })}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} peças`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          locale={{
            emptyText: 'Nenhuma peça encontrada',
          }}
        />
      </StyledCard>
    </PageContainer>
  );
};

export default PecasPage;

