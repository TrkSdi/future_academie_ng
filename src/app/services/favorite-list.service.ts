import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiconfigService } from './apiconfig.service';
import { UserService } from './user.service';
import { Observable, map } from 'rxjs';
import { FavoriteResponse } from '../interface/favorite-interface';

@Injectable({
  providedIn: 'root'
})
export class FavoriteListService {

  constructor(private http: HttpClient, private auth: AuthService, private api: ApiconfigService, user: UserService) { }
  favUrl = this.api.getAPIUrl() + "/API_private/favorite/?page_size=10";

  getFavorites(url?: string): Observable<FavoriteResponse> {
    return this.http.get(url || this.favUrl).pipe(
      map((response: any) => ({
        next: response.next,
        previous: response.previous,
        count: response.count,
        results: response.results.map((favorite: any) => ({
          id: favorite.id,
          user: favorite.user,
          study_program: favorite.study_program,
          note: favorite.note,
          status: favorite.status,
          study_program_name: favorite.study_program_extended.name,
          school_name: favorite.study_program_extended.school_extended.name,
          school_locality: favorite.study_program_extended.school_extended.address_extended.locality,
          school_code: favorite.study_program_extended.school_extended.UAI_code,
        }))
      }))
    );
  }

  deleteFavorite(favorite_id: string) {
    const url: string = this.favUrl + favorite_id + "/";
    const http_options = {}
    return this.http.delete(url, http_options)
  }
}
