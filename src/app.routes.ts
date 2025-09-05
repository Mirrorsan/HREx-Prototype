import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PeopleComponent } from './pages/people/people.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'people/:id', component: EmployeeDetailComponent },
];
