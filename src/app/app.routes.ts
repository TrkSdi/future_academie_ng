import { Routes } from '@angular/router';
import { SchoolsComponent } from './schools/schools.component';
import { StudyListComponent } from './study-list/study-list.component';
import { StudydetailComponent } from './studydetail/studydetail.component';
import { SearchComponent } from './search/search.component';



export const routes: Routes = [
  { path: 'school/:id', component: SchoolsComponent },
  { path: 'search/', component: SearchComponent },
  { path: "studyprogram/:id", component:StudydetailComponent},
  { path: "studyprogram", component:StudyListComponent},
];

