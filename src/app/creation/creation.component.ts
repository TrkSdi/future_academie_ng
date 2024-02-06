import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ApiconfigService } from '../services/apiconfig.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './creation.component.html',
  styleUrl: './creation.component.css',
})
export class CreationComponent {
  constructor(
    private location: Location,
    private api: ApiconfigService,
    private router: Router
  ) {}

  texteSmallConfirmEmail: string = '';
  texteSmallEmail: string = '';
  texteSmallConfirmPassword: string = '';
  validationNOK: boolean = false;
  validationOK: boolean = false;
  validationCreation: boolean = true;
  apiUrl: string = this.api.getAPIUrl();

  isLengthValid: boolean = false;
  isNumberValid: boolean = false;
  isLowerCaseValid: boolean = false;
  isUpperCaseValid: boolean = false;
  isSpecialCharValid: boolean = false;

  onPasswordChange(password: string) {
    this.isLengthValid = password.length >= 8;
    this.isNumberValid = /\d/.test(password);
    this.isLowerCaseValid = /[a-z]/.test(password);
    this.isUpperCaseValid = /[A-Z]/.test(password);
    this.isSpecialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  isEmailValid: boolean = false;
  onEmailChange(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailRegex.test(email);

    if (this.isEmailValid) {
      this.texteSmallEmail = 'Adresse e-mail valide.';
    } else {
      this.texteSmallEmail = 'Adresse e-mail invalide.';
    }
    return this.isEmailValid;
  }

  passwordsMatch: boolean = false;
  onComparePasswords(password: string, confirmationPassword: string) {
    this.passwordsMatch = password === confirmationPassword;
    if (this.passwordsMatch) {
      this.texteSmallConfirmPassword = 'Les mots de passe correspondent.';
    } else {
      this.texteSmallConfirmPassword =
        'Les mots de passe ne correspondent pas.';
    }
    return this.passwordsMatch;
  }

  emailsMatch: boolean = false;
  onCompareEmails(email: string, confirmationEmail: string) {
    this.emailsMatch = email === confirmationEmail;
    if (this.emailsMatch) {
      this.texteSmallConfirmEmail = 'Les adresses email correspondent.';
    } else {
      this.texteSmallConfirmEmail = 'Les adresses email ne correspondent pas.';
    }
    return this.passwordsMatch;
  }

  enregistrement() {
    // on va attraper les différentes constantes utiles dans le template
    const emailValue = (
      document.getElementById('InputEmail') as HTMLInputElement
    ).value;
    const emailConfirmationValue = (
      document.getElementById('InputConfirmationEmail') as HTMLInputElement
    ).value;
    const passwordValue = (
      document.getElementById('InputPassword') as HTMLInputElement
    ).value;
    const passwordConfirmationValue = (
      document.getElementById('InputConfirmationPassword') as HTMLInputElement
    ).value;

    // transformation de l'email et mot de passe en formation json pour renvoyer à l'url
    var jsonObj = {
      email: emailValue,
      password: passwordValue,
    };
    var jsonStr = JSON.stringify(jsonObj);

    // variables permettant de fetch les informations à l'adresse url
    var url = this.apiUrl + '/auth/users/';
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonStr,
    };
    console.log(
      'passwordsmatch:',
      this.passwordsMatch,
      'emailsmatch:',
      this.emailsMatch,
      'emailvalid:',
      this.isEmailValid
    );
    // condition pour envoyer les infos : même mot de passe + regex email
    if (this.passwordsMatch && this.isEmailValid && this.emailsMatch) {
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.email[0] !== 'user with this email already exists.') {
            this.validationOK = true;
            this.validationCreation = false;
            this.validationNOK = false;
          } else {
            this.validationNOK = true;
            this.validationOK = false;
            this.validationCreation = false;
          }
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi de la requête:", error);
        });
    }
  }

  redirectionLogin() {
    this.router.navigateByUrl('/login');
  }

  rechargementPage() {
    location.reload();
  }
}
