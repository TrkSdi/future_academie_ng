import { Routes } from '@angular/router';
import { SchoolsComponent } from './schools/schools.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
  { path: 'school/:id', component: SchoolsComponent },
  { path: 'search/', component: SearchComponent },
];
