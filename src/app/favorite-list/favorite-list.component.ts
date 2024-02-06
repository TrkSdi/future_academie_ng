import { Component } from '@angular/core';
import { FavoriteListService } from '../services/favorite-list.service';
import { Favorite } from '../interface/favorite-interface';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AlertService, Alert } from '../services/alert.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent {

  favorites: Favorite[] = [];
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  count: number | null = null;
  alerts: Alert[] = [];

  constructor(private favListService: FavoriteListService, private alertService: AlertService) { }

  ngOnInit() {
    this.getFavorites();
    this.alertService.alert$.subscribe((alert) => {
      this.alerts.push(alert);
    })
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
  close(alert: Alert) {
    const index = this.alerts.findIndex((a) => a === alert);
    if (index !== -1) {
      this.alerts.splice(index, 1);
    }
  }

  confirmDelete(favorite_id: string) {
    this.alertService.showAlert({ type: "danger", message: "Are you sure you want to delete" + favorite_id + " ?", object_id: favorite_id })
  }
  deleteFavorite(favorite_id: string) {
    return this.favListService.deleteFavorite(favorite_id).subscribe({
      next: (response) => { console.log(response) },
      error: (error) => { console.log(error) }
    }
    );
  }
}
