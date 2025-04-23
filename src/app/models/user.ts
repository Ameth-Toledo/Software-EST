export interface user {
    id?: number;
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    fotoPerfil?: string | null; 
    rolId?: number | null; 
    rol_id?: number | null; // Agregado para compatibilidad con la API 
    plan: string;
}

export interface PerfilUsuario extends user {
    planPremium: boolean;
}