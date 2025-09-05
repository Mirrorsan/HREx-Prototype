import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface Day {
  name: string;
  date: number;
  isToday: boolean;
}

interface CalendarEvent {
  time: string;
  title: string;
  description: string;
  attendees: string[];
  day: number; // Corresponds to date
}

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarCardComponent {
  days = signal<Day[]>([
    { name: 'Mon', date: 22, isToday: false },
    { name: 'Tue', date: 23, isToday: false },
    { name: 'Wed', date: 24, isToday: true },
    { name: 'Thu', date: 25, isToday: false },
    { name: 'Fri', date: 26, isToday: false },
    { name: 'Sat', date: 27, isToday: false },
  ]);

  events = signal<CalendarEvent[]>([
    { time: '9:00 am', title: 'Weekly Team Sync', description: 'Discuss progress on projects', attendees: ['https://picsum.photos/id/1/32/32', 'https://picsum.photos/id/2/32/32', 'https://picsum.photos/id/3/32/32'], day: 24},
    { time: '11:00 am', title: 'Onboarding Session', description: 'Introduction for new hires', attendees: ['https://picsum.photos/id/4/32/32', 'https://picsum.photos/id/5/32/32'], day: 26 },
  ]);
}
