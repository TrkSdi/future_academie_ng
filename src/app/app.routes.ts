import { Routes } from '@angular/router';
import { SchoolsComponent } from './schools/schools.component';
import { StudydetailComponent } from './studydetail/studydetail.component';
import { SearchComponent } from './search/search.component';
import { CreationComponent } from './creation/creation.component';
import { LoginComponent } from './login/login.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { authRequiredGuard } from './auth-required.guard';
import { FavoriteListComponent } from './favorite-list/favorite-list.component';
import { UserProfilesComponent } from './userprofiles/userprofiles.component';
import { StudyListComponent } from './study-list/study-list.component';
import { SharedFavoritesComponent } from './shared-favorites/shared-favorites.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'school/:id', component: SchoolsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'studyprogram/:id', component: StudydetailComponent },
  { path: 'studyprogram', component: StudyListComponent },
  { path: 'creation', component: CreationComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'userprofile',
    component: UserProfilesComponent,
    canActivate: [authRequiredGuard],
  },
  { path: 'favorite/share/:token', component: SharedFavoritesComponent },
  {
    path: 'favorite/:id',
    component: FavoriteComponent,
    canActivate: [authRequiredGuard],
  },
  {
    path: 'favorite',
    component: FavoriteListComponent,
    canActivate: [authRequiredGuard],
  },
];
