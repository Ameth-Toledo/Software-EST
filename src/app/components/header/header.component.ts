import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isAuthenticated: boolean = false;
  isMenuOpen: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  sendToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['login']);
  }

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }

  sendToHomeUser(event: Event){
    event.preventDefault();
    this.router.navigate(['home'])
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goTo(route: string) {
    if (route === 'config') {
      this.router.navigate(['/perfil']);
    } else if (route === 'home') {
      this.router.navigate(['']);
    }
    this.isMenuOpen = false;
  }  
}

