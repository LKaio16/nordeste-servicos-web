import axios from 'axios';

export const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const baseURL = apiBaseURL;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
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

        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const url = originalRequest.url || '';
        if (url.includes('/api/auth/login') || url.includes('/api/auth/refresh')) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) {
            processQueue(error, null);
            isRefreshing = false;
            return Promise.reject(error);
        }

        try {
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
            processQueue(null, accessToken);
            isRefreshing = false;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshErr) {
            processQueue(refreshErr, null);
            isRefreshing = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
            window.location.href = '/login';
            return Promise.reject(refreshErr);
        }
    },
);

export default api;
