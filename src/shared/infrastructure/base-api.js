import axios from 'axios';

export const API_BASE_URL = (
    import.meta.env.VITE_FABRIC_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:3000'
).replace(/\/+$/, '');

export const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('HTTP request error:', error.response || error.message);
        return Promise.reject(error);
    }
);
