export interface Usuario {
    idUsuario: number;
    nombre: string;
    apellidoPaterno: string | null;
    apellidoMaterno: string | null;
    correo: string | null;
    usuario: string | null;
    documento: string | null;
    idRol: number | null;
    estado: number | null;
    avatar?: string | null; // Agregar si viene del backend
    // otros campos opcionales según necesidad
}
export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: Usuario;
}
