import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class HeaderComponent {
  authService = inject(AuthService);
  showUserMenu = signal(false);

  navItems = signal([
    { name: 'Dashboard', path: '/dashboard', disabled: false, children: [] },
    { 
      name: 'Core', 
      path: '/core/employee', 
      disabled: false, 
      children: [
        { name: 'Employee', path: '/core/employee', disabled: false },
        { name: 'Organization', path: '#', disabled: true },
        { name: 'Management', path: '#', disabled: true },
        { name: 'Security and Policy', path: '#', disabled: true },
      ] 
    },
    { name: 'Time', path: '#', disabled: true, children: [] },
    { name: 'T&E', path: '#', disabled: true, children: [] },
    { name: 'Contracts', path: '#', disabled: true, children: [] },
    { name: 'Talent', path: '#', disabled: true, children: [] },
    { name: 'Payroll', path: '#', disabled: true, children: [] },
  ]);

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu.set(false);
  }
}