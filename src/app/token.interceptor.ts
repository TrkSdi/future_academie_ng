import { HttpClient, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthService } from './services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
  HttpHandlerFn) => {
  const auth = inject(AuthService);
  const is_authenticated = auth.check_authentication().subscribe({ next: (result) => { return result } });
  if (is_authenticated) {
    const access_token: string | null = localStorage.getItem('access_token');
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${access_token}`)
    });
    return next(modifiedReq);
  } else {
    return next(req);
  }
}
