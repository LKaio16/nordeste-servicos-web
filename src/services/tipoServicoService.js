import api from './api';

const getAllTiposServico = async () => {
    try {
        const response = await api.get('/api/tipos-servico');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar tipos de serviço:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar os tipos de serviço.");
    }
};

const getTipoServicoById = async (id) => {
    try {
        const response = await api.get(`/api/tipos-servico/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar tipo de serviço:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar o tipo de serviço.");
    }
};

const createTipoServico = async (tipoServicoData) => {
    try {
        const response = await api.post('/api/tipos-servico', tipoServicoData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar tipo de serviço:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível criar o tipo de serviço.");
    }
};

const updateTipoServico = async (id, tipoServicoData) => {
    try {
        const response = await api.put(`/api/tipos-servico/${id}`, tipoServicoData);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar tipo de serviço:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível atualizar o tipo de serviço.");
    }
};

const deleteTipoServico = async (id) => {
    try {
        const response = await api.delete(`/api/tipos-servico/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir tipo de serviço:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível excluir o tipo de serviço.");
    }
};

const tipoServicoService = {
    getAllTiposServico,
    getTipoServicoById,
    createTipoServico,
    updateTipoServico,
    deleteTipoServico
};

export default tipoServicoService;
