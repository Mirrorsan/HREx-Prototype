import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class HeaderComponent {
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
}
