import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses/courses.service';
import { Courses } from '../../models/courses';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterComponent, HeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{
  activeTab: string = 'cursos';
  showModal: boolean = false;
  modalTitle: string = '';
  currentItemType: string = '';
  form: FormGroup;
  formFields: any[] = [];
  currentCourseId: number | null = null;
  currentModuleId!: string;
  currentLessonId!: string;
  currentProfessorId!: string; // Si también editas profesores
  // Datos de ejemplo
  cursos: Courses[] = [];

  estudiantes = [
    { id: 'EST1001', nombre: 'Ana López', email: 'ana.lopez@email.com', cursosInscritos: 3, avatar: 'assets/student1.jpg' },
    { id: 'EST1002', nombre: 'Carlos Méndez', email: 'carlos.mendez@email.com', cursosInscritos: 2, avatar: 'assets/student2.jpg' }
  ];

  profesores = [
    { id: 'PROF201', nombre: 'María Rodríguez', especialidad: 'Frontend Development', email: 'm.rodriguez@est-software.edu' },
    { id: 'PROF202', nombre: 'Juan Pérez', especialidad: 'Backend Development', email: 'j.perez@est-software.edu' }
  ];

  asignaciones = [
    { nombre: 'María Rodríguez', materias: 'Angular, React, JavaScript', cursos: 4, horas: 12, avatar: 'assets/prof1.jpg' },
    { nombre: 'Juan Pérez', materias: 'Node.js, MongoDB, API Design', cursos: 3, horas: 10, avatar: 'assets/prof2.jpg' }
  ];

  comentarios = [
    { id: 1, estudiante: 'Ana López', curso: 'Angular Básico', fecha: new Date('2023-03-15'), contenido: 'Excelente curso, el profesor explica muy bien los conceptos y las prácticas son muy útiles.', avatar: 'assets/student1.jpg' },
    { id: 2, estudiante: 'Carlos Méndez', curso: 'React Avanzado', fecha: new Date('2023-03-10'), contenido: 'El contenido es bueno pero el ritmo es muy rápido para quienes no tenemos mucha experiencia previa.', avatar: 'assets/student2.jpg' }
  ];

  inscripciones = [
    { id: 1, estudiante: 'Ana López', curso: 'Angular Básico', fecha: new Date('2023-03-05'), estado: 'Aprobada', avatar: 'assets/student1.jpg' },
    { id: 2, estudiante: 'Carlos Méndez', curso: 'React Avanzado', fecha: new Date('2023-03-12'), estado: 'Pendiente', avatar: 'assets/student2.jpg' }
  ];

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (response) => {
        this.cursos = response.courses;
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
        // Puedes mostrar un mensaje de error al usuario aquí
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  openAddModal(type: string): void {
    this.currentItemType = type;
    this.modalTitle = `Agregar ${this.getTypeName(type)}`;
    this.prepareForm(type);
    this.showModal = true;
  }

  editItem(item: any, type: string): void {
    this.currentItemType = type;
    this.modalTitle = `Editar ${this.getTypeName(type)}`;
    this.prepareForm(type, item);
  
    switch (type) {
      case 'curso':
        this.currentCourseId = item.id;
        break;
      case 'modulo':
        this.currentModuleId = item.id;
        break;
      case 'leccion':
        this.currentLessonId = item.id;
        break;
      // Agrega más casos según sea necesario
    }
  
    this.showModal = true;
  }
  

  prepareForm(type: string, item?: any): void {
    this.form = this.fb.group({});
    this.formFields = [];
  
    switch(type) {
      case 'curso':
        this.formFields = [
          { name: 'titulo', label: 'Título', type: 'text', placeholder: 'Título del curso', required: true },
          { name: 'descripcion', label: 'Descripción', type: 'textarea', placeholder: 'Descripción del curso', required: true },
          { name: 'imagen_portada', label: 'Portada', type: 'file', placeholder: 'Imagen de portada', required: !item },
          { name: 'profesor_id', label: 'ID Profesor', type: 'number', placeholder: 'ID del profesor', required: true },
          { name: 'es_gratuito', label: 'Gratuito', type: 'checkbox', placeholder: '', required: false }
        ];
        break;
    }  
  
    this.formFields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      this.form.addControl(field.name, this.fb.control(item ? item[field.name] : '', validators));
    });
  }

  getTypeName(type: string): string {
    const names: {[key: string]: string} = {
      'curso': 'Curso',
      'estudiante': 'Estudiante',
      'profesor': 'Profesor'
    };
    return names[type] || 'Elemento';
  }

  submitForm(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      
      // Crear FormData para manejar archivos si es necesario
      const courseData = new FormData();
      
      // Agregar todos los campos al FormData
      Object.keys(formData).forEach(key => {
        courseData.append(key, formData[key]);
      });

      if (this.currentCourseId) {
        // Lógica para actualizar curso (necesitarías implementar updateCourse en el servicio)
        // this.coursesService.updateCourse(this.currentCourseId, courseData).subscribe(...)
      } else {
        // Crear nuevo curso
        this.coursesService.createCourse(courseData).subscribe({
          next: (response) => {
            console.log('Curso creado:', response);
            this.loadCourses(); // Recargar la lista
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al crear curso:', err);
          }
        });
      }
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.form.reset();
  }
  
  deleteItem(id: any, type: string): void {
    if (confirm(`¿Estás seguro de eliminar este ${this.getTypeName(type).toLowerCase()}?`)) {
      if (type === 'curso') {
        this.coursesService.deleteCourse(id).subscribe({
          next: () => {
            // Eliminar el curso del array local para actualizar la vista sin recargar
            this.cursos = this.cursos.filter(curso => curso.id !== id);
            console.log('Curso eliminado con éxito');
          },
          error: (err) => {
            console.error('Error al eliminar curso:', err);
            // Puedes mostrar un mensaje de error al usuario aquí
          }
        });
      }
      // Puedes agregar más casos para otros tipos (profesores, estudiantes, etc.)
    }
  }

  deleteComment(id: number): void {
    if (confirm('¿Estás seguro de eliminar este comentario?')) {
      // Lógica para eliminar comentario
      console.log('Eliminar comentario con ID:', id);
    }
  }

  cancelInscription(id: number): void {
    if (confirm('¿Estás seguro de cancelar esta inscripción?')) {
      // Lógica para cancelar inscripción
      console.log('Cancelar inscripción con ID:', id);
    }
  }

  viewDetails(id: string, type: string): void {
    console.log(`Ver detalles de ${type} con ID:`, id);
  }

  viewAssignments(id: string): void {
    console.log('Ver asignaciones del profesor con ID:', id);
    this.setActiveTab('asignaciones');
  }

  editInscription(inscripcion: any): void {
    console.log('Editar inscripción:', inscripcion);
  }
}
