import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable, of, switchMap, catchError, BehaviorSubject } from 'rxjs';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * This service provides authentication needs for the application including login, 
   * logout, checking if the user is authenticated and hopefully one day refreshing tokens.
   **/

  constructor(private http: HttpClient, private api: ApiconfigService) { }

  // Observable of the authentication status for dynamic data binding
  authenticated$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  apiUrl = this.api.getAPIUrl();

  // get JWT tokens Login component will save to local storage
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/jwt/create', { email, password }).pipe(map((response) => ({ refresh: response.refresh, access: response.access })));
  }

  logout(): Observable<any> {
    const url = this.api.getAPIUrl() + '/auth/logout/';
    const refresh_token = localStorage.getItem("refresh_token");
    const data = {
      "refresh": refresh_token,
    }
    this.authenticated$.next(false);
    return this.http.post<any>(url, data);
  }

  // check if the user has a JWT token that is not expired, note that this does not 
  // confirm that it is valid - only the back end can do this 
  isAuthenticated(): boolean {
    const access_token: string | null = localStorage.getItem('access_token');
    const decoded_access_token: JwtPayload | any = access_token ? jwtDecode(access_token) : null;
    const current_time: number = new Date().getTime()

    if (!access_token) {
      this.authenticated$.next(false);
      return false;
    } else if (decoded_access_token.exp * 1000 > current_time) {
      this.authenticated$.next(true);
      return true;
    } else {
      // remove expired access token
      localStorage.removeItem('access_token');
      this.authenticated$.next(false);
      return false;
    }
  }

  // TO DO  figure out how/where to implement this
  refreshToken(refresh_token: string | null): Observable<any> {
    const url = this.api.getAPIUrl() + '/auth/jwt/refresh';
    const data = { "refresh": refresh_token }
    return this.http.post<any>(url, data).pipe(map((response) => ({ access: response.access })));
  }





}