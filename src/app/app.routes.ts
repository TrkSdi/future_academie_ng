import { Routes } from '@angular/router';
import { SchoolsComponent } from './schools/schools.component';
import { StudyListComponent } from './study-list/study-list.component';

export const routes: Routes = [{ path: "school/:id", component: SchoolsComponent },
                                {path: "studyprogram", component:StudyListComponent}];

