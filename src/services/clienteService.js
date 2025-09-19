import api from './api';

export const getAllClientes = async () => {
    const response = await api.get('/api/clientes');
    return response.data;
};

export const getClienteById = async (id) => {
    const response = await api.get(`/api/clientes/${id}`);
    return response.data;
};

export const createCliente = async (clienteData) => {
    const response = await api.post('/api/clientes', clienteData);
    return response.data;
};

export const updateCliente = async (id, clienteData) => {
    const response = await api.put(`/api/clientes/${id}`, clienteData);
    return response.data;
};

export const deleteCliente = async (id) => {
    const response = await api.delete(`/api/clientes/${id}`);
    return response.data;
};

export const downloadClientesExcel = async () => {
    const response = await api.get('/api/clientes/download', {
        responseType: 'blob'
    });
    return response.data;
}; 