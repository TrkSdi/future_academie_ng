import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { School } from '../interface/school-interface';
import { map } from 'rxjs';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})

export class SchoolService {

  constructor(private http: HttpClient, private api: ApiconfigService) { }

  url: string = this.api.getAPIUrl() + "/API_public/school";

  getSchool(UAI_code: string | null): Observable<School> {
    return this.http.get<School>(this.url + `/${UAI_code}`).pipe(
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
