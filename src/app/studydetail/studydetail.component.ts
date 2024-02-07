import { Component, Input } from '@angular/core';
import { StudyProgram } from '../interface/study-interface';
import { StudyProgramDetailService } from '../services/studydetail.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FavoriteService } from '../services/favorite.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiconfigService } from '../services/apiconfig.service';
import { FavoriteListService } from '../services/favorite-list.service';

@Component({
  selector: 'app-studydetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './studydetail.component.html',
  styleUrl: './studydetail.component.css'
})

export class StudydetailComponent {

  constructor(
    private studyprogramdetailService: StudyProgramDetailService,
    private favListService: FavoriteListService,
    private api: ApiconfigService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private user: UserService,
    private favoriteService: FavoriteService) { }
  loginMessage: string = '';

  // Needed to next study-detail in favorite view
  @Input() studyProgram: StudyProgram | null = null;
  currentRoute: string = this.route.toString();
  favorites: number[] = [];



  ngOnInit() {
    // don't call loadStudyProgram if the component is the child of 
    // another template in which case studyProgram will be received as input
    if (this.currentRoute.includes("studyprogram")) {
      this.loadStudyProgram();
    }
    this.getFavorites();
  }

  loadStudyProgram() {
    const id = this.route.snapshot.paramMap.get('id'); {
      this.studyprogramdetailService.getStudyProgram(id).subscribe({
        next: (studyProgram) => {
          this.studyProgram = studyProgram;
        }
      });
    }
  }

  saveFavorite() {
    const program_id = this.studyProgram?.cod_aff_form
    if (this.auth.isAuthenticated()) {
      this.favoriteService.createFavorite(program_id!).subscribe({
        next: (response) => {
          // open the page of the newly created favorite
          this.router.navigateByUrl(`/favorite/${response.id}`);
        }
      });
    } else {
      this.loginMessage = "Connectez-vous pour sauvegarder des favoris!"
      setTimeout(() => {
        this.loginMessage = ""
      }, 4000);
    }
  }

  /**
 * This function creates a list of the IDs of all study programs which the user has
 * in their favorites to allow the template to show which programs are already saved
 */
  getFavorites() {
    const url = this.api.getAPIUrl() + "/API_private/favorite/?page_size=1000";
    this.favListService.getFavorites(url).subscribe({
      next: (response: any) => {
        for (var fav of response.results) {
          this.favorites.push(fav.study_program);
        }
      }
    })
  }

}
