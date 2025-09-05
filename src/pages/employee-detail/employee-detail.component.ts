import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EmployeeService, Employee } from '../../services/employee.service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe]
})
export class EmployeeDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  private employeeId = signal<number | null>(null);
  
  employee = computed(() => {
    const id = this.employeeId();
    if (id === null) return undefined;
    return this.employeeService.getEmployee(id)();
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.employeeId.set(idParam ? +idParam : null);
  }

  goBack(): void {
    this.router.navigate(['/people']);
  }
}
