import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-progress-card',
  templateUrl: './progress-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressCardComponent {
  dailyHours = signal([
    { day: 'S', hours: 2 },
    { day: 'M', hours: 8 },
    { day: 'T', hours: 6 },
    { day: 'W', hours: 7.5 },
    { day: 'T', hours: 8.5 },
    { day: 'F', hours: 5 },
    { day: 'S', hours: 0 },
  ]);

  totalHours = '6.1h';
  goalHours = '8h 23m';

  getMaxHours(): number {
    return Math.max(...this.dailyHours().map(d => d.hours), 8);
  }
}
