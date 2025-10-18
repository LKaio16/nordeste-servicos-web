import api from './api';

const getItensByOrcamento = async (orcamentoId) => {
    try {
        const response = await api.get(`/api/orcamentos/${orcamentoId}/itens`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar itens do orçamento:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar os itens do orçamento.");
    }
};

const getItemOrcamentoById = async (orcamentoId, itemId) => {
    try {
        const response = await api.get(`/api/orcamentos/${orcamentoId}/itens/${itemId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar item do orçamento:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar o item do orçamento.");
    }
};

const createItemOrcamento = async (orcamentoId, itemData) => {
    try {
        const response = await api.post(`/api/orcamentos/${orcamentoId}/itens`, itemData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar item do orçamento:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível criar o item do orçamento.");
    }
};

const updateItemOrcamento = async (orcamentoId, itemId, itemData) => {
    try {
        const response = await api.put(`/api/orcamentos/${orcamentoId}/itens/${itemId}`, itemData);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar item do orçamento:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível atualizar o item do orçamento.");
    }
};

const deleteItemOrcamento = async (orcamentoId, itemId) => {
    try {
        const response = await api.delete(`/api/orcamentos/${orcamentoId}/itens/${itemId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir item do orçamento:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível excluir o item do orçamento.");
    }
};

const itemOrcamentoService = {
    getItensByOrcamento,
    getItemOrcamentoById,
    createItemOrcamento,
    updateItemOrcamento,
    deleteItemOrcamento
};

export default itemOrcamentoService;
