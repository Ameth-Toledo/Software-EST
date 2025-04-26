export interface user {
    id?: number;
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    fotoPerfil?: File | null; // Cambiar a File si estás manejando archivos
    rol_id?: number | null; // Agregado para compatibilidad con la API 
    plan: string;
    rolId?: number;
  }
  
  export interface PerfilUsuario extends user {
    planPremium: boolean;
  }
  