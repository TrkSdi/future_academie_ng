import { Component, OnInit } from '@angular/core';
import { StudyListService } from '../services/study-list.service';
import { ActivatedRoute } from '@angular/router';
import { StudyProgram, StudyResponse } from '../interface/study-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-study-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './study-list.component.html',
  styleUrl: './study-list.component.css'
})
export class StudyListComponent implements OnInit {
  studies: StudyProgram[] = [];
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  count: number | null = null;

  constructor(private studyListService: StudyListService) {}

  ngOnInit(): void {
    this.getStudy();
  }

  getStudy(): void {
    this.studyListService.getStudyList().subscribe(
      (response) => {
        this.studies = response.results
        this.nextUrl = response.next
        this.previousUrl = response.previous
        this.count = response.count
      }
    )
  }
}
