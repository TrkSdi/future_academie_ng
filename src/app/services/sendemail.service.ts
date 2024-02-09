import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiconfigService } from '../services/apiconfig.service';

@Injectable({
  providedIn: 'root',
})
export class SendemailService {
  constructor(private http: HttpClient, private api: ApiconfigService) {}

  apiUrl: string = this.api.getAPIUrl();

  sendEmail() {
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

    const recipient: string = 'damienvialla@yahoo.fr';

    var url = this.apiUrl + '/API_public/sendemail';
    console.log(subject, textEmail, 'damienvialla@yahoo.fr', recipient);
    return this.http.post<any>(url, { recipient, subject, textEmail });
  }
}
