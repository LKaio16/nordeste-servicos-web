import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import api, { apiBaseURL } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getUsuarioById } from '../services/usuarioService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const parsedUser = JSON.parse(storedUser);
                try {
                    const fullProfile = await getUsuarioById(parsedUser.id);
                    setUser(fullProfile);
                } catch (error) {
                    console.error('Falha ao recarregar perfil, usando dados locais.', error);
                    setUser(parsedUser);
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            const accessToken = response.data.accessToken ?? response.data.token;
            const refreshToken = response.data.refreshToken ?? '';
            const { accessToken: _a, refreshToken: _r, token: _t, ...userData } = response.data;

            if (userData.perfil !== 'ADMIN') {
                throw new Error('Acesso negado. Apenas administradores podem entrar.');
            }

            if (!accessToken) {
                throw new Error('Resposta de login sem accessToken.');
            }

            localStorage.setItem('token', accessToken);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            const fullProfile = await getUsuarioById(userData.id);

            setUser(fullProfile);

            const userToStore = { ...fullProfile };
            delete userToStore.fotoPerfil;
            localStorage.setItem('user', JSON.stringify(userToStore));

            return fullProfile;
        } catch (error) {
            console.error('Falha no login', error);
            setIsLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        const refresh = localStorage.getItem('refreshToken');
        try {
            await axios.post(
                `${apiBaseURL}/api/auth/logout`,
                refresh ? { refreshToken: refresh } : {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                },
            );
        } catch (_) {
            /* ignora falha de rede */
        }
        setUser(null);
        setIsLoading(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
