import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  courseForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  currentUser = { name: 'Nombre del Profesor' };
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      imagen_portada: ['', [Validators.required]],
      es_gratuito: [false]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.courseForm.patchValue({ imagen_portada: file.name });
      this.courseForm.get('imagen_portada')?.updateValueAndValidity();

      // Vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulación de envío
    setTimeout(() => {
      this.isLoading = false;
      alert('Curso creado exitosamente (simulación)');
      this.router.navigate(['/cursos']);
    }, 1500);
  }

  markAllAsTouched() {
    Object.values(this.courseForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  goBack() {
    this.router.navigate(['/cursos']);
  }
}