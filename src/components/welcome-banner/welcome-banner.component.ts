import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface Kpi {
  name: string;
  value: string;
  color: string;
}

@Component({
  selector: 'app-welcome-banner',
  templateUrl: './welcome-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeBannerComponent {
  kpis = signal<Kpi[]>([
    { name: 'Interviews', value: '15%', color: 'bg-yellow-400' },
    { name: 'Hired', value: '15%', color: 'bg-yellow-400' },
    { name: 'Project time', value: '60%', color: 'bg-yellow-400' },
    { name: 'Output', value: '10%', color: 'bg-slate-200' },
  ]);
}
