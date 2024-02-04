import { Component } from '@angular/core';
import { FavoriteListService } from '../services/favorite-list.service';
import { Favorite } from '../interface/favorite-interface';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent {

  favorites: Favorite[] = [];
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  count: number | null = null;

  constructor(private favListService: FavoriteListService) { }

  ngOnInit() {
    this.getFavorites();
  }

  getFavorites(url?: string): void {
    this.favListService.getFavorites(url).subscribe((response) => {
      this.favorites = response.results;
      this.nextUrl = response.next;
      this.previousUrl = response.previous;
      this.count = response.count;
    })
  }

  loadNextPage(): void {
    if (this.nextUrl) {
      this.getFavorites(this.nextUrl);
    }
  }

  loadPreviousPage(): void {
    if (this.previousUrl) {
      this.getFavorites(this.previousUrl);
    }
  }

  deleteFavorite(favorite_id: string) {
    return this.favListService.deleteFavorite(favorite_id).subscribe({
      next: (response) => { console.log(response) },
      error: (error) => { console.log(error) }
    }
    );
  }
}
