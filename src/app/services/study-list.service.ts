import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyProgram, StudyResponse } from '../interface/study-interface';
import { map } from 'rxjs';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class StudyListService {
  constructor(private http:HttpClient, private api:ApiconfigService) {}

  studyUrl: string = this.api.getAPIUrl() + "/API_public/studyprogram/";


  
  
  getStudyList(): Observable<StudyResponse> {
  return this.http.get<StudyResponse>(this.studyUrl).pipe(
    map((response: any) => ({
      next: response.next,
      previous: response.previous,
      count: response.count,
      results: response.results.map((studyElement:any)=> ({
        cod_aff_form: studyElement.cod_aff_form,
        name: studyElement.name,
        school: studyElement.school_extended.name,
        url: studyElement.url_parcoursup_extended.link_url,
        acceptance_rate: studyElement.acceptance_rate,
        L1_succes_rate: studyElement.L1_succes_rate,
        description: studyElement.description,
        diploma_earned_ontime: studyElement.diploma_earned_ontime,
        available_places: studyElement.available_places,
        number_applicants: studyElement.number_applicants,
        percent_scholarship: studyElement.percent_scholarship,
        acceptance_rate_quartile: studyElement.acceptance_rate_quartile,
        L1_success_rate_quartile: studyElement.L1_success_rate_quartile,
        diploma_earned_ontime_quartile: studyElement.diploma_earned_ontime_quartile,
        percent_scholarship_quartile: studyElement.percent_scholarship_quartile,
        job_prospects: studyElement.job_prospects,
      }))
    }))
  );
}

}
