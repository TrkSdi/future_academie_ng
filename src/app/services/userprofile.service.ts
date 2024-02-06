import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../interface/userprofile-interface';
import { map } from 'rxjs';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  

  constructor(private http: HttpClient, private api: ApiconfigService) { }

  url: string = this.api.getAPIUrl() + "/API_public/userprofile";

  getUserProfile(url?:string): Observable<UserProfile> {
    return this.http.post<UserProfile>(url, ).pipe(
      map((response: any) => ({
      user_extended: {
        username: response.username,
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
      },
      user: response.user,
      image_profile: response.image_profile,
      url_tiktok: response.url_tiktok,
      url_instagram: response.url_instagram,
      about_me: response.about_me,
      is_public: response.is_public,
      student_at: response.student_at
    })))
  }
}
