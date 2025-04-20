import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-cursos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-cursos.component.html',
  styleUrl: './card-cursos.component.scss'
})
export class CardCursosComponent {
  @Input() imageUrl: string = '';
  @Input() tag: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() duration: string = '';
  @Input() rating: string = '';
  @Input() link: string = '#';
}
