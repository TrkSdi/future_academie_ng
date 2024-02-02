import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FavoriteService } from '../services/favorite.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
  constructor(private user: UserService, private favService: FavoriteService) { }

  addFavorite(program_id: number, status: string) {
    const user_id: string | null = this.user.getUserID();
    if (user_id) {
      this.favService.createFavorite(program_id, status, user_id).subscribe({
        next: (results) => {
          console.log(results); // this is temporary will add real directions later
        }
      });
    }
  }
}
