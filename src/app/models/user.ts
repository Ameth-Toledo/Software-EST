export interface user {
    id?: number;
    nombre: string;
    correo: string;
    contrasena: string;
    fotoPerfil?: string | null; 
    rolId?: number | null; 
    plan: string;
}