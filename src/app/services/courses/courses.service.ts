import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Courses } from '../../models/courses';

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

  // Método para crear un curso con imagen
  createCourse(courseData: FormData): Observable<Courses> {
    const headers = this.getAuthHeaders();
    return this.http.post<Courses>(this.apiUrl, courseData, { headers }).pipe(
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
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}