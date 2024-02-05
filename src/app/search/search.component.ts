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
  private searchTermsSchools = new Subject<string>();
  private searchTermsPrograms = new Subject<string>();
  schools$: Observable<School[]> = of([]);
  studies$: BehaviorSubject<StudyProgram[]> = new BehaviorSubject<
    StudyProgram[]
  >([]);
  distance: number = 10; //distance par defaut
  addressInput = new BehaviorSubject<string>('');
  addressSuggestions$: Observable<any[]>;
  selectedLocation: { latitude: number; longitude: number } | null = null;
  lastSearchTerm: string = '';

  constructor(private searchService: SearchService) {
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

  ngOnInit() {
    this.searchTermsPrograms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.searchService.searchProgram(term))
      )
      .subscribe((programs) => this.studies$.next(programs));
    this.searchPrograms(''); // to have all the program in the beginning IMPORTANT
  }

  searchSchools(term: string): void {
    this.searchTermsSchools.next(term);
  }

  searchPrograms(term: string): void {
    this.lastSearchTerm = term;

    const programsObservable: Observable<StudyProgram[]> = this.selectedLocation
      ? this.searchService.searchProgram(
          term,
          this.selectedLocation,
          this.distance
        )
      : this.searchService.searchProgram(term);

    programsObservable
      .pipe(
        catchError((error) => {
          console.error('Error searching programs:', error);
          return of([]);
        })
      )
      .subscribe((programs) => {
        this.studies$.next(programs); // Mettez à jour les valeurs avec next
      });
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

  setDistance(value: string): void {
    this.distance = +value;
  }

  findLocation(address: string): void {
    this.searchService.getGeolocation(address).subscribe({
      next: (location) => {
        console.log('Location found:', location);
      },
      error: (error) => console.error('Error finding location:', error),
    });
  }
  searchAddress(query: string): void {
    this.addressInput.next(query);
  }

  selectAddress(address: any): void {
    this.selectedLocation = {
      latitude: address.geometry.coordinates[1],
      longitude: address.geometry.coordinates[0],
    };
    console.log(
      'selectedLocation' +
        this.selectedLocation.latitude +
        this.selectedLocation.longitude
    );

    this.searchPrograms(this.lastSearchTerm);
  }

  onAddressInput(value: string): void {
    this.addressInput.next(value);
    console.log(this.addressInput.next(value));
  }
}

// pb que l'on a encore : c'ess que si on met plusieurs mots icontains ne marche plus....
// à faire message pas de résultat
