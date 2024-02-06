import { Component, OnInit, Input } from '@angular/core';
import { StudyListService } from '../services/study-list.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudyProgram, StudyResponse } from '../interface/study-interface';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { FavoriteService } from '../services/favorite.service';
import { AuthService } from '../services/auth.service';
import { FavoriteListService } from '../services/favorite-list.service';
import { ApiconfigService } from '../services/apiconfig.service';

@Component({
  selector: 'app-study-list',
  standalone: true,
  imports: [CommonModule, SearchComponent, RouterModule],
  templateUrl: './study-list.component.html',
  styleUrl: './study-list.component.css'
})
export class StudyListComponent {
  @Input() studies: StudyProgram[] = [];
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  count: number | null = null;
  favorites: number[] = [];

  constructor(
    private studyListService: StudyListService,
    private favListService: FavoriteListService,
    private favService: FavoriteService,
    private auth: AuthService,
    private router: Router,
    private api: ApiconfigService) { }

  ngOnInit(): void {
    this.getStudy();
    if (this.auth.isAuthenticated()) {
      this.getFavorites();
    }
  }

  getStudy(url?: string): void {
    this.studyListService.getStudyList(url).subscribe((response) => {
      this.studies = response.results;
      this.nextUrl = response.next;
      this.previousUrl = response.previous;
      this.count = response.count;
    });
  }

  loadNextPage(): void {
    if (this.nextUrl) {
      this.getStudy(this.nextUrl);
    }
  }

  loadPreviousPage(): void {
    if (this.previousUrl) {
      this.getStudy(this.previousUrl);
    }
  }

  /**
   * This function saves a program to the user's favorite list and is called when 
   * the heart icon on the program description is clicked
   * @param program_id : the cod_aff_form number of the program the user has liked
   */
  addFavorite(program_id: number) {
    if (this.auth.isAuthenticated()) {
      this.favService.createFavorite(program_id).subscribe({
        next: (favorite) => {
          this.router.navigate([`/favorite/${favorite.id}/`]);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }

  }

  /**
   * This function creates a list of the IDs of all study programs which the user has
   * in their favorites to allow the template to show which programs are already saved
   */
  getFavorites() {
    const url = this.api.getAPIUrl() + "/API_private/favorite/?page_size=1000";
    this.favListService.getFavorites(url).subscribe({
      next: (response) => {
        for (var fav of response.results) {
          this.favorites.push(fav.study_program);
        }
      }
    })
  }

}
