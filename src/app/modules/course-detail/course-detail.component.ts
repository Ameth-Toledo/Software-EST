import { Component } from '@angular/core';
import { CoursesService } from '../../services/courses/courses.service';
import { Courses } from '../../models/courses';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent {
  course: Courses | undefined;
  profesorName: string = 'Cargando...';
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const courseId = params['id'];
      this.loadCourseData(courseId);
    });
  }

  private loadCourseData(courseId: string): void {
    this.isLoading = true;
    this.error = null;
  
    const idAsNumber = Number(courseId);  // Esto convierte courseId de string a número
  
    this.coursesService.getCourseById(idAsNumber).subscribe({
      next: (data: Courses) => {
        this.course = data;
        const profesorId = Number(data.profesor_id);
        if (!isNaN(profesorId)) {
          this.loadProfessorName(profesorId);
        } else {
          console.error('profesor_id no es un número válido');
          this.profesorName = 'Profesor no disponible';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar el curso:', err);
        this.error = 'No se pudo cargar el curso. Por favor, inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }  
  
  private loadProfessorName(profesorId: number): void {
    console.log(`Buscando profesor con ID: ${profesorId}`); // Debug
    
    this.coursesService.getProfesorName(profesorId).subscribe({
      next: (profesorData) => {
        console.log('Datos del profesor recibidos:', profesorData); // Debug
        this.profesorName = profesorData.nombre || 'Profesor';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el profesor:', err);
        // Intenta obtener el nombre del usuario actual como fallback
        const currentUser = this.authService.getUserData();
        this.profesorName = currentUser?.nombre || currentUser?.name || 'Profesor';
        this.isLoading = false;
      }
    });
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-course.jpg';
  }

  enrollCourse(): void {
    if (!this.course) return;
    
    if (this.course.es_gratuito) {
      this.router.navigate(['/learn', this.course.id]);
    } else {
      this.router.navigate(['/checkout', this.course.id]);
    }
  }

  shareCourse(): void {
    if (!this.course) return;
    
    if (navigator.share) {
      navigator.share({
        title: this.course.titulo,
        text: this.course.descripcion.substring(0, 100) + '...',
        url: window.location.href
      }).catch(err => console.log('Error al compartir:', err));
    } else {
      alert('Comparte este curso: ' + window.location.href);
    }
  }
}