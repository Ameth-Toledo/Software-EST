// auth-callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: '<div class="loading">Procesando autenticación...</div>',
  styles: [`
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 1.2rem;
      color: #333;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const action = params['action'];
      const provider = params['provider'];
  
      if (token) {
        // Guardar el token en localStorage
        localStorage.setItem('authToken', token);
        
        // Notificar al servicio de autenticación (sin redireccionar)
        this.authService.login();
        
        // Almacenar información adicional
        if (provider) {
          localStorage.setItem('authProvider', provider);
        }
        
        // Redirigir manualmente después de procesar
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}