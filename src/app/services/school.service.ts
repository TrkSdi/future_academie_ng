import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { School } from '../interface/school-interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private http: HttpClient) { }

  getSchool(UAI_code: string): Observable<School> {
    const url = `http://127.0.0.1:8001/API_public/school/${UAI_code}`;
    return this.http.get<School>(url).pipe(
      map((response: any) => ({
        UAI_code: response.UAI_code,
        name: response.name,
        url: response.school_url_extended.link_url,
        description: response.description,
        address: {
          street_address: response.address_extended.street_address,
          postcode: response.address_extended.postcode,
          locality: response.address_extended.locality,
        },
        school_type: response.school_type
      })
      ))
  }
}
