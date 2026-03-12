import api from './api';

export const getAllFornecedores = async (searchTerm, status) => {
  const params = {};
  if (searchTerm) params.searchTerm = searchTerm;
  if (status) params.status = status;
  const response = await api.get('/api/fornecedores', { params });
  return response.data;
};

export const getFornecedorById = async (id) => {
  const response = await api.get(`/api/fornecedores/${id}`);
  return response.data;
};

export const createFornecedor = async (data) => {
  const response = await api.post('/api/fornecedores', data);
  return response.data;
};

export const updateFornecedor = async (id, data) => {
  const response = await api.put(`/api/fornecedores/${id}`, data);
  return response.data;
};

export const deleteFornecedor = async (id) => {
  await api.delete(`/api/fornecedores/${id}`);
};
