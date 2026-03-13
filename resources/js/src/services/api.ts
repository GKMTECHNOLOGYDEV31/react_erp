import axios, { 
    AxiosInstance, 
    InternalAxiosRequestConfig, 
    AxiosResponse,
    AxiosError 
} from 'axios';

// Extender la interfaz para incluir nuestras propiedades personalizadas
declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

// Configuración base de la API
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: 30000, // 30 segundos de timeout
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log para debugging (solo en desarrollo)
        if (import.meta.env.DEV) {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
        }
        
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        // Log para debugging (solo en desarrollo)
        if (import.meta.env.DEV) {
            console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
    },
    async (error: AxiosError): Promise<any> => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        
        // Log para debugging (solo en desarrollo)
        if (import.meta.env.DEV) {
            console.error('❌ Response Error:', {
                url: originalRequest?.url,
                method: originalRequest?.method,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }

        // Manejar error 401 (No autorizado)
        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;
            
            // Intentar refresh token si existe
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/refresh`, {
                        refresh_token: refreshToken
                    });
                    
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } else {
                // No hay refresh token, redirigir al login
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }

        // Manejar error 403 (Prohibido)
        if (error.response?.status === 403) {
            console.error('Acceso prohibido');
            // Podrías mostrar una notificación al usuario
        }

        // Manejar error 404 (No encontrado)
        if (error.response?.status === 404) {
            console.error('Recurso no encontrado');
        }

        // Manejar error 422 (Validación)
        if (error.response?.status === 422) {
            const errors = (error.response?.data as any)?.errors;
            if (errors) {
                // Aquí podrías mostrar los errores de validación
                console.error('Errores de validación:', errors);
            }
        }

        // Manejar error 500 (Error del servidor)
        if (error.response?.status === 500) {
            console.error('Error interno del servidor');
        }

        // Manejar timeout
        if (error.code === 'ECONNABORTED') {
            console.error('Tiempo de espera agotado');
        }

        // Manejar falta de conexión
        if (!error.response) {
            console.error('Error de conexión');
        }

        return Promise.reject(error);
    }
);

// Función auxiliar para manejar respuestas
export const handleResponse = <T>(response: AxiosResponse<T>): T => {
    return response.data;
};

// Función auxiliar para manejar errores
export const handleError = (error: any): never => {
    if (error.response) {
        // El servidor respondió con un código de error
        throw {
            status: error.response.status,
            data: error.response.data,
            message: error.response.data?.message || 'Error en la petición'
        };
    } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        throw {
            status: 0,
            message: 'No se pudo conectar con el servidor'
        };
    } else {
        // Algo pasó al configurar la petición
        throw {
            status: 0,
            message: error.message || 'Error desconocido'
        };
    }
};

export default api;