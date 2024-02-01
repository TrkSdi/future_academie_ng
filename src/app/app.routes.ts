import { Routes } from '@angular/router';
import { SchoolsComponent } from './schools/schools.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [{ path: "schools/:id", component: SchoolsComponent },
{ path: "login", component: LoginComponent },];
