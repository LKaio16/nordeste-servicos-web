import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ToolOutlined
} from '@ant-design/icons';
import tipoServicoService from '../../services/tipoServicoService';
import {
  Card,
  Button,
  Typography,
  Space,
  message,
  Spin,
  Table,
  Popconfirm,
  Tooltip
} from 'antd';

const { Title } = Typography;

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
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  }
  
  .ant-table-thead > tr > th {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 2px solid #00529b;
    font-weight: 600;
    color: #00529b;
    padding: 16px 12px;
  }
  
  .ant-table-tbody > tr {
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #f8f9ff 0%, #e6f7ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 82, 155, 0.1);
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

function ServicosPage() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchServicos = useCallback(async () => {
    try {
      const data = await tipoServicoService.getAllTiposServico();
      setServicos(data);
    } catch (err) {
      message.error("Falha ao carregar os tipos de serviço.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchServicos();
      setIsLoading(false);
    }
    loadData();
  }, [fetchServicos]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchServicos();
    setIsRefreshing(false);
  };

  const handleEdit = (id) => {
    navigate(`/admin/servicos/editar/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await tipoServicoService.deleteTipoServico(id);
      setServicos(prev => prev.filter(s => s.id !== id));
      message.success('Serviço excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir o tipo de serviço:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao excluir o serviço. Verifique se ele não está associado a orçamentos ou ordens de serviço.';
      message.error(errorMessage);
    }
  };

  // Definição das colunas da tabela
  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      render: (text) => (
        <Typography.Text strong style={{ color: '#00529b', fontSize: '16px' }}>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <ActionButton
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
            />
          </Tooltip>
          <Popconfirm
            title="Excluir Serviço"
            description={`Deseja realmente excluir o serviço "${record.descricao}"?`}
            onConfirm={() => handleDelete(record.id)}
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
            <span>Serviços</span>
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
            onClick={() => navigate('/admin/servicos/novo')}
          >
            Novo Serviço
          </Button>
        </ActionButtons>
      </HeaderContainer>

      <StyledCard>
        <StyledTable
          columns={columns}
          dataSource={servicos}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} serviços`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          locale={{
            emptyText: 'Nenhum serviço encontrado',
          }}
        />
      </StyledCard>
    </PageContainer>
  );
}

export default ServicosPage;

