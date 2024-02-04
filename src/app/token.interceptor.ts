import { HttpClient, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { switchMap, catchError } from 'rxjs';

/*
* This interceptor adds the access token to all HTTP Requests if the user is authenticated
*/
export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
  HttpHandlerFn) => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) {
    const access_token: string | null = localStorage.getItem('access_token');
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${access_token}`)
    });
    return next(modifiedReq);
  } else {
    return next(req);
  }
}
