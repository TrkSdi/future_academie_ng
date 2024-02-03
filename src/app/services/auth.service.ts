import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private api: ApiconfigService) { }

  apiUrl = this.api.getAPIUrl();
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  //get a token which will be saved to local storage by the login component
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/jwt/create', { email, password }).pipe(map((response) => ({ refresh: response.refresh, access: response.access })));
  }

  // check if the user has a JWT token that is not expired, note that this does not 
  // confirm that it is valid - only the back end can do this 
  check_authentication(): Observable<boolean> {
    const access_token: string | null = localStorage.getItem('access_token');
    const refresh_token: string | null = localStorage.getItem('refresh_token');
    const decoded_access_token: JwtPayload | any = access_token ? jwtDecode(access_token) : null;
    const decoded_refresh_token: JwtPayload | any = refresh_token ? jwtDecode(refresh_token) : null;
    const current_time: number = new Date().getTime()

    if (!access_token) {
      this.isAuthenticated.next(false);
      return this.isAuthenticated.asObservable();
      // if token isn't expired, return true
    } else if (decoded_access_token.exp * 1000 > current_time) {
      this.isAuthenticated.next(true);
      return this.isAuthenticated.asObservable();
      // if refresh token isn't expired, refresh access token and return true result of a new check 
    } else if (decoded_refresh_token.exp * 1000 > current_time) {
      // remove expired access token
      localStorage.removeItem('access_token');
      const refreshSubject = new BehaviorSubject<boolean>(false);
      this.refresh_token(refresh_token).subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.access);
          refreshSubject.next(true);  // Indicate successful refresh
        },
        error: () => {
          refreshSubject.next(false);  // Indicate failed refresh
        },
      });
      // Return an observable that will emit true when the refresh is successful
      return refreshSubject.asObservable();
      // otherwise user is not authenticated
    } else {
      // remove expired access token
      localStorage.removeItem('access_token');
      this.isAuthenticated.next(false);
      return this.isAuthenticated.asObservable();
    }
  }

  refresh_token(refresh_token: string | null): Observable<any> {
    const url = this.api.getAPIUrl() + '/auth/jwt/refresh';
    const data = { "refresh": refresh_token }
    return this.http.post<any>(url, data).pipe(map((response) => ({ access: response.access })));
  }

  logout(): Observable<any> { //to sort out tomorrow!
    const url = this.api.getAPIUrl() + '/auth/logout';
    const data = {
      "refresh": "tokenrefresh.tokenrefresh",
    }
    return this.http.post<any>(url, data);

  }



}