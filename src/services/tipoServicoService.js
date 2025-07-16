import api from './api';

const getAllTiposServico = async (searchTerm = '') => {
    try {
        const response = await api.get('/api/tipos-servico', {
            params: { searchTerm: searchTerm || null },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Tipos de Serviço:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar os Tipos de Serviço.");
    }
};

const getTipoServicoById = async (id) => {
    try {
        const response = await api.get(`/api/tipos-servico/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar tipo de serviço ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar os dados do tipo de serviço.");
    }
};

const createTipoServico = async (servicoData) => {
    try {
        const response = await api.post('/api/tipos-servico', servicoData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar tipo de serviço:', error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível criar o tipo de serviço.");
    }
};

const updateTipoServico = async (id, servicoData) => {
    try {
        const response = await api.put(`/api/tipos-servico/${id}`, servicoData);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar tipo de serviço ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível atualizar o tipo de serviço.");
    }
};

const deleteTipoServico = async (id) => {
    try {
        const response = await api.delete(`/api/tipos-servico/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao excluir tipo de serviço ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível excluir o tipo de serviço.");
    }
};


const tipoServicoService = {
    getAllTiposServico,
    getTipoServicoById,
    createTipoServico,
    updateTipoServico,
    deleteTipoServico,
};

export default tipoServicoService; 