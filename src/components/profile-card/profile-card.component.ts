import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface AccordionItem {
  id: string;
  title: string;
  content: string[];
  icon: string;
  expanded: boolean;
}

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  accordionItems = signal<AccordionItem[]>([
    { id: 'pension', title: 'Pension contributions', content: ['Standard Plan - 5% Match'], icon: 'credit-card', expanded: false },
    { id: 'devices', title: 'Devices', content: ['MacBook Air M1', 'iPhone 15 Pro'], icon: 'desktop-computer', expanded: true },
    { id: 'compensation', title: 'Compensation Summary', content: ['View Details'], icon: 'chart-pie', expanded: false },
    { id: 'benefits', title: 'Employee Benefits', content: ['Health, Dental, Vision'], icon: 'shield-check', expanded: false },
  ]);

  toggleAccordion(itemId: string): void {
    this.accordionItems.update(items =>
      items.map(item =>
        item.id === itemId ? { ...item, expanded: !item.expanded } : item
      )
    );
  }
}
