import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getUsuarioById } from '../services/usuarioService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Adiciona o estado de loading
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const parsedUser = JSON.parse(storedUser);
                try {
                    // Tenta buscar o perfil mais recente para obter a foto
                    const fullProfile = await getUsuarioById(parsedUser.id);
                    setUser(fullProfile);
                } catch (error) {
                    console.error("Falha ao recarregar perfil, usando dados locais.", error);
                    // Em caso de falha (ex: offline), usa os dados do localStorage
                    setUser(parsedUser);
                }
            }
            setIsLoading(false); // Finaliza o carregamento
        };
        loadUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            const { token, ...userData } = response.data;

            // Adiciona a verificação de perfil no frontend
            if (userData.perfil !== 'ADMIN') {
                throw new Error("Acesso negado. Apenas administradores podem entrar.");
            }

            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Busca o perfil completo para ter todos os dados
            const fullProfile = await getUsuarioById(userData.id);
            
            // Salva o perfil completo no estado
            setUser(fullProfile);

            // Salva no localStorage uma versão SEM a foto para não sobrecarregar
            const userToStore = { ...fullProfile };
            delete userToStore.fotoPerfil;
            localStorage.setItem('user', JSON.stringify(userToStore));

            return fullProfile;
        } catch (error) {
            console.error("Falha no login", error);
            // Propaga o erro para ser tratado na UI
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoading(false);
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
        isLoading, // Expõe o estado de loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 