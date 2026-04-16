import api from './api';

export const getAllContas = async (clienteId, fornecedorId, tipo, status) => {
  const params = {};
  if (clienteId) params.clienteId = clienteId;
  if (fornecedorId) params.fornecedorId = fornecedorId;
  if (tipo) params.tipo = tipo;
  if (status) params.status = status;
  const response = await api.get('/api/contas', { params });
  return response.data;
};

export const getContasPage = async ({ clienteId, fornecedorId, tipo, status, page = 0, size = 20 } = {}) => {
  const params = { page, size };
  if (clienteId) params.clienteId = clienteId;
  if (fornecedorId) params.fornecedorId = fornecedorId;
  if (tipo) params.tipo = tipo;
  if (status) params.status = status;
  const response = await api.get('/api/contas/paged', { params });
  return response.data;
};

export const getContaById = async (id) => {
  const response = await api.get(`/api/contas/${id}`);
  return response.data;
};

export const createConta = async (data) => {
  const response = await api.post('/api/contas', data);
  return response.data;
};

export const updateConta = async (id, data) => {
  const response = await api.put(`/api/contas/${id}`, data);
  return response.data;
};

export const deleteConta = async (id) => {
  await api.delete(`/api/contas/${id}`);
};

export const marcarComoPaga = async (id, dataPagamento, formaPagamento) => {
  const response = await api.put(`/api/contas/${id}/pagar`, {
    dataPagamento: dataPagamento || new Date().toISOString().slice(0, 10),
    formaPagamento,
  });
  return response.data;
};
