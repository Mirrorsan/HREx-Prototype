import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PeopleComponent } from './pages/people/people.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { authGuard } from './services/auth.guard';
import { SettingsComponent } from './pages/settings/settings.component';
import { OrganizationComponent } from './pages/organization/organization.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'core',
        children: [
          { path: '', redirectTo: 'employee', pathMatch: 'full' },
          { path: 'employee', component: PeopleComponent },
          { path: 'employee/:id', component: EmployeeDetailComponent },
          { path: 'organization', component: OrganizationComponent },
        ],
      },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  // Redirect any unknown paths to the login page as a fallback
  { path: '**', redirectTo: 'login' },
];
