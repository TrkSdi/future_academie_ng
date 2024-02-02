import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyProgram } from '../interface/study-interface';
import { map } from 'rxjs';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})

export class StudyProgramDetailService {

  constructor(private http: HttpClient, private api: ApiconfigService) { }

  url: string = this.api.getAPIUrl() + "/API_public/studyprogram";

  getStudyProgram(UAI_code: string | null): Observable<StudyProgram> {
    return this.http.get<StudyProgram>(this.url + `/${UAI_code}`).pipe(
      map((response: any) => ({
        cod_aff_form: response.cod_aff_form,
        name: response.name,
        school: response.school,
        url: response.url_parcoursup_extended.link_url,
        acceptance_rate: response.acceptance_rate,
        L1_succes_rate: response.L1_succes_rate,
        description: response.description,
        diploma_earned_ontime: response.diploma_earned_ontime,
        available_places: response.available_places,
        number_applicants: response.number_applicants,
        percent_scholarship: response.percent_scholarship,
        acceptance_rate_quartile: response.acceptance_rate_quartile,
        L1_success_rate_quartile: response.L1_success_rate_quartile,
        diploma_earned_ontime_quartile: response.diploma_earned_ontime_quartile,
        percent_scholarship_quartile: response.percent_scholarship_quartile,
        job_prospects: response.job_prospects
      })
      ))
  }
}