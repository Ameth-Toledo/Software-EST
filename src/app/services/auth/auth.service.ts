import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    const userLoggedIn = localStorage.getItem('isAuthenticated');
    if (userLoggedIn) {
      this.isAuthenticated.next(true);
    }
  }

  login() {
    localStorage.setItem('isAuthenticated', 'true');
    this.isAuthenticated.next(true);
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticated.next(false);
    this.router.navigate(['']);
  }

  getAuthStatus() {
    return this.isAuthenticated.asObservable();
  }
}
