import { Component } from '@angular/core';
import { School } from '../interface/school-interface';
import { SchoolService } from '../services/school.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [],
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.css'
})
export class SchoolsComponent {

  constructor(private schoolService: SchoolService, private route: ActivatedRoute) { }

  school!: School;

  ngOnInit() {
    this.loadSchool();
  }
  loadSchool() {
    const id = this.route.snapshot.paramMap.get('id');
    this.schoolService.getSchool(id).subscribe(school => this.school = school);
  }

}
