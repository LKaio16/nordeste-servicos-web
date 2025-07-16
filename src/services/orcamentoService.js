import api from './api';

const getAllOrcamentos = async () => {
    try {
        const response = await api.get('/api/orcamentos');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Orçamentos:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar os Orçamentos.");
    }
};

const getOrcamentoById = async (id) => {
    try {
        const response = await api.get(`/api/orcamentos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar Orçamento ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar os detalhes do Orçamento.");
    }
};

const createOrcamento = async (orcamentoData) => {
    try {
        const response = await api.post('/api/orcamentos', orcamentoData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Orçamento:', error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível criar o Orçamento.");
    }
};

const updateOrcamento = async (id, orcamentoData) => {
    try {
        const response = await api.put(`/api/orcamentos/${id}`, orcamentoData);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar Orçamento ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível atualizar o Orçamento.");
    }
};

const downloadOrcamentoPdf = async (orcamentoId) => {
    try {
        const response = await api.get(`/api/orcamentos/${orcamentoId}/pdf`, {
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = `orcamento_${orcamentoId}.pdf`;
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error(`Erro ao baixar o PDF do Orçamento ${orcamentoId}:`, error);
        alert("Não foi possível baixar o PDF.");
    }
};

const deleteOrcamento = async (id) => {
    try {
        await api.delete(`/api/orcamentos/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar o Orçamento ${id}:`, error);
        throw new Error("Não foi possível deletar o Orçamento.");
    }
};

const getItensByOrcamentoId = async (orcamentoId) => {
    try {
        const response = await api.get(`/api/orcamentos/${orcamentoId}/itens`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status !== 404) {
            console.error(`Erro ao buscar itens para o Orçamento ${orcamentoId}:`, error);
        }
        return []; // Retorna array vazio em caso de erro ou se não encontrar
    }
};

const orcamentoService = {
    getAllOrcamentos,
    getOrcamentoById,
    createOrcamento,
    updateOrcamento,
    downloadOrcamentoPdf,
    getItensByOrcamentoId,
    deleteOrcamento,
};

export default orcamentoService; 