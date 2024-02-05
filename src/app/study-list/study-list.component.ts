import { Component, OnInit } from '@angular/core';
import { StudyListService } from '../services/study-list.service';
import { ActivatedRoute } from '@angular/router';
import { StudyProgram, StudyResponse } from '../interface/study-interface';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-study-list',
  standalone: true,
  imports: [CommonModule, SearchComponent],
  templateUrl: './study-list.component.html',
  styleUrl: './study-list.component.css',
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

  getStudy(url?: string): void {
    this.studyListService.getStudyList(url).subscribe((response) => {
      this.studies = response.results;
      this.nextUrl = response.next;
      this.previousUrl = response.previous;
      this.count = response.count;
    });
  }

  loadNextPage(): void {
    if (this.nextUrl) {
      this.getStudy(this.nextUrl);
    }
  }

  loadPreviousPage(): void {
    if (this.previousUrl) {
      this.getStudy(this.previousUrl);
    }
  }
}
