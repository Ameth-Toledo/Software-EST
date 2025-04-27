import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-soporte-tecnico',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './soporte-tecnico.component.html',
  styleUrl: './soporte-tecnico.component.scss'
})
export class SoporteTecnicoComponent implements OnInit {
  reportForm: FormGroup;
  faqItems = [
    {
      question: '¿Cómo restablezco mi contraseña?',
      answer: 'Contacta por correo electrónico a <strong>shakerzest&#64;gmail.com</strong> con el asunto: "Recuperación de contraseña". Incluye tu correo electrónico registrado y nombre de usuario. Nuestro equipo de soporte te enviará las instrucciones para recuperar tu contraseña en un plazo máximo de 24 horas.',
      active: false
    },
    {
      question: '¿Qué hago si no puedo acceder a un curso?',
      answer: 'Si no puedes acceder a un curso, por favor completa el formulario de reporte que se encuentra en la parte inferior de esta página. Describe el problema con detalle e incluye el nombre del curso afectado. Nuestro equipo resolverá tu incidencia lo antes posible.',
      active: false
    },
    {
      question: '¿Cómo reporto un problema técnico?',
      answer: 'Para reportar problemas técnicos puedes:<ol><li>Usar el formulario de reporte al final de esta página</li><li>Contactarnos por correo electrónico a shakerzest&#64;gmail.com</li><li>Iniciar un chat en línea con nuestro equipo de soporte</li></ol><p>Incluye capturas de pantalla si es posible para ayudarnos a identificar el problema más rápido.</p>',
      active: false
    }
  ];

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      course: ['', Validators.required],
      issue: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  toggleFaq(index: number): void {
    this.faqItems[index].active = !this.faqItems[index].active;
    // Cerrar otros FAQs abiertos
    this.faqItems.forEach((item, i) => {
      if (i !== index) {
        item.active = false;
      }
    });
  }

  openChat(): void {
    // Aquí implementarías la lógica para abrir el chat
    alert('Funcionalidad de chat será implementada próximamente');
  }

  submitReport(): void {
    if (this.reportForm.valid) {
      // Aquí implementarías el envío del formulario
      console.log('Formulario enviado:', this.reportForm.value);
      alert('Reporte enviado con éxito. Nos contactaremos contigo pronto.');
      this.reportForm.reset();
    } else {
      this.reportForm.markAllAsTouched();
    }
  }
}
