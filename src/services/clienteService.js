import api from './api';
import { getApiErrorMessage } from '../utils/errorUtils';

export const getAllClientes = async (searchTerm, tipoCliente) => {
    try {
        const params = {};
        if (searchTerm) params.searchTerm = searchTerm;
        if (tipoCliente) params.tipoCliente = tipoCliente;
        const response = await api.get('/api/clientes', { params });
        return response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Não foi possível carregar os clientes.'));
    }
};

export const getClienteById = async (id) => {
    try {
        const response = await api.get(`/api/clientes/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Não foi possível carregar os dados do cliente.'));
    }
};

export const createCliente = async (clienteData) => {
    try {
        const response = await api.post('/api/clientes', clienteData);
        return response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Falha ao criar o cliente. Verifique os dados e tente novamente.'));
    }
};

export const updateCliente = async (id, clienteData) => {
    try {
        const response = await api.put(`/api/clientes/${id}`, clienteData);
        return response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Falha ao atualizar o cliente. Verifique os dados e tente novamente.'));
    }
};

export const deleteCliente = async (id) => {
    try {
        const response = await api.delete(`/api/clientes/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Falha ao excluir o cliente.'));
    }
};

export const downloadClientesExcel = async () => {
    try {
        const response = await api.get('/api/clientes/download', {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Falha ao baixar o arquivo Excel.'));
    }
}; 