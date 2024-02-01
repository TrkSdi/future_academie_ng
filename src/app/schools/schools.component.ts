import { Component } from '@angular/core';
import { School } from '../interface/school-interface';
import { SchoolService } from '../services/school.service';

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [],
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.css'
})
export class SchoolsComponent {

  constructor(private schoolService: SchoolService) { }

  school!: School;

  ngOnInit() {
    this.schoolService.getSchool("0133774G").subscribe(school => this.school = school);
  }


}
