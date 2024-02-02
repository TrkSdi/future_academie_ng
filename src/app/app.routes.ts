import { Routes } from '@angular/router';
import { SchoolsComponent } from './schools/schools.component';
import { StudydetailComponent } from './studydetail/studydetail.component';

export const routes: Routes = [{ path: "school/:id", component: SchoolsComponent }, {path: "studyprogram/:id", component:StudydetailComponent}];
