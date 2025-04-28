import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { AuthService } from '../../services/auth/auth.service';
import { CoursesService } from '../../services/courses/courses.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  courseForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  currentUser = { name: 'Nombre del Profesor' };

  // Tipos de imagen aceptados
  readonly acceptedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
  readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthService
  ) {
    this.courseForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      imagen_portada: [null, [Validators.required]],
      es_gratuito: [false],
      profesor_id: [null] 
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario autenticado');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    this.courseForm.patchValue({ profesor_id: userId });
    
    const userData = this.authService.getUserData();
    if (userData) {
      this.currentUser = { 
        name: userData.nombre || userData.name || userData.username || 'Profesor' 
      };
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.errorMessage = '';
    
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tipo de archivo
      if (!this.acceptedImageTypes.includes(file.type)) {
        this.errorMessage = 'Formato de imagen no válido. Use PNG, JPG, JPEG o SVG';
        this.resetFileInput(input);
        return;
      }

      // Validar tamaño de archivo
      if (file.size > this.maxFileSize) {
        this.errorMessage = 'La imagen es demasiado grande (máximo 5MB)';
        this.resetFileInput(input);
        return;
      }

      this.selectedFile = file;
      this.courseForm.patchValue({ imagen_portada: file });
      this.courseForm.get('imagen_portada')?.updateValueAndValidity();

      // Generar vista previa
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  private resetFileInput(input: HTMLInputElement): void {
    input.value = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.courseForm.patchValue({ imagen_portada: null });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.markAllAsTouched();
      this.errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Debe seleccionar una imagen para el curso';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('titulo', this.courseForm.value.titulo);
    formData.append('descripcion', this.courseForm.value.descripcion);
    formData.append('profesor_id', this.courseForm.value.profesor_id.toString());
    formData.append('es_gratuito', this.courseForm.value.es_gratuito ? 'true' : 'false');
    formData.append('imagen_portada', this.selectedFile, this.selectedFile.name);

    this.coursesService.createCourse(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/cursos'], {
          state: { successMessage: 'Curso creado exitosamente' }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error al crear el curso. Por favor, inténtelo de nuevo.';
        console.error('Error creating course:', error);
      }
    });
  }

  markAllAsTouched(): void {
    Object.values(this.courseForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/cursos']);
  }
}