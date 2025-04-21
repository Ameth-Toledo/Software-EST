import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isAuthenticated: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  sendToLogin(event: Event) {
    event.preventDefault();
    if (this.isAuthenticated) {
      this.authService.logout();
    } else {
      this.router.navigate(['login']);
    }
  }

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }
}
