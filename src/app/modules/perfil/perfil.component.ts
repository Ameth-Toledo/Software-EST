import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users/users.service';
import { PerfilUsuario } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
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

  // Estados del componente
  editMode = false;
  loading = true;
  
  // Para manejo de archivos
  selectedFile?: File;
  imagenUrlBase = 'http://localhost:8080';
  
  // Para los modales
  showSuccessModal = false;
  showWarningModal = false;
  showErrorModal = false;
  successMessage = '';
  warningMessage = '';
  errorMessage = '';
  warningAction: () => void = () => {};
  
  // Frase del día
  fechaInicio: Date = new Date(); 
  fraseDelDia: string = '';
  frasesDelDia: string[] = [
    '"Aprender nunca agota la mente." - Leonardo da Vinci',
    '"El conocimiento es poder." - Francis Bacon',
    '"La educación es el arma más poderosa para cambiar el mundo." - Nelson Mandela',
    '"El éxito es la suma de pequeños esfuerzos repetidos día tras día." - R. Collier',
    '"Nunca es tarde para aprender."',
    '"Cuanto más lees, más cosas sabrás. Cuanto más aprendas, a más lugares irás." - Dr. Seuss',
    '"La mente que se abre a una nueva idea, jamás vuelve a su tamaño original." - Einstein',
    '"Sé el cambio que quieres ver en el mundo." - Gandhi',
    '"Fracasar no es caer, es negarse a levantarse."',
    '"El aprendizaje no se logra por casualidad, debe ser buscado con ardor y diligencia."',
    '"Invertir en conocimiento produce siempre los mejores intereses." - Benjamin Franklin',
    '"No estudies para aprobar, estudia para aprender."',
    '"La motivación es lo que te pone en marcha, el hábito es lo que hace que sigas." - Jim Ryun',
    '"Haz algo hoy que tu yo del futuro te agradezca."',
    '"No hay atajos para llegar a donde vale la pena."',
    '"La práctica hace al maestro."',
    '"Aprender es un regalo. Incluso cuando el dolor es tu maestro."',
    '"No te compares, compite contigo mismo."',
    '"El aprendizaje continuo es la clave del éxito."',
    '"No hay mejor momento para empezar que ahora."',
    '"El progreso es imposible sin cambio."',
    '"Pequeños pasos cada día, grandes logros mañana."',
    '"La educación es el pasaporte al futuro."',
    '"Si puedes soñarlo, puedes lograrlo."',
    '"Aprende como si fueras a vivir para siempre." - Gandhi',
    '"El estudio es el mejor amigo. Nunca te abandonará."',
    '"El conocimiento te dará poder, pero el carácter respeto." - Bruce Lee',
    '"El secreto para salir adelante es comenzar." - Mark Twain',
    '"No aprendas para la escuela, aprende para la vida."',
    '"La constancia vence al talento."'
  ];

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.setFraseDelDia();
  }

  private setFraseDelDia(): void {
    const hoy = new Date();
    const msPorDia = 1000 * 60 * 60 * 24;
    const diasDesdeInicio = Math.floor((hoy.getTime() - this.fechaInicio.getTime()) / msPorDia);
    const index = diasDesdeInicio % this.frasesDelDia.length;
    this.fraseDelDia = this.frasesDelDia[index];
  }

  private getUserIdFromToken(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['userId'] || payload['user_id'] || payload['id'] || null;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  cargarUsuario(): void {
    let id = this.getUserIdFromToken();

    if (id == null) {
      this.openErrorModal('No se pudo obtener tu información de sesión');
      this.router.navigate(['/login']); 
      return;
    }    

    this.loading = true;
    this.usersService.getUserById(id).subscribe({
      next: (response: any) => {
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
            planPremium: userData.plan?.toLowerCase() === 'premium',
            rolId: userData.rolId || userData.rol_id || 1,
            contrasena: '' 
          };
        }
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar usuario:', err);
        this.loading = false;
        this.openErrorModal('No se pudo cargar la información del usuario');
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.cargarUsuario();
      this.selectedFile = undefined;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo y tamaño de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        this.openErrorModal('Formato de archivo no válido. Solo se permiten imágenes JPEG, PNG o GIF.');
        return;
      }
      
      if (file.size > maxSize) {
        this.openErrorModal('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
        return;
      }
      
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuario.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  actualizarPerfil(): void {
    const formData = new FormData();
    
    formData.append('nombre', this.usuario.nombre || '');
    formData.append('apellido', this.usuario.apellido || '');
    formData.append('correo', this.usuario.correo || '');
    formData.append('rolId', String(this.usuario.rolId || 1));
    formData.append('plan', this.usuario.plan || '');
    
    if (this.selectedFile) {
      formData.append('foto_perfil', this.selectedFile, this.selectedFile.name);
    }
    
    if (this.usuario.id !== undefined) {
      this.usersService.updateUser(this.usuario.id, formData).subscribe({
        next: (response) => {
          this.editMode = false;
          this.cargarUsuario();
          this.openSuccessModal('Tus cambios se han guardado correctamente.');
        },
        error: (err) => {
          const errorMsg = err.error?.error || 'Error al actualizar perfil. Inténtalo de nuevo.';
          this.openErrorModal(errorMsg);
        }
      });
    } else {
      this.openErrorModal('ID de usuario no válido');
    }
  }

  eliminarCuenta(): void {
    if (!this.usuario.id) return;

    this.openWarningModal(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      () => {
        this.usersService.deleteUser(this.usuario.id!).subscribe({
          next: () => {
            localStorage.removeItem('authToken');
            this.router.navigate(['/login']);
          },
          error: err => {
            this.openErrorModal('No se pudo eliminar la cuenta. Inténtalo de nuevo.');
          }
        });
      }
    );
  }

  // Métodos para manejar los modales
  openSuccessModal(message: string): void {
    this.successMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  openWarningModal(message: string, action: () => void): void {
    this.warningMessage = message;
    this.warningAction = action;
    this.showWarningModal = true;
  }

  closeWarningModal(): void {
    this.showWarningModal = false;
  }

  confirmWarningAction(): void {
    this.warningAction();
    this.closeWarningModal();
  }

  openErrorModal(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }
}