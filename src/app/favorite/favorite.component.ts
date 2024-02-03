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

  addFavorite(program_id: number) {
    const user_id: string | null = this.user.getUserID();
    if (user_id) {
      this.favService.createFavorite(program_id, user_id).subscribe({
        next: (results) => {
          console.log(results); // this is temporary will add real directions later
          // idea is this function is used by clicking "add favorite" on a program
          // and then it opens an individual favorite page where you 
          //can add a status or a note and save it
        }
      });
    }
  }
}
