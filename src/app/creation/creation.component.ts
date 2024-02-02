import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ApiconfigService } from '../services/apiconfig.service';

@Component({
  selector: 'app-creation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './creation.component.html',
  styleUrl: './creation.component.css',
})
export class CreationComponent {
  constructor(private location: Location, private api: ApiconfigService) { }

  texteSmallConfirmEmail: string = '';
  texteSmallConfirmPassword: string = '';
  textButton: string = 'Submit';
  validationNOK: boolean = false;
  validationOK: boolean = false;
  apiUrl: string = this.api.getAPIUrl();

  afficher() {
    // on va atttraper les différentes constantes utiles dans le template
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

    const toto1 = document.getElementById(
      'smallConfirmEmail'
    ) as HTMLInputElement;

    // constante regex pour pouvoir comparer l'email avec l'attendu
    const emailRegex: RegExp =
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

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

    // condition pour envoyer les infos : même mot de passe + regex email
    if (
      passwordValue === passwordConfirmationValue &&
      emailRegex.test(emailValue) &&
      emailValue === emailConfirmationValue
    ) {
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          console.log('Réponse du serveur:', data.email[0]);
          if (data.email[0] !== 'user with this email already exists.') {
            this.validationOK = true;
            this.textButton =
              'Félicitations, vous allez recevoir un email de confirmation. La page va se recharger dans 4 secondes';
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          } else {
            this.validationNOK = true;
            this.textButton =
              'Un compte avec cette adresse email existe déjà - La page va se rechercher dans 4 secondes';
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi de la requête:", error);
        });
    } else {
      if (passwordValue !== passwordConfirmationValue) {
        this.texteSmallConfirmPassword =
          'les deux mots de passe ne sont pas identiques';
      }
      if (emailValue !== emailConfirmationValue) {
        this.texteSmallConfirmEmail =
          'les deux adresses mails ne sont pas identiques';
      } else {
        console.log('format adresse mail non accepté');
      }
    }
  }
}
