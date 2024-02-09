import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, Alert } from '../services/alert.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private auth: AuthService, private login: LoginService, private alertService: AlertService,
    private router: Router) { }

  alerts: Alert[] = [];
  isAuthenticated$: BehaviorSubject<boolean> = this.auth.authenticated$;
  isNavActive: boolean = false;

  ngOnInit() {
    this.alertService.alert$.subscribe((alert) => {
      this.alerts.push(alert);
    })
  }

  close(alert: Alert) {
    const index = this.alerts.findIndex((a) => a === alert);
    if (index !== -1) {
      this.alerts.splice(index, 1);
    }
  }


  toggleNav() {
    this.isNavActive = !this.isNavActive;
  }

  allowGoBack() {
    if (!this.router.url.includes("creation")) {
      this.login.setCanGoBack(false);
    }
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        // refresh token is sent to the backend on logout to blacklist so
        // tokens should not be removed before successful logout HTTP request
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.auth.authenticated$.next(false);
        this.alertService.showAlert({
          type: "success", message: "Vous êtes déconnecté.e. A bientôt!",
          object_id: ""
        })
        this.router.navigateByUrl('/login');

      }
    });
  }


}

