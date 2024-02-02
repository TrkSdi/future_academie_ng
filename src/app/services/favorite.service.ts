import { Injectable } from '@angular/core';
import { ApiconfigService } from './apiconfig.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../interface/favorite-interface';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private api: ApiconfigService, private http: HttpClient) { }

  createFavorite(program_id: number, status: string, user_id: string,) {
    const url = this.api.getAPIUrl() + "/API_private/favorite/";
    const post_data = { study_program: program_id, status: status, user: user_id };
    return this.http.post<Favorite>(url, post_data);
  }


}
