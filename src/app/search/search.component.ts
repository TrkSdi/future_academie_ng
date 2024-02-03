import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { School } from '../interface/school-interface';
import { SearchService } from '../services/search.service';
import { StudyProgram } from '../interface/study-interface';
@Component({
  selector: 'app-search',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  private searchTerms = new Subject<string>();
  schools$: Observable<School[]>;
  programs$: Observable<StudyProgram[]>;

  constructor(private http: HttpClient, private searchService: SearchService) {
    this.schools$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => this.searchService.searchSchools(query))
    );
    this.programs$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => this.searchService.searchProgram(query))
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
