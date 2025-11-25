import axios from 'axios';

// IMPORTANTE: Este puerto (7185) es el que vimos en tus capturas del backend.
// Si cambia, actualízalo aquí.
const BASE_URL = 'https://localhost:7185/api';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Inyecta el token JWT en cada petición automáticamente
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosClient;