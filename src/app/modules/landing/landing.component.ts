import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Router } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor (private router : Router) {}

  sendToLogin(event : Event) {
    event.preventDefault();
    this.router.navigate(['login']);
    console.log("Login button clicked");
  }
}
