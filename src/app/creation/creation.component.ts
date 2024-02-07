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

  apiUrl: string = this.api.getAPIUrl();

  // "smalltext" blank initialisation
  texteSmallConfirmEmail: string = '';
  texteSmallEmail: string = '';
  texteSmallConfirmPassword: string = '';

  //boolean variable to change Ngclass (text color) in case of succes or not
  validationNOK: boolean = false;
  validationOK: boolean = false;
  validationCreation: boolean = true;

  // boolean variable to indicate which password parameter is respected or not
  isLengthValid: boolean = false;
  isNumberValid: boolean = false;
  isLowerCaseValid: boolean = false;
  isUpperCaseValid: boolean = false;
  isSpecialCharValid: boolean = false;

  // function to test if password parameters are ok or not
  onPasswordChange(password: string) {
    this.isLengthValid = password.length >= 8;
    this.isNumberValid = /\d/.test(password);
    this.isLowerCaseValid = /[a-z]/.test(password);
    this.isUpperCaseValid = /[A-Z]/.test(password);
    this.isSpecialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  // fonction to test (when keyup) if email has good format regarding to the regex and change small text appropriate
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

  // fonction to compare passwords in order to know if they are egals
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

  // fonction to compare emails in order to know if they are egals
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

  // principal fonction to send to information in json for back
  enregistrement() {
    // catch different information needed : text inside input element
    const emailValue = (
      document.getElementById('InputEmail') as HTMLInputElement
    ).value;
    const passwordValue = (
      document.getElementById('InputPassword') as HTMLInputElement
    ).value;
    const firstNameValue = (
      document.getElementById('InputFirstName') as HTMLInputElement
    ).value;
    const lastNameValue = (
      document.getElementById('InputLastName') as HTMLInputElement
    ).value;

    // transform email and password in json format in order to be understandable by the back
    var jsonObj = {
      email: emailValue,
      first_name: firstNameValue,
      last_name: lastNameValue,
      password: passwordValue,
    };
    var jsonStr = JSON.stringify(jsonObj);

    // variables which permit to fetch information in the good route for auth user
    var url = this.apiUrl + '/auth/users/';
    var options = {
      method: 'POST', //envoyer données
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonStr,
    };

    // conditions to fetch : same passwords, same emails, good email format
    if (this.passwordsMatch && this.isEmailValid && this.emailsMatch) {
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          // test if fetch answer informs us that an user with the same email adress already exists
          if (data.email[0] !== 'user with this email already exists.') {
            //show or hide buttons in function
            this.validationOK = true;
            this.validationCreation = false;
            this.validationNOK = false;
          } else {
            this.validationNOK = true;
            this.validationOK = false;
            this.validationCreation = false;
          }
        })
        // in case of error, send information in console.log
        .catch((error) => {
          console.error("Erreur lors de l'envoi de la requête:", error);
        });
    }
  }

  // link to go when process of creation is ok
  redirectionLogin() {
    this.router.navigateByUrl('/login');
  }

  // reload page in case of email address already exists
  rechargementPage() {
    location.reload();
  }
}
