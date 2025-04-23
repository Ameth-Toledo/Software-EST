import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { user, PerfilUsuario } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  usuario: PerfilUsuario = {
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    plan: '',
    planPremium: false
  };
  editMode = false;
  loading = true;
  imagenUrlBase = 'http://localhost:8080'; 

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  private getUserIdFromToken(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload); 
      return payload['userId'] || payload['user_id'] || payload['id'] || null;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  cargarUsuario(): void {
    let id = this.getUserIdFromToken();
    
    if (id == null) {
      console.warn('No se pudo obtener ID del token, usando ID fijo para pruebas');
      id = 10; 
    }
    
    this.loading = true;
    this.usersService.getUserById(id).subscribe({
      next: (response: any) => {
        console.log('Respuesta completa de la API:', response);
        
        let userData;
        if (response.client) {
          userData = response.client;
        } else if (response.users && response.users.length > 0) {
          userData = response.users.find((u: any) => u.id === id);
        } else {
          userData = response;
        }
        
        if (userData) {
          let fotoPerfil = userData.fotoPerfil || userData.foto_perfil || '';
          
          if (fotoPerfil && !fotoPerfil.startsWith('http')) {
            fotoPerfil = this.imagenUrlBase + fotoPerfil;
          }
          
          this.usuario = {
            ...userData,
            fotoPerfil: fotoPerfil,
            planPremium: userData.plan?.toLowerCase() === 'premium'
          };
          console.log('Usuario cargado:', this.usuario);
        } else {
          console.error('No se encontraron datos de usuario en la respuesta');
        }
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar usuario:', err);
        this.loading = false;
      }
    });
  }

  // Método para manejar error de carga de imagen
  onImageError(event: any): void {
    console.log('Error al cargar la imagen de perfil');
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  actualizarPerfil(): void {
    if (!this.usuario.id) return;
    
    // Eliminar la URL base de la imagen antes de enviar
    let fotoPerfil = this.usuario.fotoPerfil;
    if (fotoPerfil && fotoPerfil.startsWith(this.imagenUrlBase)) {
      fotoPerfil = fotoPerfil.substring(this.imagenUrlBase.length);
    }
    
    const updated: user = {
      id: this.usuario.id,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      correo: this.usuario.correo,
      contrasena: this.usuario.contrasena,
      fotoPerfil: fotoPerfil,
      rolId: this.usuario.rolId,
      plan: this.usuario.plan
    };
    
    this.usersService.updateUser(this.usuario.id, updated).subscribe({
      next: () => {
        this.editMode = false;
        this.cargarUsuario(); 
      },
      error: err => console.error('Error al actualizar perfil', err)
    });
  }

  eliminarCuenta(): void {
    if (!this.usuario.id) return;
    
    this.usersService.deleteUser(this.usuario.id).subscribe({
      next: () => {
        console.log('Usuario eliminado');
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      },
      error: err => console.error('Error al eliminar usuario', err)
    });
  }
}