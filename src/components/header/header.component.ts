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
    { name: 'Dashboard', path: '/dashboard', disabled: false },
    { name: 'People', path: '/people', disabled: false },
    { name: 'Hiring', path: '#', disabled: true },
    { name: 'Devices', path: '#', disabled: true },
    { name: 'Apps', path: '#', disabled: true },
    { name: 'Salary', path: '#', disabled: true },
    { name: 'Calendar', path: '#', disabled: true },
    { name: 'Reviews', path: '#', disabled: true },
  ]);

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu.set(false);
  }
}