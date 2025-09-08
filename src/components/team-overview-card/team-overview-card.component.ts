import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-team-overview-card',
  templateUrl: './team-overview-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class TeamOverviewCardComponent {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);

  private managerId = computed(() => this.authService.currentUser()?.id);

  teamMembers = computed(() => {
    const allEmployees = this.employeeService.getEmployees()();
    const id = this.managerId();
    if (!id) return [];
    return allEmployees.filter(emp => emp.managerId === id);
  });
}