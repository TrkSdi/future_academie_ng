import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  Subject,
  BehaviorSubject,
  map,
  throwError,
  of,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { School } from '../interface/school-interface';
import { SearchService } from '../services/search.service';
import { StudyProgram } from '../interface/study-interface';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudyListComponent } from '../study-list/study-list.component';

@Component({
  selector: 'app-search',
  imports: [CommonModule, NgbDropdownModule, RouterModule, FormsModule, StudyListComponent],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: [
    './search.component.css',
  ],
})

export class SearchComponent implements OnInit {
  // Variables to store search results
  schools$: Observable<School[]> = of([]);
  studies$: BehaviorSubject<StudyProgram[]> = new BehaviorSubject<
    StudyProgram[]
  >([]);
  results: StudyProgram[] | null = null;

  // Variables to store search inputs
  distance: number = 10; // Default distance
  addressInput: BehaviorSubject<string> = new BehaviorSubject<string>('');
  addressSuggestions$: Observable<any[]> = of([]);
  selectedLocation?: { latitude: number; longitude: number };
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  count: number | null = null;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.loadInitialData();
    this.addressSuggestions$ = this.addressInput.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((address) =>
        address ? this.searchService.getAddressSuggestions(address) : of([])
      ),
      catchError((error) => {
        console.error('Error loading address suggestions:', error);
        return of([]);
      })
    );
    this.studies$.subscribe(studies => {
      this.results = studies as StudyProgram[]
    })
  }
  // to have the program without a search
  loadInitialData(): void {
    this.searchPrograms('');
  }

  // simple search for the programs
  searchPrograms(term: string): void {
    this.searchService
      .searchProgram(term, this.selectedLocation, this.distance)
      .subscribe((response) => {
        this.studies$.next(response.results),
          this.count = response.count,
          this.nextUrl = response.next,
          this.previousUrl = response.previous
      });
  }

  // disabled for the moment
  searchSchools(term: string): void {
    this.searchService
      .searchSchools(term)
      .subscribe((schools) => (this.schools$ = of(schools)));
  }

  searchAddress(query: string): void {
    this.addressInput.next(query);
  }

  // here I would like to make adress input = first selectAdress(suggestion)
  selectAddress(suggestion: any): void {
    this.selectedLocation = {
      latitude: suggestion.geometry.coordinates[1],
      longitude: suggestion.geometry.coordinates[0],
    };
    this.searchPrograms('');
  }

  // the distance around the city
  setDistance(value: string): void {
    this.distance = +value;
    this.searchPrograms('');
  }

  /// sort by
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
