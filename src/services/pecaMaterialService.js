import api from './api';

const getAllPecasMateriais = async () => {
    try {
        const response = await api.get('/api/pecas-materiais');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Peças e Materiais:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar as Peças e Materiais.");
    }
};

export const pecaMaterialService = {
    getAllPecasMateriais,
}; 