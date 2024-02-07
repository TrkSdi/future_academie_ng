import { Component } from '@angular/core';
import { FavoriteListService } from '../services/favorite-list.service';
import { ActivatedRoute } from '@angular/router';
import { tokenInterceptor } from '../token.interceptor';
import { Favorite } from '../interface/favorite-interface';
import { FavoriteListComponent } from '../favorite-list/favorite-list.component';

@Component({
  selector: 'app-shared-favorites',
  standalone: true,
  imports: [FavoriteListComponent],
  templateUrl: './shared-favorites.component.html',
  styleUrl: './shared-favorites.component.css'
})

export class SharedFavoritesComponent {

  constructor(private favListService: FavoriteListService, private route: ActivatedRoute) { }
  favorites: Favorite[] = []
  ngOnInit() {
    this.getFavorites();
  }

  getFavorites() {
    const token = this.route.snapshot.paramMap.get('token');
    this.favListService.getSharedFavorites(token!).subscribe({
      next: (favorites: any) => {
        this.favorites = favorites;
      }
    });
  }
}