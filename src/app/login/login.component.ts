import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private auth: AuthService, private location: Location, private router: Router, private loginService: LoginService) { }
  error: string = "";
  authRequiredMessage: boolean = this.loginService.auth_required;

  login(email: string, password: string,) {
    this.auth.login(email, password).subscribe(
      {
        next: (response) => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          if (this.loginService.checkCanGoBack()) {
            this.location.back();
          } else {
            this.router.navigateByUrl('/');

          }
        },
        error: (error) => this.handleError(error)
      }
    );
  }

  handleError(error: any) {
    if (error.status === 401) {
      this.error = "Incorrect email ou mot de passe."
      // à faire: gérer quand quelqu'un est bloqué par axes, pour le moment
      // axes refus d'envoyer un code HTTP qui indique que c'est bloqué
    }
    else {
      this.error = "Une erreur est survenue. Merci de réessayer."
    }
  }
}