import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { School } from '../interface/school-interface';
import { SearchService } from '../services/search.service';
import { StudyProgram } from '../interface/study-interface';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search',
  imports: [CommonModule, NgbDropdownModule],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: [
    './search.component.css',
    '../study-list/study-list.component.css',
  ],
})
export class SearchComponent implements OnInit {
  private searchTermsSchools = new Subject<string>();
  private searchTermsPrograms = new Subject<string>();
  schools$: Observable<School[]>;
  studies$: BehaviorSubject<StudyProgram[]> = new BehaviorSubject<
    StudyProgram[]
  >([]);

  constructor(private http: HttpClient, private searchService: SearchService) {
    this.schools$ = this.searchTermsSchools.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchService.searchSchools(term))
    );
  }

  ngOnInit() {
    this.searchTermsPrograms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.searchService.searchProgram(term))
      )
      .subscribe((programs) => {
        this.studies$.next(programs);
      });

    // Initial load (optional)
    this.searchPrograms('');
  }

  searchSchools(term: string): void {
    this.searchTermsSchools.next(term);
  }

  searchPrograms(term: string): void {
    this.searchTermsPrograms.next(term);
  }

  sortBySuccessRate() {
    const sortedStudies = this.studies$.value.sort(
      (a, b) => b.L1_succes_rate - a.L1_succes_rate
    );
    this.studies$.next(sortedStudies);
  }

  sortByAcceptanceRate() {
    const sortedStudies = this.studies$.value.sort(
      (a, b) => b.acceptance_rate - a.acceptance_rate
    );
    this.studies$.next(sortedStudies);
  }

  sortByAvailablePlaces() {
    const sortedStudies = this.studies$.value.sort(
      (a, b) => b.available_places - a.available_places
    );
    this.studies$.next(sortedStudies);
  }
}

// pb que l'on a encore : c'ess que si on met plusieurs mots icontains ne marche plus....
// à faire message pas de résultat
