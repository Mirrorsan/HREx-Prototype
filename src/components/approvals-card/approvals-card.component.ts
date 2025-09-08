import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Approval {
  type: string;
  employeeName: string;
  details: string;
  icon: string;
}

@Component({
  selector: 'app-approvals-card',
  templateUrl: './approvals-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ApprovalsCardComponent {
  approvals = signal<Approval[]>([
    { type: 'Time Off Request', employeeName: 'Peter Jones', details: '5 days - Vacation', icon: 'calendar' },
    { type: 'Expense Report', employeeName: 'Mary Johnson', details: '$150 - Client Lunch', icon: 'currency-dollar' },
    { type: 'Timesheet', employeeName: 'Michael Williams', details: '40 hours - Week 42', icon: 'clock' },
  ]);

  handleApproval(approval: Approval, status: 'approved' | 'denied'): void {
    // In a real app, this would call a service.
    console.log(`${status} ${approval.type} for ${approval.employeeName}`);
    this.approvals.update(apps => apps.filter(a => a !== approval));
  }
}