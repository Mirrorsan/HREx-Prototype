import { Component, ChangeDetectionStrategy, signal, computed, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OrgChartComponent } from '../../components/org-chart/org-chart.component';
import { AuthService } from '../../services/auth.service';
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

  // Filter state
  departmentFilter = signal<string>('all');
  siteFilter = signal<string>('all');
  statusFilter = signal<Employee['status'] | 'all'>('all');

  // Pagination state
  currentPage = signal(1);
  pageSize = 15;

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

  // Dynamic filter options
  departments = computed(() => {
    const allDepartments = this.employees().map(e => e.department);
    return ['all', ...new Set(allDepartments)];
  });
  sites = computed(() => {
    const allSites = this.employees().map(e => e.site);
    return ['all', ...new Set(allSites)];
  });
  statuses = computed((): (Employee['status'] | 'all')[] => {
    return ['all', 'Active', 'On Leave', 'Invited'];
  });

  filteredEmployees = computed(() => {
    const department = this.departmentFilter();
    const site = this.siteFilter();
    const status = this.statusFilter();
    const query = this.searchQuery().toLowerCase().trim();

    let filtered = this.employees();

    if (department !== 'all') {
      filtered = filtered.filter(e => e.department === department);
    }
    if (site !== 'all') {
      filtered = filtered.filter(e => e.site === site);
    }
    if (status !== 'all') {
      filtered = filtered.filter(e => e.status === status);
    }

    if (!query) {
      return filtered;
    }

    return filtered.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.nickname.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.jobTitle.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.site.toLowerCase().includes(query)
    );
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredEmployees().length / this.pageSize);
  });

  paginatedEmployees = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEmployees().slice(start, end);
  });

  constructor() {
    effect(() => {
      // Reset to the first page whenever filters or search query change
      this.searchQuery();
      this.departmentFilter();
      this.siteFilter();
      this.statusFilter();
      this.currentPage.set(1);
    });
  }
  
  // Filter change handlers
  onDepartmentChange(event: Event): void {
    this.departmentFilter.set((event.target as HTMLSelectElement).value);
  }
  onSiteChange(event: Event): void {
    this.siteFilter.set((event.target as HTMLSelectElement).value);
  }
  onStatusChange(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as Employee['status'] | 'all');
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
        this.currentPage.set(page);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

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
    this.router.navigate(['/core/employee', employee.id]);
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