import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { School } from '../interface/school-interface';
import { SearchService } from '../services/search.service';
import { StudyProgram } from '../interface/study-interface';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
  ],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: [
    './search.component.css',
    '../study-list/study-list.component.css',
  ],
})
export class SearchComponent {
  private searchTermsSchools = new Subject<string>();
  private searchTermsPrograms = new Subject<string>();
  schools$: Observable<School[]>;
  studies: Observable<StudyProgram[]> = of([]);

  constructor(private http: HttpClient, private searchService: SearchService) {
    this.schools$ = this.searchTermsSchools.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchService.searchSchools(term))
    );

    this.studies = this.searchTermsPrograms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchService.searchProgram(term)),
      map((array) =>
        array.sort((a, b) => (a.L1_succes_rate > b.L1_succes_rate ? 1 : -1))
      ),
      map((array) =>
        array.sort((a, b) => (a.acceptance_rate > b.acceptance_rate ? 1 : -1))
      ),
      map((array) =>
        array.sort((a, b) => (a.available_places > b.available_places ? 1 : -1))
      )
    );
  }

  // method to search school
  searchSchools(term: string): void {
    this.searchTermsSchools.next(term);
  }

  // method to search program
  searchPrograms(term: string): void {
    this.searchTermsPrograms.next(term);
  }

  sortBySuccessRate() {
    this.studies = this.studies.pipe(
      map((studies) =>
        studies.sort((a, b) => b.L1_succes_rate - a.L1_succes_rate)
      )
    );
  }

  sortByAcceptanceRate() {
    this.studies = this.studies.pipe(
      map((studies) =>
        studies.sort((a, b) => b.acceptance_rate - a.acceptance_rate)
      )
    );
  }

  sortByAvailablePlaces() {
    this.studies = this.studies.pipe(
      map((studies) =>
        studies.sort((a, b) => b.available_places - a.available_places)
      )
    );
  }
  ngOnInit() {
    this.studies = this.searchService.searchProgram('');
  }
}
