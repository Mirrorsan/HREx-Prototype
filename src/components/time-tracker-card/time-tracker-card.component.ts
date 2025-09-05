import { Component, ChangeDetectionStrategy, signal, computed, effect, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-time-tracker-card',
  templateUrl: './time-tracker-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTrackerCardComponent implements OnDestroy {
  private initialSeconds = (2 * 3600) + (35 * 60) + 0; // 02:35:00 from image
  
  timeInSeconds = signal(this.initialSeconds);
  isRunning = signal(false);
  private timerInterval: any;

  hours = computed(() => Math.floor(this.timeInSeconds() / 3600).toString().padStart(2, '0'));
  minutes = computed(() => Math.floor((this.timeInSeconds() % 3600) / 60).toString().padStart(2, '0'));
  seconds = computed(() => (this.timeInSeconds() % 60).toString().padStart(2, '0'));
  
  circumference = 2 * Math.PI * 54; // 2 * pi * r
  progressOffset = computed(() => {
    const totalSecondsInDay = 8 * 3600; // 8 hours
    const progress = this.timeInSeconds() / totalSecondsInDay;
    return this.circumference * (1 - Math.min(progress, 1));
  });

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      if (this.isRunning()) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    });
  }

  toggleTimer(): void {
    this.isRunning.update(v => !v);
  }

  private startTimer(): void {
    if (this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      this.timeInSeconds.update(t => t + 1);
      this.cdr.markForCheck(); // manually trigger change detection for timer
    }, 1000);
  }

  private stopTimer(): void {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
