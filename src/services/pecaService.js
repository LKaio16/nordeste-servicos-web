import api from './api';

export const getAllPecas = async () => {
    const response = await api.get('/api/pecas-materiais');
    return response.data;
};

export const getPecaById = async (id) => {
    const response = await api.get(`/api/pecas-materiais/${id}`);
    return response.data;
};

export const createPeca = async (pecaData) => {
    const response = await api.post('/api/pecas-materiais', pecaData);
    return response.data;
};

export const updatePeca = async (id, pecaData) => {
    const response = await api.put(`/api/pecas-materiais/${id}`, pecaData);
    return response.data;
};

export const deletePeca = async (id) => {
    const response = await api.delete(`/api/pecas-materiais/${id}`);
    return response.data;
}; 