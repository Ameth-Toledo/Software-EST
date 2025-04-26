import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CardCursosComponent } from "../../components/card-cursos/card-cursos.component";
import { CommonModule } from '@angular/common';
import { Courses } from '../../models/courses';
import { CoursesService } from '../../services/courses/courses.service';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, CardCursosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  courses: Courses[] = [];
  userName: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private coursesService: CoursesService, 
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    
    this.authService.getAuthStatus().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadUserData();
      }
    });

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const action = params['action'];
      const provider = params['provider'];

      if (token) {
        localStorage.setItem('authToken', token);
        this.authService.login();
        
        if (provider) {
          console.log(`Inicio de sesión exitoso con ${provider}`);
          localStorage.setItem('authProvider', provider);
        }
        
        this.loadUserData();
      }
    });
  }
  
  loadCourses(): void {    
    this.coursesService.getCourses().subscribe({
      next: (response) => {
        this.courses = response.courses.map((course: any) => ({
          ...course,
          imagen_portada: course.imagen_portada as string
        }));
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      }
    });
  }
  
  loadUserData(): void {
    const userId = this.getUserIdFromToken();
    console.log('ID de usuario obtenido del token:', userId);
    
    if (userId) {
      this.usersService.getUserById(userId).subscribe({
        next: (response) => {
          console.log('Datos completos del usuario recibidos:', response);
          // Accede a través de la propiedad client
          const user = response.client;
          this.userName = user.nombre || user.name || user.username || user.email || 'Usuario';
          console.log('Nombre de usuario establecido:', this.userName);
        },
        error: (err) => {
          console.error('Error al cargar datos del usuario:', err);
          this.userName = 'Usuario';
        }
      });
    } else {
      console.log('No se pudo obtener ID de usuario del token');
      this.userName = 'Usuario';
    }
  }

  private getUserIdFromToken(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No se encontró token en localStorage');
      return null;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload del token:', payload);
      // Busca específicamente user_id que es lo que contiene tu token
      return payload.user_id || payload.id || payload.userId || payload.sub || null;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  getCourseImageUrl(imagenPortada: File | string): string {
    if (typeof imagenPortada === 'string') {
      return imagenPortada.startsWith('http') 
        ? imagenPortada 
        : `http://localhost:8080${imagenPortada}`;
    }
    return URL.createObjectURL(imagenPortada);
  }
}