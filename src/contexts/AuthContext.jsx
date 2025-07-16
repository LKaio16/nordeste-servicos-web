import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getUsuarioById } from '../services/usuarioService'; // Importar o serviço

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (storedUser && token) {
                const parsedUser = JSON.parse(storedUser);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                try {
                    // Busca o perfil completo para obter a foto
                    const fullProfile = await getUsuarioById(parsedUser.id);
                    setUser(fullProfile);
                } catch (error) {
                    console.error("Falha ao carregar perfil completo, usando dados locais.", error);
                    // Se a busca falhar, usa os dados do localStorage (sem foto)
                    setUser(parsedUser);
                }
            }
        };
        loadUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);

            return userData;
        } catch (error) {
            console.error("Falha no login", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 