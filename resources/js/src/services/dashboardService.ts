import axios from "axios";

const API = "/api/analytics";

export const getTotalTickets = () => axios.get(`${API}/total-tickets`);

export const getTicketsCerrados = () => axios.get(`${API}/tickets-cerrados`);

export const getTiempoResolucion = () => axios.get(`${API}/tiempo-resolucion`);

export const getReincidencias = () => axios.get(`${API}/reincidencias`);

export const getTendenciaTickets = () => axios.get(`${API}/tendencia-tickets`);

export const getTicketsPorDistrito = () => axios.get(`${API}/tickets-por-distrito`);

export const getFlujoTicketsEstado = () => axios.get(`${API}/flujo-tickets-estado`);

export const getRendimientoTecnico = () => axios.get(`${API}/rendimiento-tecnico`);

export const getTasaExito = () => axios.get(`${API}/tasa-exito`);