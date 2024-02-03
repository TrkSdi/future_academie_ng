import { Injectable } from '@angular/core';
import { ApiconfigService } from './apiconfig.service';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api: ApiconfigService, private auth: AuthService) { }

  getUserID(): string | null {
    const is_authenticated = this.auth.check_authentication().subscribe({ next: (result) => { return result } });;
    if (is_authenticated) {
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