import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-developer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './developer-card.component.html',
  styleUrl: './developer-card.component.scss'
})
export class DeveloperCardComponent {
  @Input() imageUrl: string = '';
  @Input() name: string = '';
  @Input() role: string = '';
  @Input() techLogos: string[] = [];
}
