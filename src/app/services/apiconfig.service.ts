import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiconfigService {

  constructor() { }
  private apiUrl = environment.API_URL;
  getAPIUrl(): string {
    return this.apiUrl;
  }
}
