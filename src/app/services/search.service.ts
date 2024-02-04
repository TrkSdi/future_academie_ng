import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiconfigService } from './apiconfig.service';
import { School } from '../interface/school-interface';
import { StudyProgram } from '../interface/study-interface';

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
            },
          };
        });
      })
    );
  }
  searchProgram(query: string): Observable<StudyProgram[]> {
    const url = `${this.api.getAPIUrl()}/API_public/studyprogram/?search_all=${query}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const results = response.results;
        return results.map((result: StudyProgram) => {
          return {
            cod_aff_form: result.cod_aff_form,
            name: result.name,
            school: result.school,
            url: result.url,
            acceptance_rate: result.acceptance_rate,
            L1_succes_rate: result.L1_succes_rate,
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
          };
        });
      })
    );
  }
}
