import api from './api';

export const getAllNotasFiscais = async (fornecedorId, clienteId, tipo) => {
  const params = {};
  if (fornecedorId) params.fornecedorId = fornecedorId;
  if (clienteId) params.clienteId = clienteId;
  if (tipo) params.tipo = tipo;
  const response = await api.get('/api/notas-fiscais', { params });
  return response.data;
};

export const getNotaFiscalById = async (id) => {
  const response = await api.get(`/api/notas-fiscais/${id}`);
  return response.data;
};

export const createNotaFiscal = async (data) => {
  const response = await api.post('/api/notas-fiscais', data);
  return response.data;
};

export const updateNotaFiscal = async (id, data) => {
  const response = await api.put(`/api/notas-fiscais/${id}`, data);
  return response.data;
};

export const deleteNotaFiscal = async (id) => {
  await api.delete(`/api/notas-fiscais/${id}`);
};
