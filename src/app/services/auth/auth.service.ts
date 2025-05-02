import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.initAuthStatus();
  }

  private initAuthStatus(): void {
    const userLoggedIn = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('userData');
    
    if (userLoggedIn) {
      this.isAuthenticated.next(true);
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error('Error parsing user data:', e);
          localStorage.removeItem('userData');
        }
      }
    }
  }

  login(userData: any = {}): void {
    console.log('Datos recibidos para login:', userData); // 👈🏼 Agrega esto
  
    localStorage.setItem('isAuthenticated', 'true');
  
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
    }
  
    if (userData.user) {
      localStorage.setItem('userData', JSON.stringify(userData.user));
      this.currentUserSubject.next(userData.user);
    } else if (Object.keys(userData).length > 0 && !userData.token) {
      localStorage.setItem('userData', JSON.stringify(userData));
      this.currentUserSubject.next(userData);
    }
  
    this.isAuthenticated.next(true);
  }
  
  loginAndRedirect(userData: any = {}, redirectUrl: string = '/home'): void {
    this.login(userData);
    this.router.navigate([redirectUrl]);
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    this.isAuthenticated.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getUserData(): any {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  }

  getUserId(): number | null {
    const userData = this.getUserData();
    return userData ? userData.id || null : null;
  }

  isProfesor(): boolean {
    const userData = this.getUserData();
    if (userData) {
      return userData.role === 'profesor' || userData.tipo === 'profesor';
    }
    return false;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  canCreateCourse(): boolean {
    const userId = this.getUserId();
    const allowedIds = [2, 3];
    return userId !== null && allowedIds.includes(userId);
  }
}