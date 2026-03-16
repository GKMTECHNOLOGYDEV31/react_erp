// analyticsService.ts
import { authGet, getUserToken } from './authService';

/*
==============================
TIPOS
==============================
*/

export interface TicketsCerrados { total_cerrados: number; porcentaje_total: number; variacion_mes_anterior: number }
export interface TiempoResolucion { promedio_horas: number; promedio_dias: number }
export interface TendenciaTickets { fecha: string; total: number }
export interface TicketsDistrito { distrito: string; total: number }
export interface FlujoEstado { estado: string; total: number }
export interface TecnicoReincidencia { tecnico: string; reincidencias: number }
export interface AnalisisReincidencias { serie: string; total: number }
export interface TecnicoRendimiento {
    idTecnico: number;
    tecnico: string;
    total_tickets: number;
    dias_activos: number;
    meses_activos: number;
    anios_activos: number;
    reincidencias: number;
    exitos: number;
    tasa_exito: number;
}
export interface PodioTecnico { idUsuario: number; tecnico: string; tickets: number; efectividad: number; vs_promedio: number }
export interface RendimientoPersonal {
    metas: { diaria: number; semanal: number; mensual: number }
    tickets: { dia: number; semana: number; mes: number }
    progreso: { dia: number; semana: number; mes: number }
    promedio_diario: number
    podio_diario: PodioTecnico[]
}
export interface DashboardData { total_tickets: number; tickets_cerrados: number; tasa_exito: number; reincidencias: number }

/*
==============================
SERVICIO ANALYTICS
==============================
*/

export const analyticsService = {
    // ⚡ Rutas protegidas usando authGet (token dinámico del login)
    getDashboard: () => authGet<DashboardData>('/analytics/dashboard'),
    getTotalTickets: () => authGet<{ total: number }>('/analytics/total-tickets'),
    getTicketsCerrados: () => authGet<TicketsCerrados>('/analytics/tickets-cerrados'),
    getTiempoResolucion: () => authGet<TiempoResolucion>('/analytics/tiempo-resolucion'),
    getTasaExito: () => authGet<number>('/analytics/tasa-exito'),
    getReincidencias: () => authGet<number>('/analytics/reincidencias'),
    getTendenciaTickets: () => authGet<TendenciaTickets[]>('/analytics/tendencia-tickets'),
    getTicketsPorDistrito: () => authGet<TicketsDistrito[]>('/analytics/tickets-distrito'),
    getFlujoEstados: () => authGet<FlujoEstado[]>('/analytics/flujo-estados'),
    getRendimientoTecnicos: () => authGet<TecnicoRendimiento[]>('/analytics/rendimiento-tecnicos'),
    getRendimientoPersonal: () => authGet<RendimientoPersonal>('/analytics/rendimiento-personal'),
    getTecnicosMasReincidencias: () => authGet<TecnicoReincidencia[]>('/analytics/tecnicos-mas-reincidencias'),
    getAnalisisReincidencias: () => authGet<AnalisisReincidencias[]>('/analytics/analisis-reincidencias'),
    getTicketsMas1Visita: () => authGet<number>('/analytics/tickets-mas-1-visita'),

    // 🔹 Método para verificar si hay token antes de hacer requests
    hasToken: () => !!getUserToken(),
};