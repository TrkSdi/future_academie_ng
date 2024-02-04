import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private auth: AuthService, private login: LoginService, private router: Router) { }

  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';
  isAuthenticated: Observable<boolean> = this.auth.authenticated;
  logout_message: string = '';

  openMenu() {
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }
  closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }

  allowGoBack() {
    this.login.setCanGoBack(true);
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        // refresh token is sent to the backend on logout to blacklist so
        // tokens should not be removed before successful logout HTTP request
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.logout_message = "Déconnexion Réussie";
        this.router.navigateByUrl('/login');
        setTimeout(() => {
          this.logout_message = '';
        }, 3000);
      }
    });
  }


}

