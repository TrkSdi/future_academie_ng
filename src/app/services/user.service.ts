import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: AuthService) { }

  getUserID(): string | null {
    if (this.auth.isAuthenticated()) {
      const token = localStorage.getItem('access_token');
      const decoded_token = jwtDecode(token!) as CustomJwtPayload;
      return decoded_token.user_id
    } else {
      return null
    }
  }
}

interface CustomJwtPayload extends JwtPayload {
  user_id: string;
}