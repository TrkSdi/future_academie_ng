import { Component } from '@angular/core';
import { StudyProgram } from '../interface/study-interface';
import { StudyProgramDetailService } from '../services/studydetail.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-studydetail',
  standalone: true,
  imports: [],
  templateUrl: './studydetail.component.html',
  styleUrl: './studydetail.component.css'
})
export class StudydetailComponent {

  constructor(private studyprogramdetailService: StudyProgramDetailService, private route: ActivatedRoute) { }

  studyProgram!: StudyProgram;

  ngOnInit() {
    this.loadStudyProgram();
    console.log(this.studyProgram)
  }
  loadStudyProgram() {
    const id = this.route.snapshot.paramMap.get('id');{
    this.studyprogramdetailService.getStudyProgram(id).subscribe({
      next: (studyProgram) => {
        this.studyProgram = studyProgram;
        console.log(studyProgram);
     
      }});
  }
  }}