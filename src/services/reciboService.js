import api from './api';

const getAllRecibos = async () => {
    try {
        const response = await api.get('/api/recibos');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Recibos:", error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar os Recibos.");
    }
};

const getReciboById = async (id) => {
    try {
        const response = await api.get(`/api/recibos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar Recibo ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível carregar os detalhes do Recibo.");
    }
};

const createRecibo = async (reciboData) => {
    try {
        const response = await api.post('/api/recibos', reciboData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Recibo:', error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível criar o Recibo.");
    }
};

const generateReciboPdf = async (reciboData) => {
    try {
        const response = await api.post('/api/recibos/pdf', reciboData, {
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = `recibo_${Date.now()}.pdf`;
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

        return true;
    } catch (error) {
        console.error('Erro ao gerar PDF do Recibo:', error.response?.data || error.message);
        throw error.response?.data || new Error("Não foi possível gerar o PDF do Recibo.");
    }
};

const downloadReciboPdf = async (reciboId) => {
    try {
        const response = await api.get(`/api/recibos/${reciboId}/pdf`, {
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = `recibo_${reciboId}.pdf`;
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
        console.error(`Erro ao baixar o PDF do Recibo ${reciboId}:`, error);
        throw error.response?.data || new Error("Não foi possível baixar o PDF.");
    }
};

const deleteRecibo = async (id) => {
    try {
        await api.delete(`/api/recibos/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar o Recibo ${id}:`, error);
        throw new Error("Não foi possível deletar o Recibo.");
    }
};

const reciboService = {
    getAllRecibos,
    getReciboById,
    createRecibo,
    generateReciboPdf,
    downloadReciboPdf,
    deleteRecibo,
};

export default reciboService;

