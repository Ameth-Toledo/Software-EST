import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { Login } from '../../models/login';
import { LoginService } from '../../services/login/login.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword: boolean = false;
  loginData: Login = { email: '', password: '' };

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loginService.login(this.loginData).subscribe(
      (response) => {
        console.log('Datos recibidos para login:', response);  // Verifica la respuesta
  
        // Ahora comprobamos que 'token' y 'userId' existan
        if (response.token && response.userId) {
          // Guardamos el token y los datos del usuario
          this.authService.login({
            token: response.token,
            user: { id: response.userId, name: response.name, email: response.email }
          });
  
          // Redirige al home después del login
          this.router.navigate(['/home']);
        } else {
          console.error('Token o userId no están presentes en la respuesta.');
        }
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }  

  sendToRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['register']);
  }

  loginWithFacebook(): void {
    window.location.href = 'http://localhost:8080/auth/facebook/register';
  }

  loginWithGitHub(): void {
    window.location.href = 'http://localhost:8080/auth/github/register';
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/auth/google/register';
  }
}
