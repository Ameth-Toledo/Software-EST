import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Router } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { CardCursosComponent } from "../../components/card-cursos/card-cursos.component";
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { DeveloperCardComponent } from "../../components/developer-card/developer-card.component";
import { GithubCardComponent } from "../../components/github-card/github-card.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CardCursosComponent, TecnologiasComponent, DeveloperCardComponent, GithubCardComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements AfterViewInit {
  constructor (private router : Router) {}

  sendToLogin(event : Event) {
    event.preventDefault();
    this.router.navigate(['login']);
    console.log("Login button clicked");
  }

  sendToRegister(event : Event) {
    event.preventDefault();
    this.router.navigate(['register'])
  }

  @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef;

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          card.classList.add('animate-in');
          observer.unobserve(card);
        }
      });
    }, {
      threshold: 0.1
    });

    const cards = this.cardsContainer.nativeElement.querySelectorAll('app-github-card');
    cards.forEach((card: Element) => observer.observe(card));
  }
}
