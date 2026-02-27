import api from './api';

export const getAllOrdensServico = async (searchTerm = '', page = 0, size = 20) => {
    try {
        // Usa o endpoint e o parâmetro de busca definidos na API
        const response = await api.get('/api/ordens-servico', {
            params: { 
                searchTerm: searchTerm || null,
                page: page,
                size: size
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Ordens de Serviço:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar as Ordens de Serviço.");
    }
};

export const getOrdemServicoById = async (id) => {
    try {
        const response = await api.get(`/api/ordens-servico/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar Ordem de Serviço ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar os detalhes da Ordem de Serviço.");
    }
};

export const getFotosByOsId = async (osId) => {
    try {
        const response = await api.get(`/api/ordens-servico/${osId}/fotos`);
        return response.data;
    } catch (error) {
        // Um erro 404 aqui pode ser normal se não houver fotos, então não logamos como erro crítico
        if (error.response && error.response.status !== 404) {
            console.error(`Erro ao buscar fotos para a OS ${osId}:`, error.response?.data || error.message);
        }
        return []; // Retorna um array vazio em caso de erro ou se não encontrar
    }
};

export const getAssinaturaByOsId = async (osId) => {
    try {
        const response = await api.get(`/api/ordens-servico/${osId}/assinatura`);
        return response.data;
    } catch (error) {
        // Um erro 404 aqui é esperado se não houver assinatura
        if (error.response && error.response.status !== 404) {
            console.error(`Erro ao buscar assinatura para a OS ${osId}:`, error.response?.data || error.message);
        }
        return null; // Retorna null em caso de erro ou se não encontrar
    }
};

export const updateOrdemServico = async (id, osData) => {
    try {
        const response = await api.put(`/api/ordens-servico/${id}`, osData);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar Ordem de Serviço ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível atualizar a Ordem de Serviço.");
    }
};

export const createOrdemServico = async (osData) => {
    try {
        const response = await api.post('/api/ordens-servico', osData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Ordem de Serviço:', error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível criar a Ordem de Serviço.");
    }
};

export const downloadOsPdf = async (id) => {
    try {
        const response = await api.get(`/api/ordens-servico/${id}/pdf`, {
            responseType: 'blob', // Importante para lidar com arquivos
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const numeroOS = response.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || `os_${id}.pdf`;
        link.setAttribute('download', numeroOS);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erro ao baixar PDF da OS:", error);
        throw new Error("Não foi possível baixar o PDF da Ordem de Serviço.");
    }
};

export const deleteOrdemServico = async (id) => {
    try {
        const response = await api.delete(`/api/ordens-servico/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao excluir Ordem de Serviço ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível excluir a Ordem de Serviço.");
    }
};

export const uploadFoto = async (osId, payload) => {
    try {
        const response = await api.post(`/api/ordens-servico/${osId}/fotos`, payload);
        return response.data;
    } catch (error) {
        console.error(`Erro ao enviar foto para a OS ${osId}:`, error.response?.data || error.message);
        const msg = error.response?.data?.message || error.response?.data || error.message;
        throw new Error(typeof msg === 'string' ? msg : 'Não foi possível enviar a foto.');
    }
};

export const deleteFoto = async (osId, fotoId) => {
    try {
        const response = await api.delete(`/api/ordens-servico/${osId}/fotos/${fotoId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao excluir foto ${fotoId} da OS ${osId}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível excluir a foto.");
    }
}; 