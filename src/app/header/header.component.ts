import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  menuValue: boolean = false;
  menu_icon: string = 'bi bi-list';
  is_authenticated = this.auth.check_authentication().subscribe({ next: (result) => { return result } });;
  logout_message: string = '';
  constructor(private auth: AuthService) { }

  openMenu() {
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }
  closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.logout_message = "Déconnexion Réussie";
        console.log(this.logout_message);
        setTimeout(() => {
          this.logout_message = '';
        }, 5000);
      }
    });
  }


}

