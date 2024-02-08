import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiconfigService } from './apiconfig.service';
import { UserService } from './user.service';
import { Observable, tap, map } from 'rxjs';
import { FavoriteResponse } from '../interface/favorite-interface';

@Injectable({
  providedIn: 'root'
})
export class FavoriteListService {

  constructor(private http: HttpClient, private auth: AuthService, private api: ApiconfigService, user: UserService) { }
  favUrl = this.api.getAPIUrl() + "/API_private/favorite/";

  getFavorites(url?: string): Observable<FavoriteResponse> {
    const getUrl: string = this.favUrl + "?page_size=10";

    return this.http.get(url || getUrl).pipe(
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

  deleteFavorite(favorite_id: string): Observable<any> {
    const url: string = this.favUrl + favorite_id + "/";
    const http_options = {}
    return this.http.delete(url, http_options)
  }

  shareFavorites() {
    const url: string = this.api.getAPIUrl() + "/API_private/favorite/share_favorites/"
    return this.http.get(url)
  }

  getSharedFavorites(token: string) {
    const url: string = this.api.getAPIUrl() + "/API_public/favorite/view_shared/?list="
    return this.http.get<any[]>(url + token).pipe(
      map((data: any[]) => {
        return data.map((item: any) => ({
          id: item.id,
          user: item.user,
          study_program: item.study_program,
          note: item.note,
          status: item.status,
          study_program_name: item.study_program_extended.name,
          school_name: item.study_program_extended.school_extended.name,
          school_locality: item.study_program_extended.school_extended.address_extended.locality,
          school_code: item.study_program_extended.school_extended.UAI_code
        }))
      })
    )
  }
}
