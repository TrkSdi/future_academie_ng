import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiconfigService } from './apiconfig.service';
import { School } from '../interface/school-interface';
import { StudyProgram, StudyResponse } from '../interface/study-interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient, private api: ApiconfigService) {}

  searchSchools(query: string): Observable<School[]> {
    const url = `${this.api.getAPIUrl()}/API_public/school/?name__icontains=${query}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const results = response.results;
        return results.map((result: School) => {
          return {
            UAI_code: result.UAI_code,
            name: result.name,
            description: result.description,
            school_type: result.school_type,
            url: '',
            address: {
              street_address: '',
              postcode: 0,
              locality: '',
              geolocation: '',
            },
          };
        });
      })
    );
  }

  searchProgram(
    query: string,
    location?: { latitude: number; longitude: number },
    distance?: number,
    sortBy?: string
  ): Observable<StudyResponse> {
    let url = `${this.api.getAPIUrl()}/API_public/studyprogram/?search_all=${query}`;

    if (location && distance !== undefined) {
      // url += `&distance__from=${location.longitude},${location.latitude}`;
      url += `&distance__lte=${location.longitude},${location.latitude},${distance}`;
    }
    if (sortBy !== undefined) {
      url += `&ordering=-${sortBy}`;
    }

    return this.http.get<any>(url).pipe(
      map((response: any) => ({
        next: response.next,
        previous: response.previous,
        count: response.count,
        results: response.results.map(
          (result: any): StudyProgram => ({
            cod_aff_form: result.cod_aff_form,
            name: result.name,
            school: result.school_extended.name,
            url: result.url_parcoursup_extended
              ? result.url_parcoursup_extended.link_url
              : '', // Gestion de l'absence de l'URL parcoursup
            acceptance_rate: result.acceptance_rate,
            L1_succes_rate: result.L1_success_rate,
            description: result.description,
            diploma_earned_ontime: result.diploma_earned_ontime,
            available_places: result.available_places,
            number_applicants: result.number_applicants,
            percent_scholarship: result.percent_scholarship,
            acceptance_rate_quartile: result.acceptance_rate_quartile,
            L1_success_rate_quartile: result.L1_success_rate_quartile,
            diploma_earned_ontime_quartile:
              result.diploma_earned_ontime_quartile,
            percent_scholarship_quartile: result.percent_scholarship_quartile,
            job_prospects: result.job_prospects,
            geolocation: result.address_extended.geolocation,
            locality: result.address_extended.locality,
          })
        ),
      }))
    );
  }

  getGeolocation(
    address: string
  ): Observable<{ latitude: number; longitude: number }> {
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
      address
    )}`;
    console.log(url);
    return this.http.get<any>(url).pipe(
      map((response) => {
        const location = response.features[0].geometry.coordinates;
        return { longitude: location[0], latitude: location[1] };
      })
    );
  }

  getAddressSuggestions(query: string): Observable<any[]> {
    if (!query.trim()) {
      return of([]); // Retourne un Observable vide si la requête est vide
    }
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
      query
    )}`;
    return this.http.get<any>(url).pipe(map((response) => response.features));
  }
}
