import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Role } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly roles: Role[] = ['Admin', 'HR', 'Manager', 'Employee'];

  loginAs(role: Role): void {
    this.authService.login(role);
    this.router.navigate(['/dashboard']);
  }
}
