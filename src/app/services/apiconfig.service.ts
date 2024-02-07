import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiconfigService {

  constructor() { }
  private apiUrl = environment.API_URL;
  private frontUrl = environment.FRONT_URL;

  getAPIUrl(): string {
    return this.apiUrl;
  }

  getFrontUrl(): string {
    return this.frontUrl;
  }
}
