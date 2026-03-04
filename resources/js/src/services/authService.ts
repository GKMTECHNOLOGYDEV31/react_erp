import axios from 'axios';
import { LoginResponse } from '../types/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (
  correo: string,
  clave: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', {
    correo,
    clave,
  });

  return response.data;
};