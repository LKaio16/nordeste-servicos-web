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

const createPeca = async (pecaData) => {
    try {
        const response = await api.post('/api/pecas-materiais', pecaData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar peça:", error.response?.data || error.message);
        throw error.response?.data || new Error("Falha ao criar a peça.");
    }
};

const checkCodigoExists = async (codigo) => {
    try {
        const response = await api.get('/api/pecas-materiais');
        const pecas = response.data;
        return pecas.some(peca => peca.codigo === codigo);
    } catch (error) {
        console.error("Erro ao verificar código da peça:", error);
        // Em caso de erro na verificação, melhor deixar o backend validar
        return false;
    }
};

export const pecaMaterialService = {
    getAllPecasMateriais,
    createPeca,
    checkCodigoExists
}; 