import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  registerUser(userData: user, file?: File): Observable<any> {
    const formData = new FormData();
  
    formData.append('nombre', userData.nombre);
    formData.append('apellido', userData.apellido);
    formData.append('correo', userData.correo);
    formData.append('contrasena', userData.contrasena);
    formData.append('rol_id', userData.rolId ? userData.rolId.toString() : '1'); 
    formData.append('plan', userData.plan || 'gratuito'); 
    
    if (file) {
      formData.append('foto_perfil', file, file.name);
    }
  
    return this.http.post<any>(this.apiUrl, formData);
  }
}
