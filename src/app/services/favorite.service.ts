import { Injectable } from '@angular/core';
import { ApiconfigService } from './apiconfig.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Favorite } from '../interface/favorite-interface';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  /**
   * This service handles HTTP requests for CRUD operations on individual
   * Favorites
   */

  constructor(private api: ApiconfigService, private http: HttpClient) { }

  createFavorite(program_id: number, user_id: string,) {
    const url = this.api.getAPIUrl() + "/API_private/favorite/";
    const post_data = { study_program: program_id, user: user_id };
    return this.http.post<Favorite>(url, post_data);
  }

  getFavorite(id: string | null): Observable<Favorite> {
    const url = this.api.getAPIUrl() + `/API_private/favorite/${id}`;
    return this.http.get<Favorite>(url).pipe(
      map((response: any) => ({
        user: response.user,
        study_program: response.study_program,
        note: response.note,
        status: response.status,
      }))
    );
  }
}
