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
import { PaginatorModule } from 'primeng/paginator'
import { ButtonModule } from 'primeng/button';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-study-list',
  standalone: true,
  imports: [CommonModule, SearchComponent, RouterModule, PaginatorModule, ButtonModule],
  templateUrl: './study-list.component.html',
  styleUrl: './study-list.component.css'
})
export class StudyListComponent {
  @Input() studies$: Observable<StudyProgram[]> = of([]);
  @Input() nextUrl: string | null = null;
  @Input() previousUrl: string | null = null;
  @Input() count$: Observable<number | null> = of(null);
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
      this.studies$ = of(response.results);
      this.nextUrl = response.next;
      this.previousUrl = response.previous;
      this.count$ = of(response.count);
    });
  }

  onPageChange(event: any) {
    let studyURL: string = this.api.getAPIUrl() + "/API_public/studyprogram/";
    if (event.page > 0) {
      const pageToGet = event.page + 1;
      studyURL += "?page=" + pageToGet;
    }
    this.getStudy(studyURL);
    console.log(event);
    console.log(studyURL);

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
