import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { LoginService } from './services/login.service';

/**
 * This Guard service checks whether a user is authenticated and redirects them
 * to the login page if they are not.
 * @param route 
 * @param state 
 * @returns boolean
 */
export const authRequiredGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const loginService = inject(LoginService)

  if (!auth.isAuthenticated()) {
    // Allows login to redirect the user back to the 
    // requested page after login
    loginService.setCanGoBack(true);
    loginService.auth_required = true;
    router.navigateByUrl('/login');

    return false
  }
  return true
}

