import axios from 'axios';

export const apiBaseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
const baseURL = apiBaseURL;

const EXPIRY_SAFETY_MARGIN_MS = 10 * 1000;

const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

let isRefreshing = false;
let refreshPromise = null;

const isAuthEndpoint = (url = '') => AUTH_ENDPOINTS.some((path) => url.includes(path));

const decodeJwtPayload = (token) => {
    try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join(''),
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
};

const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;
    const expiresAtMs = payload.exp * 1000;
    return Date.now() >= expiresAtMs - EXPIRY_SAFETY_MARGIN_MS;
};

const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
};

const postRefresh = (refreshTokenValue) =>
    axios.post(
        `${baseURL}/api/auth/refresh`,
        { refreshToken: refreshTokenValue },
        {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        },
    );

const refreshAccessToken = () => {
    if (isRefreshing) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        // Outra aba (ou uma chamada concorrente) pode já ter renovado o
        // token nesse meio tempo — se o token atual já é válido, usa ele
        // em vez de gastar o refresh token (que é de uso único) à toa.
        const currentToken = localStorage.getItem('token');
        if (currentToken && !isTokenExpired(currentToken)) {
            api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
            return currentToken;
        }

        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) {
            const err = new Error('Refresh token ausente.');
            err.isAuthFailure = true;
            throw err;
        }

        let response;
        try {
            response = await postRefresh(refresh);
        } catch (err) {
            // O refresh token é rotacionado a cada uso: se outra aba renovou
            // entre o momento em que lemos e agora, o nosso já foi revogado.
            // Tenta uma vez com o valor mais recente antes de desistir.
            const latestRefresh = localStorage.getItem('refreshToken');
            if (err.response?.status === 401 && latestRefresh && latestRefresh !== refresh) {
                response = await postRefresh(latestRefresh);
            } else {
                if (err.response?.status === 401) {
                    err.isAuthFailure = true;
                }
                throw err;
            }
        }

        const { data } = response;
        const accessToken = data.accessToken;
        const newRefresh = data.refreshToken;
        if (!accessToken || !newRefresh) {
            const err = new Error('Resposta de refresh inválida');
            err.isAuthFailure = true;
            throw err;
        }

        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return accessToken;
    })().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
    });

    return refreshPromise;
};

api.interceptors.request.use(
    async (config) => {
        const url = config.url || '';

        if (isAuthEndpoint(url)) {
            return config;
        }

        let token = localStorage.getItem('token');

        if (token && isTokenExpired(token)) {
            try {
                token = await refreshAccessToken();
            } catch (refreshErr) {
                if (refreshErr.isAuthFailure) {
                    clearSession();
                    window.location.href = '/login';
                }
                return Promise.reject(refreshErr);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status !== 401 || originalRequest._retry || isAuthEndpoint(originalRequest.url || '')) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const accessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshErr) {
            if (refreshErr.isAuthFailure) {
                clearSession();
                window.location.href = '/login';
            }
            return Promise.reject(refreshErr);
        }
    },
);

export default api;
