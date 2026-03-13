// types/analytics.ts
export interface DashboardData {
    total_tickets: number;
    tickets_hoy: number;
    tickets_semana: number;
    tickets_mes: number;
    tickets_activos: number;
    tickets_inactivos: number;
    crecimiento_mensual: number;
    porcentaje_activos: number;
}

export interface TicketsPorDiaResponse {
    fechas: string[];
    totales: number[];
}

export interface TicketsPorCategoriaResponse {
    categorias: string[];
    totales: number[];
}

export interface TicketsPorModeloResponse {
    modelos: string[];
    totales: number[];
}

export interface TicketsPorDocumentoResponse {
    documentos: string[];
    totales: number[];
}

export interface TicketsPorDepartamentoResponse {
    departamentos: string[];
    totales: number[];
}

export interface TicketsPorTiendaResponse {
    tiendas: string[];
    totales: number[];
}

export interface TicketsPorHoraResponse {
    horas: number[];
    totales: number[];
}

export interface UltimoTicket {
    id: number;
    numero_ticket: string;
    cliente: string;
    categoria: string;
    modelo: string;
    fecha: string;
    estado: number;
    departamento: string;
}

export interface MetricasDetalladas {
    tickets_con_evidencias: number;
    porcentaje_con_evidencias: number;
    promedio_diario_30dias: number;
    tickets_por_dia_semana: Array<{
        dia_semana: number;
        total: number;
    }>;
}

// Para los gráficos transformados
export interface ChartDataItem {
    name: string;
    value: number;
}

export interface HourlyDataItem {
    hora: string;
    tickets: number;
}