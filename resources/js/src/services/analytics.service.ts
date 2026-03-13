import api, { handleResponse, handleError } from './api';

// ==================== TIPOS ====================

export interface TicketsPorPeriodo {
    dia: number;
    semana: number;
    mes: number;
    año: number;
    tendencia: {
        dia: number;
        semana: number;
        mes: number;
        año: number;
    };
}

export interface TicketDistrito {
    distrito: string;
    provincia: string;
    cantidad: number;
    variacion: number;
}

export interface TicketFalla {
    falla: string;
    cantidad: number;
    porcentaje: number;
    color: string;
}

export interface TicketEstado {
    estado: string;
    cantidad: number;
    color: string;
}

export interface TiempoPromedio {
    horas: number;
    tendencia: number;
}

export interface TiemposPromedio {
    coordinacionInicial: TiempoPromedio;
    solucionOnSite: TiempoPromedio;
    solucionLaboratorio: TiempoPromedio;
    resolucionTotal: TiempoPromedio;
}

export interface Reincidencias {
    porcentaje: number;
    total: number;
    reincidentes: number;
    porTecnico: Array<{ tecnico: string; reincidencias: number }>;
    tendencia: number;
}

export interface TecnicoData {
    tecnico: string;
    tickets: number;
    eficiencia: number;
    reincidencias: number;
}

export interface TicketsPorTecnico {
    diario: TecnicoData[];
    semanal: TecnicoData[];
    mensual: TecnicoData[];
}

export interface TicketsPorPersonal {
    diario: number;
    semanal: number;
    mensual: number;
    objetivos: {
        diario: number;
        semanal: number;
        mensual: number;
    };
}

export interface Tendencias {
    diario: number[];
    mensual: number[];
}

export interface DashboardData {
    ticketsPorPeriodo: TicketsPorPeriodo;
    ticketsPorDistrito: TicketDistrito[];
    ticketsPorFalla: TicketFalla[];
    ticketsPorEstado: TicketEstado[];
    tiemposPromedio: TiemposPromedio;
    reincidencias: Reincidencias;
    ticketsPorTecnico: TicketsPorTecnico;
    ticketsPorPersonal: TicketsPorPersonal;
    tendencias: Tendencias;
}

export interface FiltrosPeriodo {
    fechaInicio?: string;
    fechaFin?: string;
}

// ==================== SERVICIO ====================

class AnalyticsService {
    private readonly baseUrl = '/analytics';

    /**
     * Obtiene todos los datos del dashboard en una sola petición
     */
    async getDashboardData(filtros?: FiltrosPeriodo): Promise<DashboardData> {
        try {
            const response = await api.get<DashboardData>(`${this.baseUrl}/dashboard`, {
                params: filtros
            });
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Obtiene tickets por período (día, semana, mes, año)
     */
    async getTicketsPorPeriodo(periodo?: 'dia' | 'semana' | 'mes' | 'año'): Promise<TicketsPorPeriodo> {
        try {
            const response = await api.get<TicketsPorPeriodo>(`${this.baseUrl}/tickets-periodo`, {
                params: { periodo }
            });
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Obtiene tickets por distrito
     */
    async getTicketsPorDistrito(): Promise<TicketDistrito[]> {
        try {
            const response = await api.get<TicketDistrito[]>(`${this.baseUrl}/tickets-distrito`);
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Obtiene tickets por tipo de falla
     */
    async getTicketsPorFalla(): Promise<TicketFalla[]> {
        try {
            const response = await api.get<TicketFalla[]>(`${this.baseUrl}/tickets-falla`);
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Obtiene tickets por estado
     */
    async getTicketsPorEstado(): Promise<TicketEstado[]> {
        try {
            const response = await api.get<TicketEstado[]>(`${this.baseUrl}/tickets-estado`);
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Obtiene tiempos promedio
     */
    async getTiemposPromedio(): Promise<TiemposPromedio> {
        try {
            const response = await api.get<TiemposPromedio>(`${this.baseUrl}/tiempos-promedio`);
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Obtiene datos de reincidencias
     */
    async getReincidencias(): Promise<Reincidencias> {
        try {
            const response = await api.get<Reincidencias>(`${this.baseUrl}/reincidencias`);
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Obtiene tickets por técnico según período
     * @param periodo 'diario' | 'semanal' | 'mensual'
     */
    async getTicketsPorTecnico(periodo: 'diario' | 'semanal' | 'mensual'): Promise<TecnicoData[]> {
        try {
            const response = await api.get<TecnicoData[]>(`${this.baseUrl}/tickets-tecnico`, {
                params: { periodo }
            });
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Obtiene tendencias (diarias o mensuales)
     * @param tipo 'diario' | 'mensual'
     */
    async getTendencias(tipo: 'diario' | 'mensual'): Promise<number[]> {
        try {
            const response = await api.get<number[]>(`${this.baseUrl}/tendencias`, {
                params: { tipo }
            });
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Exporta los datos del dashboard a Excel
     */
    async exportarDashboard(formato: 'excel' | 'pdf' = 'excel'): Promise<Blob> {
        try {
            const response = await api.get(`${this.baseUrl}/exportar`, {
                params: { formato },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Obtiene datos filtrados por rango de fechas
     */
    async getDatosPorRango(fechaInicio: string, fechaFin: string): Promise<DashboardData> {
        try {
            const response = await api.get<DashboardData>(`${this.baseUrl}/rango-fechas`, {
                params: { fechaInicio, fechaFin }
            });
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }

    /**
     * Refresca los datos del dashboard
     */
    async refrescarDatos(): Promise<DashboardData> {
        try {
            const response = await api.post<DashboardData>(`${this.baseUrl}/refrescar`);
            return handleResponse(response);
        } catch (error) {
            throw handleError(error);
        }
    }
}

// Crear y exportar una instancia única del servicio
const analyticsService = new AnalyticsService();
export default analyticsService;