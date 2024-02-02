import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiconfigService } from './apiconfig.service';
import { School } from '../interface/school-interface';

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
}
