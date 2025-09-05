import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface OnboardingTask {
  name: string;
  time: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-onboarding-card',
  templateUrl: './onboarding-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingCardComponent {
  tasks = signal<OnboardingTask[]>([
    { name: 'Interview', time: 'Sep 13, 08:30', completed: true, active: false },
    { name: 'Team Meeting', time: 'Sep 13, 10:30', completed: true, active: false },
    { name: 'Project Update', time: 'Sep 13, 13:00', completed: false, active: true },
    { name: 'Discuss Q3 Goals', time: 'Sep 13, 14:45', completed: false, active: false },
    { name: 'HR Policy Review', time: 'Sep 13, 16:30', completed: false, active: false },
  ]);
}
