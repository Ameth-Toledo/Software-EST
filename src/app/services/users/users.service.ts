import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  private getHeaders(contentType?: string): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
    
    if (contentType) {
      headers = headers.set('Content-Type', contentType);
    }
    
    return headers;
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateUser(id: number, data: any): Observable<any> {
    // No agregamos Content-Type cuando es FormData porque el navegador lo hace automáticamente
    const headers = this.getHeaders();
    
    // Logging para debug
    console.log('Headers enviados:', headers);
    if (data instanceof FormData) {
      console.log('Enviando como FormData');
      // Verificar si rolId está en el FormData
      console.log('rolId en FormData:', data.get('rolId'));
    }
    
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers });
  }
  
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}