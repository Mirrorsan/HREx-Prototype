import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
// FIX: Import FormGroup and FormControl, and remove FormBuilder.
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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

  private employeeId = signal<number | null>(null);
  
  isEditing = signal(false);
  
  employee = computed(() => {
    const id = this.employeeId();
    if (id === null) return undefined;
    return this.employeeService.getEmployee(id)();
  });
  
  canEdit = computed(() => this.authService.hasPermission('people:employee:edit'));

  // FIX: Use new FormGroup and new FormControl instead of FormBuilder to avoid injection issues.
  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    nickname: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    dateOfBirth: new FormControl(''),
    currentAddress: new FormControl(''),
    permanentAddress: new FormControl(''),
    jobTitle: new FormControl('', Validators.required),
    department: new FormControl(''),
    site: new FormControl(''),
    citizenId: new FormControl(''),
    taxId: new FormControl(''),
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
    this.router.navigate(['/core/employee']);
  }
}