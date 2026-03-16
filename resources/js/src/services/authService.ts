import axios from 'axios';
import { LoginResponse } from '../types/auth';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🔑 Clave para guardar token en localStorage
const TOKEN_KEY = 'user_token';

// 🔑 Variable para guardar el token en memoria
let userToken: string | null = localStorage.getItem(TOKEN_KEY);

// 💻 Login (no se toca)
export const login = async (
    documento: string,
    clave: string
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', { documento, clave });

    // Guardamos el token dinámico en memoria y en localStorage
    if (response.data.access_token) {
        userToken = response.data.access_token;
        localStorage.setItem(TOKEN_KEY, userToken);
    }

    return response.data;
};

// 🔑 Función para obtener el token actual (memoria o localStorage)
export const getUserToken = (): string | null => {
    if (userToken) return userToken;

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) userToken = token;
    return token;
};

// 🔒 Helper para requests protegidas con token Bearer
export const authGet = async <T>(url: string): Promise<T> => {
    const token = getUserToken();
    if (!token) throw new Error('No hay token de usuario. Debes logear primero.');

    const response = await api.get<T>(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

// 🔑 Función para setear token manualmente
export const setUserToken = (token: string) => {
    userToken = token;
    localStorage.setItem(TOKEN_KEY, token);
};

// 🔒 Función para limpiar token al logout
export const clearUserToken = () => {
    userToken = null;
    localStorage.removeItem(TOKEN_KEY);
};

export default api;