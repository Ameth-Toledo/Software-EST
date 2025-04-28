export interface Courses {
    id: number;
    titulo: string;
    descripcion: string;
    imagen_portada: File | string;  // No es opcional
    profesor_id: number;  // No es opcional
    es_gratuito: boolean;  // No es opcional
  }
  
  export interface CourseApiResponse {
    course: Omit<Courses, 'imagen_portada'> & { imagen_portada: string };
    message?: string;
  }