import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserProfile } from '../interface/userprofile-interface';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient, private api: ApiconfigService) { }

  private apiUrl = `${this.api.getAPIUrl()}/API_private/userprofile/`;

  getUserProfile(): Observable<UserProfile> {
    console.log('Fetching user profile from:', this.apiUrl);
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => this.mapProfile(response)),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        throw error;
      })
    );
  }

  updateUserProfile(userprofile: UserProfile) {
    const url = `${this.apiUrl}${userprofile.id}/`;
    console.log('Updating user profile:', userprofile);
    return this.http.patch<any>(url, userprofile).pipe(
      catchError(error => {
        console.error('Error updating user profile:', error);
        throw error;
      })
    );
  }

  updateProfileVisibility(isPublic: boolean, userId: number) {
    const url = `${this.apiUrl}${userId}/`;
    const updatedData = { is_public: isPublic };
  
    return this.http.patch<any>(url, updatedData).pipe(
      catchError(error => {
        console.error('Error updating profile visibility:', error);
        throw error;
      })
    );
  }

  private mapProfile(response: any): UserProfile {
    console.log('Response from API:', response);
    const profile = response.results[0];
    return {
      username: profile.user_extended ? profile.user_extended.username : null,
      first_name: profile.user_extended ? profile.user_extended.first_name : null,
      last_name: profile.user_extended ? profile.user_extended.last_name : null,
      email: profile.user_extended ? profile.user_extended.email : null,
      image_profile: profile.image_profile,
      url_tiktok: profile.url_tiktok_extended ? profile.url_tiktok_extended.link_url : null,
      url_instagram: profile.url_instagram_extended ? profile.url_instagram_extended.link_url : null,
      about_me: profile.about_me,
      is_public: profile.is_public,
      student_at: profile.student_at,
      id: profile.id
    };
  }
}
