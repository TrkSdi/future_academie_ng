import { Routes } from '@angular/router';
import { SchoolsComponent } from './schools/schools.component';
import { CreationComponent } from './creation/creation.component';

export const routes: Routes = [
  { path: 'school/:id', component: SchoolsComponent },
  { path: 'creation', component: CreationComponent },
];
