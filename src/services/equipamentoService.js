import api from './api';

export const getAllEquipamentos = async () => {
    const response = await api.get('/api/equipamentos');
    return response.data;
};

export const getEquipamentoById = async (id) => {
    const response = await api.get(`/api/equipamentos/${id}`);
    return response.data;
};

export const createEquipamento = async (equipamentoData) => {
    const response = await api.post('/api/equipamentos', equipamentoData);
    return response.data;
};

export const updateEquipamento = async (id, equipamentoData) => {
    const response = await api.put(`/api/equipamentos/${id}`, equipamentoData);
    return response.data;
};

export const deleteEquipamento = async (id) => {
    const response = await api.delete(`/api/equipamentos/${id}`);
    return response.data;
}; 