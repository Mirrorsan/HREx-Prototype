import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OrgChartComponent } from '../../components/org-chart/org-chart.component';
import { AuthService } from '../../services/auth.service';
// FIX: The NewEmployee interface should be imported from the employee service where it is defined.
import { AddEmployeeModalComponent } from '../../components/add-employee-modal/add-employee-modal.component';
import { EmployeeService, Employee, NewEmployee } from '../../services/employee.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrgChartComponent, AddEmployeeModalComponent, DatePipe],
})
export class PeopleComponent {
  authService = inject(AuthService);
  employeeService = inject(EmployeeService);
  router = inject(Router);

  activeView = signal<'list' | 'orgChart'>('list');
  searchQuery = signal('');
  showAddEmployeeModal = signal(false);
  activeActionMenu = signal<number | null>(null);

  canAddEmployee = computed(() => this.authService.hasPermission('people:employee:add'));
  canExportList = computed(() => this.authService.hasPermission('people:list:export'));
  canManageEmployees = computed(() => 
    this.authService.hasPermission('people:employee:edit') || 
    this.authService.hasPermission('people:employee:delete') ||
    this.authService.hasPermission('people:employee:status')
  );
  canEditEmployee = computed(() => this.authService.hasPermission('people:employee:edit'));
  canDeleteEmployee = computed(() => this.authService.hasPermission('people:employee:delete'));
  canEditStatus = computed(() => this.authService.hasPermission('people:employee:status'));

  readonly availableStatuses: Employee['status'][] = ['Active', 'On Leave', 'Invited'];
  
  employees = this.employeeService.getEmployees();

  filteredEmployees = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.employees();
    }
    return this.employees().filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.nickname.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.jobTitle.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.site.toLowerCase().includes(query)
    );
  });

  setView(view: 'list' | 'orgChart'): void {
    this.activeView.set(view);
  }

  toggleSelection(employeeId: number): void {
    this.employeeService.toggleSelection(employeeId);
  }

  toggleAllSelection(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.employeeService.toggleAllSelection(isChecked);
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
  }

  openAddEmployeeModal(): void {
    this.showAddEmployeeModal.set(true);
  }

  closeAddEmployeeModal(): void {
    this.showAddEmployeeModal.set(false);
  }

  handleAddEmployee(newEmployeeData: NewEmployee): void {
    this.employeeService.addEmployee(newEmployeeData);
    this.closeAddEmployeeModal();
  }

  toggleActionMenu(employeeId: number): void {
    this.activeActionMenu.update(currentId => currentId === employeeId ? null : employeeId);
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/people', employee.id]);
    this.activeActionMenu.set(null);
  }

  deleteEmployee(employeeId: number): void {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      this.employeeService.deleteEmployee(employeeId);
    }
    this.activeActionMenu.set(null);
  }
  
  changeStatus(employeeId: number, newStatus: Employee['status']): void {
    this.employeeService.changeStatus(employeeId, newStatus);
    this.activeActionMenu.set(null);
  }
}
