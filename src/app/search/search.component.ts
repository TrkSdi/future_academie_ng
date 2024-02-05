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
  schools$: Observable<School[]> = of([]);
  studies$: BehaviorSubject<StudyProgram[]> = new BehaviorSubject<
    StudyProgram[]
  >([]);
  distance: number = 10; // Default distance
  addressInput: BehaviorSubject<string> = new BehaviorSubject<string>('');
  addressSuggestions$: Observable<any[]> = of([]);
  selectedLocation?: { latitude: number; longitude: number };

  constructor(private searchService: SearchService) {}

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
  }
  // to have the program without research
  loadInitialData(): void {
    this.searchPrograms('');
  }
  // simple search for the programs
  searchPrograms(term: string): void {
    this.searchService
      .searchProgram(term, this.selectedLocation, this.distance)
      .subscribe((programs) => this.studies$.next(programs));
  }
  // disable for the moment
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
