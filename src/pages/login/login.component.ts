import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Role } from '../../services/auth.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly roles: Role[] = ['Admin', 'HR', 'Manager', 'Employee'];
  
  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('lora.piterson@example.com', [Validators.required, Validators.email]),
    password: new FormControl('password123', Validators.required),
    role: new FormControl<Role>('Employee', Validators.required)
  });

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.role) {
      // In this demo, we ignore email/password and just use the role.
      this.authService.login(this.loginForm.value.role);
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
