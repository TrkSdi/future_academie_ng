// Angular Modules
import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Local Imports
import { Alert, AlertService } from '../services/alert.service';
import { Favorite } from '../interface/favorite-interface';
import { FavoriteService } from '../services/favorite.service';
import { FavoriteListService } from '../services/favorite-list.service';
import { StudydetailComponent } from '../studydetail/studydetail.component';
import { StudyProgramDetailService } from '../services/studydetail.service';
import { StudyProgram } from '../interface/study-interface';


@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, RouterModule, StudydetailComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
/**
 * This component is used for CRUD operations on a single Favorite. Using this
 * component requires authentication;
 */
export class FavoriteComponent {

  constructor(
    private alertService: AlertService,
    private favService: FavoriteService,
    private favListService: FavoriteListService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private studyProgramService: StudyProgramDetailService,
  ) { }


  // used to toggle between edit and read views
  editing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  favorite!: Favorite;
  favoriteProgram: StudyProgram | null = null;

  // note and status are used to store values while editing to restore them if edit is cancelled
  status: string = "";
  note: string = "";

  // alert and subscription handling
  alerts: Alert[] = [];
  subscriptions: Subscription = new Subscription();


  ngOnInit() {
    this.loadFavorite();
    this.subscriptions.add(
      this.alertService.alert$.subscribe({
        next: (alert) => {
          this.alerts.push(alert);
        },
        error: (error) => {
          console.log("Error: alert not added.");
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * This function uses the id parameter from the URL and loads the requested favorite
   * setting the favorite, note and status variable values for the instance.
   */
  loadFavorite(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.subscriptions.add(
      this.favService.getFavorite(id).subscribe({
        next: (favorite) => {
          this.favorite = favorite;
          this.note = favorite.note;
          this.status = favorite.status;
          const program_id: string = this.favorite.study_program.toString()
          this.loadStudyProgram(program_id);
        },
        error: (error: any) => {
          this.alertService.showAlert({
            type: "warning",
            message: `Une erreur a empêchée le chargement de ce favoris. Error: $(error.message)`,
            object_id: ""
          })
        }

      })
    );
  }

  /**
   * This function takes a program ID, fetches the program data and sets the favoriteProgram
   * variable for the instance.
   * @param program_id : string 
   */
  loadStudyProgram(program_id: string): void {
    this.subscriptions.add(this.studyProgramService.getStudyProgram(program_id).subscribe({
      next: (studyProgram) => {
        this.favoriteProgram = studyProgram;
      },
      error: (error: any) => {
        this.alertService.showAlert({
          type: "warning",
          message: `Une errreur est survenue et le programme $(program_id) n'a pas pu être chargé. Error: $(error.message)`,
          object_id: program_id
        })
      }
    }));
  }

  /**
   * Returns the user to the previous page.
   */
  goBack(): void {
    this.location.back()
  }

  /**
   * Used to close the given alert message on click.
   * @param alert : Alert object (includes type, message, and object_id strings)
   */
  close(alert: Alert): void {
    const index = this.alerts.findIndex((a) => a === alert);
    if (index !== -1) {
      this.alerts.splice(index, 1);
    }
  }

  /**
   * Sets the editing$ value for the instance to true to allow the template to 
   * show editing mode.
   */
  editForm(): void {
    this.editing$.next(true);
  }

  /**
   * Discards changes and resets inputs to their previous value and closes
   * editing mode by setting editing$'s value to false.
   */
  cancelEdit(): void {
    this.editing$.next(false);
    this.favorite.status = this.status;
    this.favorite.note = this.note;
  }

  /**
   * Saves the current values of input to the database and sets the instance variables to store
   * these new values.
   */
  saveChanges(): void {
    this.subscriptions.add(
      this.favService.updateFavorite(this.favorite.id, this.favorite.note, this.favorite.status).subscribe({
        next: (response) => {
          this.favorite = response;
          this.status = response.status;
          this.note = response.note;
          this.editing$.next(false);
          this.alertService.showAlert({
            type: "success", message: "Changement sauvegardé ✅",
            object_id: response.id
          });
        },
        error: (error: any) => {
          this.alertService.showAlert({
            type: "warning",
            message: `Une errreur est survenue et le changement n'a pas pu être sauvegardé. Error: $(error.message)`,
            object_id: ""
          })
        }
      })
    )
  }

  /**
   * Emits an alert to confirm that the user wishes to delete the favorite object.
   * @param favorite_id : the string ID of the favorite to be deleted
   */
  confirmDelete(favorite_id: string): void {
    this.alertService.showAlert({
      type: "danger",
      message: "Vous êtes certain.e de vouloir supprimer ce programme de votre liste de favoris?",
      object_id: favorite_id
    });
  }

  /**
   * Deletes the given favorite from the database and redirects the user to their favorites list.
   * @param favorite_id_del : string
   */
  deleteFavorite(favorite_id_del: string) {
    this.subscriptions.add(
      this.favListService.deleteFavorite(favorite_id_del).subscribe({
        next: () => { this.router.navigateByUrl("/favorite"); },
        error: (error: any) => {
          this.alertService.showAlert({
            type: "warning",
            message: `Une errreur est survenue et le favoris n'a pas pu être supprimé. Error: $(error.message)`,
            object_id: favorite_id_del
          })
        }
      })
    );
  }
}

