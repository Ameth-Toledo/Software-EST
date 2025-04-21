import { Component } from '@angular/core';
import { TechCardComponent } from "../tech-card/tech-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tecnologias',
  standalone: true,
  imports: [TechCardComponent, CommonModule],
  templateUrl: './tecnologias.component.html',
  styleUrl: './tecnologias.component.scss'
})
export class TecnologiasComponent {
  tecnologias = [
    { iconPath: 'assets/icons/angular.svg', techName: 'Angular' },
    { iconPath: 'assets/icons/github.svg', techName: 'Github' },
    { iconPath: 'assets/icons/go.svg', techName: 'Go' },
    { iconPath: 'assets/icons/postman.svg', techName: 'Postman' },
    { iconPath: 'assets/icons/linux.svg', techName: 'Linux' },
    { iconPath: 'assets/icons/mysql.svg', techName: 'MySQL' },
    { iconPath: 'assets/icons/typescript.svg', techName: 'TypeScript' },
    { iconPath: 'assets/icons/python.svg', techName: 'Python' },
    { iconPath: 'assets/icons/javascript.svg', techName: 'JavaScript' },
    { iconPath: 'assets/icons/c.svg', techName: 'C++' },
    { iconPath: 'assets/icons/java.svg', techName: 'Java' },
    { iconPath: 'assets/icons/arduino.svg', techName: 'Arduino' },
    { iconPath: 'assets/icons/figma.svg', techName: 'Figma' },
    { iconPath: 'assets/icons/corel.svg', techName: 'Corel Draw' },
    { iconPath: 'assets/icons/photoshop.svg', techName: 'Photoshop' },
    { iconPath: 'assets/icons/aws.svg', techName: 'AWS' },
    { iconPath: 'assets/icons/nodejs.svg', techName: 'Node JS' },
    { iconPath: 'assets/icons/postgresql.svg', techName: 'PostgreSQL' },
    { iconPath: 'assets/icons/react.svg', techName: 'React' },
    { iconPath: 'assets/icons/vercel.svg', techName: 'Vercel' },
    { iconPath: 'assets/icons/nginx.svg', techName: 'Nginx' },
    { iconPath: 'assets/icons/rabbitmq.svg', techName: 'RabbitMQ' },
    { iconPath: 'assets/icons/tailwind.svg', techName: 'Tailwind' },
    { iconPath: 'assets/icons/html.svg', techName: 'HTML' },
    { iconPath: 'assets/icons/css.svg', techName: 'CSS' }
  ];
}
