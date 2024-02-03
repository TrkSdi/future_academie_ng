import { Component, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { FavoriteService } from '../services/favorite.service';
import { StudydetailComponent } from '../studydetail/studydetail.component';
import { StudyProgram } from '../interface/study-interface';
import { ActivatedRoute } from '@angular/router';
import { Favorite } from '../interface/favorite-interface';
import { StudyProgramDetailService } from '../services/studydetail.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [StudydetailComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
  constructor(private studyProgramService: StudyProgramDetailService, private route: ActivatedRoute, private user: UserService, private favService: FavoriteService) { }
  favoriteProgram: StudyProgram | null = null;
  favorite: Favorite | null = null;
  ngOnInit() {
    this.loadFavorite();
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
