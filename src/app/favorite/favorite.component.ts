// Angular Modules
import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, of } from 'rxjs';

// Local Imports
import { Favorite } from '../interface/favorite-interface';
import { FavoriteService } from '../services/favorite.service';
import { StudydetailComponent } from '../studydetail/studydetail.component';
import { StudyProgramDetailService } from '../services/studydetail.service';
import { StudyProgram } from '../interface/study-interface';
import { UserService } from '../services/user.service';
import { Alert, AlertService } from '../services/alert.service';
import { FavoriteListComponent } from '../favorite-list/favorite-list.component';
import { FavoriteListService } from '../services/favorite-list.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [StudydetailComponent, CommonModule, FormsModule, RouterModule, NgbModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
/**
 * This component is used for CRUD operations on a single Favorite. Using this
 * component requires authentication;
 */
export class FavoriteComponent {

  constructor(
    private favService: FavoriteService,
    private route: ActivatedRoute,
    private router: Router,
    private studyProgramService: StudyProgramDetailService,
    private location: Location,
    private alertService: AlertService,
    private favListService: FavoriteListService

  ) {
  }
  editing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  favorite!: Favorite;
  alerts: Alert[] = [];
  favoriteProgram: StudyProgram | null = null;
  successConfirmation$: BehaviorSubject<string> = new BehaviorSubject("");
  status: string = "";
  note: string = "";

  ngOnInit() {
    this.loadFavorite();
    this.alertService.alert$.subscribe((alert) => {
      this.alerts.push(alert);
    });
  }
  close(alert: Alert) {
    const index = this.alerts.findIndex((a) => a === alert);
    if (index !== -1) {
      this.alerts.splice(index, 1);
    }
  }

  confirmDelete(favorite_id: string) {
    this.alertService.showAlert({
      type: "danger", message: "Vous êtes certain.e de vouloir supprimer ce programme de votre liste de favoris?",
      object_id: favorite_id
    })
  }

  deleteFavorite(favorite_id_del: string) {
    return this.favListService.deleteFavorite(favorite_id_del).subscribe({
      next: () => {
        this.router.navigateByUrl("/favorite");
      },
      error: (error: any) => {
        console.log(error); // Handle error
      }
    });
  }

  editForm(): void {
    this.editing$.next(true);

  }

  cancelEdit(): void {
    this.editing$.next(false);
    this.favorite.status = this.status;
    this.favorite.note = this.note;
  }

  goBack() {
    this.location.back()
  }

  saveChanges() {
    this.favService.updateFavorite(this.favorite.id, this.favorite.note, this.favorite.status).subscribe({
      next: (response) => {
        this.favorite = response;
        this.status = response.status;
        this.note = response.note;
        this.editing$.next(false);
        this.alertService.showAlert({
          type: "success", message: "Changement sauvegardé ✅",
          object_id: response.id
        })
        setTimeout(() => {
          this.successConfirmation$.next("");
        }, 5000);
      }
    })
  }

  loadFavorite() {
    const id: string | null = this.route.snapshot.paramMap.get('id'); {
      this.favService.getFavorite(id).subscribe({
        next: (favorite) => {
          this.favorite = favorite;
          this.note = favorite.note;
          this.status = favorite.status;
          const program_id: string = this.favorite.study_program.toString()
          this.studyProgramService.getStudyProgram(program_id).subscribe({
            next: (studyProgram) => {
              this.favoriteProgram = studyProgram;
            }
          });
        }
      });
    }
  }
}
