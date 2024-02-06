import { Injectable } from '@angular/core';
import { ApiconfigService } from './apiconfig.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Favorite } from '../interface/favorite-interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  /**
   * This service handles HTTP requests for CRUD operations on individual
   * Favorites
   */

  constructor(private api: ApiconfigService, private http: HttpClient, private user: UserService) { }

  createFavorite(program_id: number) {
    const user_id = this.user.getUserID();
    const url = this.api.getAPIUrl() + "/API_private/favorite/";
    const post_data = { study_program: program_id, user: user_id, status: "interested" };
    return this.http.post<Favorite>(url, post_data).pipe(
      map((response: any) => ({
        id: response.id,
        user: response.user,
        study_program: response.study_program,
        note: response.note,
        status: response.status,
      }))
    );
  }


  updateFavorite(id: string, note: string | null, status: string | null) {
    const url = this.api.getAPIUrl() + `/API_private/favorite/${id}/`;
    const patch_data = { note: note, status: status }
    return this.http.patch<Favorite>(url, patch_data);
  }

  getFavorite(id: string | null): Observable<Favorite> {
    const url = this.api.getAPIUrl() + `/API_private/favorite/${id}/`;
    return this.http.get<Favorite>(url).pipe(
      map((favorite: any) => ({
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
    );
  }
}
