import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'https://backend-est.onrender.com/users';

  constructor(private http: HttpClient) { }

  registerUser(userData: user): Observable<any> {
    const formData = new FormData();

    formData.append('nombre', userData.nombre);
    formData.append('correo', userData.correo);
    formData.append('contrasena', userData.contrasena);
    formData.append('foto_perfil', userData.fotoPerfil || '');
    formData.append('rol_id', userData.rolId ? userData.rolId.toString() : '1'); 
    formData.append('plan', userData.plan || 'gratuito'); 

    return this.http.post<any>(this.apiUrl, formData);
  }
}
