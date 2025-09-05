import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, ReactiveFormsModule, CommonModule]
})
export class EmployeeDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  private employeeId = signal<number | null>(null);
  
  isEditing = signal(false);
  
  employee = computed(() => {
    const id = this.employeeId();
    if (id === null) return undefined;
    return this.employeeService.getEmployee(id)();
  });
  
  canEdit = computed(() => this.authService.hasPermission('people:employee:edit'));

  profileForm = this.fb.group({
    name: ['', Validators.required],
    nickname: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    dateOfBirth: [''],
    currentAddress: [''],
    permanentAddress: [''],
    jobTitle: ['', Validators.required],
    department: [''],
    site: [''],
    citizenId: [''],
    taxId: [''],
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.employeeId.set(idParam ? +idParam : null);

    effect(() => {
      const currentEmployee = this.employee();
      if (currentEmployee) {
        this.profileForm.patchValue({
            ...currentEmployee,
            dateOfBirth: currentEmployee.dateOfBirth ? new Date(currentEmployee.dateOfBirth).toISOString().split('T')[0] : ''
        });
      }
    });
  }

  toggleEditMode(): void {
    if (!this.isEditing()) {
      const currentEmployee = this.employee();
      if(currentEmployee) {
         this.profileForm.patchValue({
            ...currentEmployee,
            dateOfBirth: currentEmployee.dateOfBirth ? new Date(currentEmployee.dateOfBirth).toISOString().split('T')[0] : ''
        });
      }
    }
    this.isEditing.update(v => !v);
  }

  saveChanges(): void {
    if (this.profileForm.invalid || !this.employee()) {
      return;
    }
    const currentEmployee = this.employee()!;
    const formValue = this.profileForm.getRawValue();

    const updatedEmployee: Employee = {
      ...currentEmployee,
      name: formValue.name!,
      nickname: formValue.nickname!,
      email: formValue.email!,
      phone: formValue.phone!,
      dateOfBirth: formValue.dateOfBirth!,
      currentAddress: formValue.currentAddress!,
      permanentAddress: formValue.permanentAddress!,
      jobTitle: formValue.jobTitle!,
      department: formValue.department!,
      site: formValue.site!,
      citizenId: formValue.citizenId!,
      taxId: formValue.taxId!,
    };
    
    this.employeeService.updateEmployee(updatedEmployee);
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    const currentEmployee = this.employee();
    if(currentEmployee) {
       this.profileForm.patchValue({
            ...currentEmployee,
            dateOfBirth: currentEmployee.dateOfBirth ? new Date(currentEmployee.dateOfBirth).toISOString().split('T')[0] : ''
        });
    }
    this.isEditing.set(false);
  }

  goBack(): void {
    this.router.navigate(['/people']);
  }
}
