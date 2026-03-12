import api from './api';

export const getAllUsuarios = async () => {
    const response = await api.get('/api/usuarios');
    return response.data;
};

export const getUsuarioById = async (id) => {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
};

export const createUsuario = async (usuarioData) => {
    const response = await api.post('/api/usuarios', usuarioData);
    return response.data;
};

export const updateUsuario = async (id, usuarioData) => {
    const response = await api.put(`/api/usuarios/${id}`, usuarioData);
    return response.data;
};

export const deleteUsuario = async (id) => {
    const response = await api.delete(`/api/usuarios/${id}`);
    return response.data;
};

export const uploadFotoUsuario = async (id, file) => {
    const formData = new FormData();
    formData.append('foto', file);
    const response = await api.put(`/api/usuarios/${id}/foto`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
}; 