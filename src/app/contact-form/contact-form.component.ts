import { Component } from '@angular/core';
import { SendemailService } from '../services/sendemail.service';
import { HttpClient } from '@angular/common/http';
import { ApiconfigService } from '../services/apiconfig.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent {
  constructor(private api: ApiconfigService) {}

  // Route for api
  apiUrl: string = this.api.getAPIUrl();

  sendEmail() {
    // take all variable we need and adapt them
    const nom: string = (
      document.getElementById('lastName') as HTMLInputElement
    ).value;
    const prenom: string = (
      document.getElementById('firstName') as HTMLInputElement
    ).value;
    const email: string = (document.getElementById('email') as HTMLInputElement)
      .value;
    const text: string = (document.getElementById('text') as HTMLInputElement)
      .value;

    const textEmail: string = `Nom: ${nom}\nPrénom: ${prenom}\nAdresse Email: ${email}\n\nMessage:\n${text}`;
    const subject: string = `Nouveau message de formulaire de contact de ${nom} ${prenom}`;

    // create json variable to send to back with creation stringify
    var jsonObj = {
      textEmail: textEmail,
      subject: subject,
      recipient: email,
    };
    var jsonStr = JSON.stringify(jsonObj);

    // variables which permit to fetch information in the good route for send email view methode
    var url = this.apiUrl + '/API_public/sendemail/send_email_view/';
    var options = {
      method: 'POST', //post methode
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonStr,
    };

    // fetch to send
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => console.log(data))
      // in case of error, send information in console.log
      .catch((error) => {
        console.error("Erreur lors de l'envoi de la requête:", error);
      });
  }
}
