import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserProfile } from '../interface/userprofile-interface';
import { map } from 'rxjs';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  

  constructor(private http: HttpClient, private api: ApiconfigService) { }

  url: string = this.api.getAPIUrl() + "/API_private/userprofile";

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.url).pipe(
      tap ((response: any) => (console.log(response))),
      map((response: any) => ({
       
        username: response.results.user_extended ? response.user_extended.username : null,
        first_name: response.results.user_extended ? response.user_extended.first_name : null,
        last_name: response.results.user_extended ? response.user_extended.last_name : null,
        email: response.results.user_extended ? response.user_extended.email : null,


      image_profile: response.results.image_profile,
      url_tiktok: response.results.url_tiktok_extended ? response.url_tiktok_extended.link_url : null,
      url_instagram: response.results.url_instagram_extended ? response.url_instagram_extended.link_url : null,
      about_me: response.results.about_me,
      is_public: response.results.is_public,
      student_at: response.results.student_at
    })))
  }
}
