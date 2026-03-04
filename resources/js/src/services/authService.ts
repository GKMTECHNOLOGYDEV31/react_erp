import axios from 'axios';
import { LoginResponse } from '../types/auth';

const API_URL = 'http://127.0.0.1:8000/api';

export const login = async (
  correo: string,
  clave: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/login`,
    { correo, clave }
  );

  return response.data;
};