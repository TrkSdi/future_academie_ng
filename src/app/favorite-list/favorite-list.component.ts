// Angular Modules
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { map, Observable, of, Subject, Subscription } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Local Imports
import { AlertService, Alert } from "../services/alert.service";
import { ApiconfigService } from '../services/apiconfig.service';
import { Favorite } from '../interface/favorite-interface';
import { FavoriteListService } from '../services/favorite-list.service';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, NgbModule, RouterModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent {

  constructor(
    private router: Router,
    private favListService: FavoriteListService,
    private alertService: AlertService,
    private api: ApiconfigService) { }

  // Necessary for the shared favorites component
  @Input() favorites$: Observable<Favorite[]> = of([]);
  route: string = this.router.url;

  // Pagination variables
  count: number | null = null;
  nextUrl: string | null = null;
  previousUrl: string | null = null;

  // For creating a temporary link to share the favorite list
  expirationDate: Subject<any> = new Subject();
  isShare: boolean = this.router.url.includes("share");
  shareUrlBase: string = this.api.getFrontUrl() + "/favorite/share/";
  shareToken$: Subject<string> = new Subject();

  // Alert and subscription handling
  alerts: Alert[] = [];
  subscriptions: Subscription = new Subscription();

  ngOnInit() {
    if (!this.router.url.includes("share")) {
      this.getFavorites();

      this.subscriptions.add(
        this.alertService.alert$.subscribe((alert) => {
          this.alerts.push(alert);
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  /**
   * This function creates a temporary link for sharing the favorites list
   * page publicly.
   */
  shareFavorites(): void {
    this.subscriptions.add(
      this.favListService.shareFavorites().subscribe({
        next: (response: any) => (this.shareToken$.next(response.token),
          this.expirationDate.next(response.exp)),
        error: (error: any) => {
          this.alertService.showAlert({
            type: "warning",
            message: `Une erreur a empêchée la création de partage de vos favoris. Error: $(error.message)`,
            object_id: ""
          })
        }
      })
    )
  }

  /**
   * This function loads the list of favorites.
   * @param url : string to provide when viewing 2nd + page
   */
  getFavorites(url?: string): void {
    this.subscriptions.add(
      this.favListService.getFavorites(url).subscribe({
        next: (response) => {
          this.favorites$ = of(response.results);
          this.nextUrl = response.next;
          this.previousUrl = response.previous;
          this.count = response.count;
        },
        error: (error: any) => {
          this.alertService.showAlert({
            type: "warning",
            message: `Une erreur a empêchée le chargement de vos favoris. Error: $(error.message)`,
            object_id: ""
          })
        }
      })
    );
  }


  //Functions for navigation

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


  // Functions for deleting favorites
  /**
   * This function allows the user to confirm before deleting a favorite from their list.
   * @param favorite_id : string of the ID of the favorite to delete
   */
  confirmDelete(favorite_id: string) {
    this.alertService.showAlert({
      type: "danger", message: "Vous êtes certain.e de vouloir supprimer ce programme de votre liste de favoris?",
      object_id: favorite_id
    })
  }

  /**
   * This function permanently deletes a favorite from the user's list.
   * @param favorite_id_del 
   */
  deleteFavorite(favorite_id_del: string): void {
    this.subscriptions.add(
      this.favListService.deleteFavorite(favorite_id_del).subscribe({
        next: (response) => {
          // Update the favorites list by filtering out the item with the specified id
          this.favorites$ = this.favorites$.pipe(
            map((favorites: Favorite[]) => favorites.filter(favorite => favorite.id !== favorite_id_del))
          );
          this.alertService.showAlert({
            type: "success", message: "Le favoris a été supprimé.",
            object_id: ""
          })
        },
        error: (error) => {
          this.alertService.showAlert({
            type: "danger", message: "Une erreur est survenue. Merci de réessayer.",
            object_id: favorite_id_del
          })
        }
      })
    );
  }
}

