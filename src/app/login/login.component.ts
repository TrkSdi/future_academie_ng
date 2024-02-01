import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private auth: AuthService, private location: Location) { }
  error: string = "";

  login(email: string, password: string) {
    this.auth.login(email, password).subscribe(
      {
        next: (response) => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          this.goBack();
        },
        error: (error) => this.handleError(error)
      }
    );
  }

  handleError(error: any) {
    if (error.status === 401) {
      this.error = "Incorrect email ou mot de passe."
      // à faire: gérer quand quelqu'un 
    }
    else {
      this.error = "Une erreur est survenue. Merci de réessayer."
    }
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {

  }


}
