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
        console.log('Login successful:', response);
        localStorage.setItem('authToken', response.token);  
        this.authService.login();  
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }

  sendToRegister(event : Event) {
    event.preventDefault();
    this.router.navigate(['register'])
  }
}
