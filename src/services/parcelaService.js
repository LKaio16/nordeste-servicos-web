import api from './api';

export const getParcelasByContaId = async (contaId) => {
  const response = await api.get(`/api/contas/${contaId}/parcelas`);
  return response.data;
};

export const gerarParcelas = async (contaId, quantidade, primeiraDataVencimento) => {
  const response = await api.post(`/api/contas/${contaId}/parcelas/gerar`, {
    quantidade,
    primeiraDataVencimento,
  });
  return response.data;
};

export const marcarParcelaComoPaga = async (contaId, parcelaId, dataPagamento) => {
  const response = await api.put(`/api/contas/${contaId}/parcelas/${parcelaId}/pagar`, {
    dataPagamento: dataPagamento || new Date().toISOString().slice(0, 10),
  });
  return response.data;
};

export const updateParcela = async (contaId, parcelaId, data) => {
  const response = await api.put(`/api/contas/${contaId}/parcelas/${parcelaId}`, data);
  return response.data;
};

export const deleteParcela = async (contaId, parcelaId) => {
  await api.delete(`/api/contas/${contaId}/parcelas/${parcelaId}`);
};

export const deleteTodasParcelas = async (contaId) => {
  await api.delete(`/api/contas/${contaId}/parcelas/todas`);
};
