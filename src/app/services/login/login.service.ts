import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://backend-est.onrender.com/login';  

  constructor(private http: HttpClient) { }

  login(loginData: Login): Observable<any> {
    return this.http.post<any>(this.apiUrl, loginData);
  }
}
