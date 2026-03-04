export interface Usuario {
  idUsuario: number;
  Nombre: string;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  correo: string | null;
  usuario: string | null;
  documento: string | null;
  idRol: number | null;
  estado: number | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: Usuario;
}