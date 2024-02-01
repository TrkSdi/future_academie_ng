import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiconfigService {
  constructor() { }
  private apiUrl = "http://127.0.0.1:8000";

  getAPIUrl(): string {
    return this.apiUrl;
  }

}
