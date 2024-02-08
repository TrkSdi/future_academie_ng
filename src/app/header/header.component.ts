import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';
import { BehaviorSubject, Observable } from 'rxjs';
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


  isAuthenticated$: BehaviorSubject<boolean> = this.auth.authenticated$;
  logout_message: string = '';
  isNavActive: boolean = false;

  toggleNav() {
    this.isNavActive = !this.isNavActive;
  }

  allowGoBack() {
    if (!this.router.url.includes("creation")) {
      this.login.setCanGoBack(false);
    }
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        // refresh token is sent to the backend on logout to blacklist so
        // tokens should not be removed before successful logout HTTP request
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.auth.authenticated$.next(false);
        this.logout_message = "Déconnexion Réussie";
        this.router.navigateByUrl('/login');
        setTimeout(() => {
          this.logout_message = '';
        }, 3000);
      }
    });
  }


}

