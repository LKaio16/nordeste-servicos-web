import axios from 'axios';

export const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
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

const refreshAccessToken = () => {
    if (isRefreshing) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) {
            throw new Error('Refresh token ausente.');
        }

        const { data } = await axios.post(
            `${baseURL}/api/auth/refresh`,
            { refreshToken: refresh },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            },
        );

        const accessToken = data.accessToken;
        const newRefresh = data.refreshToken;
        if (!accessToken || !newRefresh) {
            throw new Error('Resposta de refresh inválida');
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
                clearSession();
                window.location.href = '/login';
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
            clearSession();
            window.location.href = '/login';
            return Promise.reject(refreshErr);
        }
    },
);

export default api;
