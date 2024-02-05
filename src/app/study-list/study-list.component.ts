import { Component, OnInit } from '@angular/core';
import { StudyListService } from '../services/study-list.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudyProgram, StudyResponse } from '../interface/study-interface';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { FavoriteService } from '../services/favorite.service';
import { AuthService } from '../services/auth.service';
import { FavoriteListService } from '../services/favorite-list.service';

@Component({
  selector: 'app-study-list',
  standalone: true,
  imports: [CommonModule, SearchComponent, RouterModule],
  templateUrl: './study-list.component.html',
  styleUrl: './study-list.component.css',
})
export class StudyListComponent implements OnInit {
  studies: StudyProgram[] = [];
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  count: number | null = null;
  favorites: number[] = [];

  constructor(private studyListService: StudyListService) { }

  ngOnInit(): void {
    this.getStudy();
    this.getFavorites();
    console.log(this.favorites);
  }

  getFavorites() {
    this.favListService.getFavorites().subscribe({
      next: (response) => {
        for (var fav of response.results) {
          this.favorites.push(fav.study_program)
        }
        console.log(response.results);

      }
    })
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
}
