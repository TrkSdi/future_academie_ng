import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  /**
   * This service allows other components to communicate to the login page whether
   * the user has been redirected to the login page by the Guard and whether login
   * was reached from within the website in which case the login page can redirect the 
   * user back to that page after login.
   */

  constructor() { }

  // Variable to check if login can return to a previous page in the application
  // to avoid goBack() being used when it would send the user to another website
  private canGoBack: boolean = false;
  auth_required: boolean = false;

  setCanGoBack(value: boolean = true) {
    this.canGoBack = value;
  }

  checkCanGoBack() {
    return this.canGoBack;
  }
}
