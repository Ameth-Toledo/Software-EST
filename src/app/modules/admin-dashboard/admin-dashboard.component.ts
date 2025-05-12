import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses/courses.service';
import { Courses } from '../../models/courses';
import { UsersService } from '../../services/users/users.service';
import { user } from '../../models/user';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, FooterComponent, HeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'cursos';
  showModal: boolean = false;
  modalTitle: string = '';
  currentItemType: string = '';
  form: FormGroup;
  formFields: any[] = [];
  currentCourseId: number | null = null;
  currentModuleId!: string;
  currentLessonId!: string;
  currentProfessorId!: string; 
  searchTerm: string = '';
  isSearching: boolean = false;
  showAllCourses: boolean = true;
  // Datos de ejemplo
  cursos: Courses[] = [];
  estudiantes: user[] = [];

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
    private coursesService: CoursesService,
    private usersService: UsersService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadEstudiantes();
    this.setupSearch();
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

  loadEstudiantes(): void {
  this.usersService.getUsersByRole(1).subscribe({
    next: (response) => {
      this.estudiantes = response.users; // Accede a la propiedad 'users'
    },
    error: (err) => {
      console.error('Error al cargar estudiantes:', err);
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

    if (type === 'estudiante') {
      // Cargar los datos del estudiante en el formulario, incluyendo el ID
      this.form.patchValue({
        id: item.id,
        nombre: item.nombre,
        apellido: item.apellido,
        correo: item.correo,
        plan: item.plan,
      });
    }

    this.showModal = true;
  }

  prepareForm(type: string, item?: any): void {
    this.form = this.fb.group({});
    this.formFields = [];

    switch (type) {
      case 'curso':
        this.formFields = [
          { name: 'titulo', label: 'Título', type: 'text', placeholder: 'Título del curso', required: true },
          { name: 'descripcion', label: 'Descripción', type: 'textarea', placeholder: 'Descripción del curso', required: true },
          { name: 'imagen_portada', label: 'Portada', type: 'file', placeholder: 'Imagen de portada', required: !item },
          { name: 'profesor_id', label: 'ID Profesor', type: 'number', placeholder: 'ID del profesor', required: true },
          { name: 'es_gratuito', label: 'Gratuito', type: 'checkbox', placeholder: '', required: false }
        ];
        break;
      case 'estudiante':
        this.formFields = [
          { name: 'id', label: 'ID', type: 'hidden', required: true }, // Campo oculto para el ID
          { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Nombre del estudiante', required: true },
          { name: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Apellido del estudiante', required: true },
          { name: 'correo', label: 'Correo', type: 'email', placeholder: 'Correo electrónico', required: true },
          { name: 'plan', label: 'Plan', type: 'text', placeholder: 'Plan del estudiante', required: true }
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

      if (this.currentItemType === 'estudiante') {
        // Lógica para actualizar estudiante
        this.usersService.updateUser(formData.id, formData).subscribe({
          next: (response) => {
            console.log('Estudiante actualizado:', response);
            this.loadEstudiantes(); // Recargar la lista de estudiantes
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al actualizar estudiante:', err);
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
      } else if (type === 'estudiante') {
        this.usersService.deleteUser(id).subscribe({
          next: () => {
            // Eliminar el estudiante del array local para actualizar la vista sin recargar
            this.estudiantes = this.estudiantes.filter(estudiante => estudiante.id !== id);
            console.log('Estudiante eliminado con éxito');
          },
          error: (err) => {
            console.error('Error al eliminar estudiante:', err);
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

  setupSearch(): void {
    this.coursesService.searchResults$.subscribe(results => {
      this.cursos = results;
      this.isSearching = false;
    });
  }

  onSearchInput(): void {
    if (this.searchTerm.trim() === '') {
      this.showAllCourses = true;
      this.loadCourses();
      return;
    }

    this.isSearching = true;
    this.showAllCourses = false;
    
    this.coursesService.searchCoursesByName(this.searchTerm).subscribe({
      next: (courses) => {
        this.cursos = courses;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Error en la búsqueda:', err);
        this.isSearching = false;
      }
    });
  }

  // En admin-dashboard.component.ts
onFileChange(event: any, fieldName: string): void {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.form.get(fieldName)?.setValue(file);
  }
}
}
