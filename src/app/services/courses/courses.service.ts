import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs'; // Agregamos map aquí
import { Courses, CourseApiResponse } from '../../models/courses';

interface ApiResponse {
  courses: Courses[];
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://localhost:8080/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getCourseById(id: number): Observable<Courses> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ course: Courses }>(`${this.apiUrl}/id/${id}`, { headers }).pipe(  
      map(response => response.course),  // EXTRAEMOS solo el objeto course
      catchError(this.handleError)
    );
  }  

  createCourse(courseData: FormData): Observable<CourseApiResponse> {
    return this.http.post<CourseApiResponse>(this.apiUrl, courseData, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  getProfesorName(profesorId: number): Observable<{ nombre: string }> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`http://localhost:8080/users/${profesorId}`, { headers }).pipe(
      map(response => {
        console.log('Respuesta completa del profesor:', response); // Debug detallado
        
        // Primero verifica si hay un objeto user
        if (response.user) {
          return { 
            nombre: response.user.nombre || 
                   response.user.name || 
                   `${response.user.first_name} ${response.user.last_name}` || 
                   'Profesor' 
          };
        }
        // Luego verifica si hay nombre directamente
        else if (response.nombre) {
          return { nombre: response.nombre };
        }
        // Si es un objeto plano con first_name/last_name
        else if (response.first_name) {
          return { nombre: `${response.first_name} ${response.last_name || ''}`.trim() };
        }
        // Último recurso
        else {
          return { nombre: 'Profesor' };
        }
      }),
      catchError(this.handleError)
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error al procesar la solicitud';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Error de conexión con el servidor';
    }
    return throwError(() => new Error(errorMessage));
  }
}
