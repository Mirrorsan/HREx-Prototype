import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { OrgChartComponent } from '../../components/org-chart/org-chart.component';

interface Employee {
  id: number;
  name: string;
  avatar: string;
  jobTitle: string;
  department: string;
  site: string;
  siteEmoji: string;
  salary: string;
  startDate: string;
  lifecycle: string;
  status: 'Invited' | 'Employed' | 'Absent';
  selected: boolean;
}

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrgChartComponent],
})
export class PeopleComponent {
  activeView = signal<'list' | 'orgChart'>('list');
  searchQuery = signal('');

  employees = signal<Employee[]>([
    { id: 1, name: 'Anatoly Belik', avatar: 'https://i.pravatar.cc/150?u=1', jobTitle: 'Head of Design', department: 'Product', site: 'Stockholm', siteEmoji: '🇸🇪', salary: '$1,350', startDate: 'Mar 13, 2023', lifecycle: 'Hired', status: 'Invited', selected: false },
    { id: 2, name: 'Ksenia Bator', avatar: 'https://i.pravatar.cc/150?u=2', jobTitle: 'Fullstack Engineer', department: 'Engineering', site: 'Miami', siteEmoji: '🇺🇸', salary: '$1,500', startDate: 'Oct 13, 2023', lifecycle: 'Hired', status: 'Absent', selected: true },
    { id: 3, name: 'Bogdan Nikitin', avatar: 'https://i.pravatar.cc/150?u=3', jobTitle: 'Mobile Lead', department: 'Product', site: 'Kyiv', siteEmoji: '🇺🇦', salary: '$2,600', startDate: 'Nov 4, 2023', lifecycle: 'Employed', status: 'Invited', selected: false },
    { id: 4, name: 'Arsen Yatsenko', avatar: 'https://i.pravatar.cc/150?u=4', jobTitle: 'Sales Manager', department: 'Operations', site: 'Ottawa', siteEmoji: '🇨🇦', salary: '$900', startDate: 'Sep 4, 2021', lifecycle: 'Hired', status: 'Invited', selected: false },
    { id: 5, name: 'Daria Yurchenko', avatar: 'https://i.pravatar.cc/150?u=5', jobTitle: 'Network engineer', department: 'Product', site: 'Sao Paulo', siteEmoji: '🇧🇷', salary: '$1,000', startDate: 'Feb 21, 2023', lifecycle: 'Hired', status: 'Invited', selected: false },
    { id: 6, name: 'Yulia Polishchuk', avatar: 'https://i.pravatar.cc/150?u=6', jobTitle: 'Head of Design', department: 'Product', site: 'London', siteEmoji: '🇬🇧', salary: '$1,700', startDate: 'Aug 2, 2024', lifecycle: 'Employed', status: 'Absent', selected: true },
  ]);

  filteredEmployees = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.employees();
    }
    return this.employees().filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.jobTitle.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.site.toLowerCase().includes(query)
    );
  });

  setView(view: 'list' | 'orgChart'): void {
    this.activeView.set(view);
  }

  toggleSelection(employeeId: number): void {
    this.employees.update(employees => 
      employees.map(emp => 
        emp.id === employeeId ? { ...emp, selected: !emp.selected } : emp
      )
    );
  }

  toggleAllSelection(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.employees.update(employees => 
      employees.map(emp => ({ ...emp, selected: isChecked }))
    );
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
  }
}