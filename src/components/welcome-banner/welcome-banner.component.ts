import { Component, ChangeDetectionStrategy, signal, input, computed, inject } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { AuthService, Role } from '../../services/auth.service';

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
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);

  userName = input.required<string | undefined>();
  userRole = input.required<Role | undefined>();

  private allEmployees = this.employeeService.getEmployees();
  private managerId = computed(() => this.authService.currentUser()?.id);
  
  teamMembers = computed(() => {
    const id = this.managerId();
    if (!id || this.userRole() !== 'Manager') return [];
    return this.allEmployees().filter(e => e.managerId === id);
  });

  teamMembersOnLeaveCount = computed(() => {
    return this.teamMembers().filter(m => m.status === 'On Leave').length;
  });

  kpis = signal<Kpi[]>([
    { name: 'Interviews', value: '15%', color: 'bg-yellow-400' },
    { name: 'Hired', value: '15%', color: 'bg-yellow-400' },
    { name: 'Project time', value: '60%', color: 'bg-yellow-400' },
    { name: 'Output', value: '10%', color: 'bg-slate-200' },
  ]);
}