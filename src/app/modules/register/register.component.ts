import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { user } from '../../models/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private router: Router, private registerService: RegisterService) {}

  @ViewChild('fileInput') fileInput!: ElementRef;
  fileName: string = '';
  selectedFile: File | null = null;

  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  contrasena: string = '';
  confirmPassword: string = '';
  fotoPerfil: string | null = null;
  plan: string = 'gratuito'; 
  rolId: number = 1; 

  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/auth/google/register';
  }

  loginWithGitHub() {
    window.location.href = 'http://localhost:8080/auth/github/register';
  }

  loginWithFacebook() {
    window.location.href = "http://localhost:8080/auth/facebook/register"
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
  
    if (!this.nombre.trim() || !this.correo.trim() || !this.contrasena.trim() || !this.confirmPassword.trim()) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    
    if (this.contrasena !== this.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
  
    const userData: user = {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      contrasena: this.contrasena,
      fotoPerfil: this.selectedFile, 
      plan: this.plan,
      rolId: this.rolId
    };
  
    this.registerService.registerUser(userData, this.selectedFile).subscribe(
      response => {
        this.router.navigate(['login']); 
      },
      error => {
        console.error('Error al registrar el usuario:', error);
        alert('Hubo un problema al registrar al usuario. Intenta nuevamente.');
      }
    );
  }  

  sendToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['login']);
  }
}