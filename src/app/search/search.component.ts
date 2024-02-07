import { Component, OnInit } from '@angular/core';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  tap,
  timeout,
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
  imports: [
    CommonModule,
    NgbDropdownModule,
    RouterModule,
    FormsModule,
    StudyListComponent,
  ],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
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
  currentGeoLocationInput: string = '';
  showSuggestions: boolean = false;
  currentSearchTerm: string = '';

  activeFilters: { [filterName: string]: any } = {};
  defaultSearchTerm: string = '';
  defaultSortBy: string = '';
  defaultLocation = { latitude: 48.866667, longitude: 2.333333 };
  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.addressSuggestions$ = this.addressInput.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((address) =>
        address ? this.searchService.getAddressSuggestions(address) : of([])
      ),
      tap((suggestions) => {
        if (suggestions.length > 0) {
          this.selectAddress(suggestions[0]);
        }

      }),
      catchError((error) => {
        console.error('Error loading address suggestions:', error);
        return of([]);
      })
    );
    this.studies$.subscribe((studies) => {
      this.results = studies as StudyProgram[];
    });
  }
  // to have the program without a search
  loadInitialData(): void {
    this.searchPrograms('');
  }

  // simple search for the programs
  searchPrograms(
    term: string = this.currentSearchTerm,
    sortBy: string = this.defaultSortBy
  ): void {
    this.currentSearchTerm = term;
    this.defaultSortBy = sortBy;

    this.searchService
      .searchProgram(term, this.selectedLocation, this.distance, sortBy)
      .subscribe((response) => {
        this.studies$.next(response.results),
          (this.count = response.count),
          (this.nextUrl = response.next),
          (this.previousUrl = response.previous);
      });
  }

  // Delete all filters
  clearFilters(): void {
    this.selectedLocation = this.defaultLocation;
    this.distance = this.distance;

    this.searchPrograms(this.defaultSearchTerm, this.defaultSortBy);
  }

  applyFilter(filterName: string, value: any, termFront?: string): void {
    if (value !== null && value !== undefined) {
      if (termFront) {
        this.activeFilters[filterName] = termFront;
      } else {
        this.activeFilters[filterName] = value;
      }
    } else {
      delete this.activeFilters[filterName];
    }
    this.searchPrograms();
  }
  objectKeys = Object.keys;

  removeFilter(filterName: string): void {
    this.applyFilter(filterName, null);
    if (filterName == 'Ville sélectionnée') {
      this.currentGeoLocationInput = '';

      this.selectedLocation = undefined;
    }
  }
  getActiveFilterKeys(): string[] {
    return Object.keys(this.activeFilters);
  }
  // disabled for the moment
  searchSchools(term: string): void {
    this.searchService
      .searchSchools(term)
      .subscribe((schools) => (this.schools$ = of(schools)));
  }

  searchAddress(query: string): void {
    this.showSuggestions = !!query;

    if (!query) {
      this.removeFilter('Ville sélectionnée');
      delete this.activeFilters['Ville sélectionnée'];
      this.addressSuggestions$ = this.addressInput.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((address) =>
          address ? this.searchService.getAddressSuggestions(address) : of([])
        ),
        tap((suggestions) => {
          if (suggestions.length > 0) {
            this.selectAddress(suggestions[0]);
          }
        }),
        catchError((error) => {
          console.error('Error loading address suggestions:', error);
          return of([]);
        })
      );
      this.studies$.subscribe((studies) => {
        this.results = studies as StudyProgram[];
      });
    } else {
      this.addressInput.next(query);
      this.selectedLocation = undefined;
    }
  }

  selectAddress(suggestion: any): void {
    this.selectedLocation = {
      latitude: suggestion.geometry.coordinates[1],
      longitude: suggestion.geometry.coordinates[0],
    };
    this.applyFilter('Ville sélectionnée', suggestion.properties.label);
    this.currentGeoLocationInput = suggestion.properties.label;
    this.showSuggestions = false;
  }

  // the distance around the city
  setDistance(value: string): void {
    this.distance = +value;
    this.applyFilter('Distance', value);
  }

  /// sort by

  sortByItem(sortBy: string, termFront: string) {
    this.defaultSortBy = sortBy;

    this.applyFilter('Tri par', sortBy, termFront);
  }
}
