import { Routes } from '@angular/router';
import { SchoolsComponent } from './schools/schools.component';
import { StudyListComponent } from './study-list/study-list.component';
import { StudydetailComponent } from './studydetail/studydetail.component';
import { SearchComponent } from './search/search.component';
import { CreationComponent } from './creation/creation.component';
import { LoginComponent } from './login/login.component';
import { FavoriteComponent } from './favorite/favorite.component';


export const routes: Routes = [
  { path: 'school/:id', component: SchoolsComponent },
  { path: 'search/', component: SearchComponent },
  { path: "studyprogram/:id", component: StudydetailComponent },
  { path: "studyprogram", component: StudyListComponent },
  { path: 'creation', component: CreationComponent },
  { path: "login", component: LoginComponent },
  { path: "favorite/:id", component: FavoriteComponent }

];