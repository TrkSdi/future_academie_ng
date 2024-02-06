// Angular Modules
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

// Local Imports
import { Favorite } from '../interface/favorite-interface';
import { FavoriteService } from '../services/favorite.service';
import { StudydetailComponent } from '../studydetail/studydetail.component';
import { StudyProgramDetailService } from '../services/studydetail.service';
import { StudyProgram } from '../interface/study-interface';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [StudydetailComponent, CommonModule, FormsModule, RouterModule],
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
  ) {
  }
  editing$: Subject<any> = new Subject();
  favorite!: Favorite;
  favoriteProgram: StudyProgram | null = null;
  successConfirmation: string = '';

  ngOnInit() {
    this.loadFavorite();
  }

  editForm(): void {
    this.editing$.next("true");
  }

  //why is this not working??
  cancelEdit(): void {
    console.log("trying")
    this.editing$.next("false");
  }

  saveChanges() {
    this.favService.updateFavorite(this.favorite.id, this.favorite.note, this.favorite.status).subscribe({
      next: (response) => {
        this.favorite = response;
        this.editing$.next(false);
        this.successConfirmation = "Changement sauvegardé ✅"
        setTimeout(() => {
          this.successConfirmation = '';
        }, 5000);
      }
    })
  }

  loadFavorite() {
    const id: string | null = this.route.snapshot.paramMap.get('id'); {
      this.favService.getFavorite(id).subscribe({
        next: (favorite) => {
          this.favorite = favorite;
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
