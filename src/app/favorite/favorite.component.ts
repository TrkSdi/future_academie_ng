import { Component, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { FavoriteService } from '../services/favorite.service';
import { StudydetailComponent } from '../studydetail/studydetail.component';
import { StudyProgram } from '../interface/study-interface';
import { ActivatedRoute } from '@angular/router';
import { Favorite } from '../interface/favorite-interface';
import { StudyProgramDetailService } from '../services/studydetail.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [StudydetailComponent, CommonModule, FormsModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
  constructor(private studyProgramService: StudyProgramDetailService, private route: ActivatedRoute, private user: UserService, private favService: FavoriteService) {
  }
  favoriteProgram: StudyProgram | null = null;
  favorite!: Favorite;
  successConfirmation: string = '';
  editing: Subject<any> = new Subject();
  ngOnInit() {
    this.loadFavorite();
  }
  editForm() {
    this.editing.next("true");
  }
  saveChanges() {
    this.favService.updateFavorite(this.favorite.id, this.favorite.note, this.favorite.status).subscribe({
      next: (response) => {
        this.favorite = response;
        this.editing.next(false);
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
