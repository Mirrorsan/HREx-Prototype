import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-main-layout',
  template: `
    <div class="min-h-screen bg-transparent">
      <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderComponent, RouterOutlet],
})
export class MainLayoutComponent {}