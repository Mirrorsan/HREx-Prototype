import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);
  
  private currentUser = this.authService.currentUser;

  employee = computed(() => {
    const user = this.currentUser();
    if (!user) return undefined;
    return this.employeeService.getEmployee(user.id)();
  });

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
  });

  passwordForm = new FormGroup({
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
  });

  twoStepEnabled = signal(false);
  supportAccessEnabled = signal(true);
  
  showSuccessMessage = signal(false);

  constructor() {
    effect(() => {
      const currentEmployee = this.employee();
      if (currentEmployee) {
        const [firstName, ...lastNameParts] = currentEmployee.name.split(' ');
        this.profileForm.patchValue({
            firstName: firstName || '',
            lastName: lastNameParts.join(' ') || '',
            email: currentEmployee.email
        });
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.employee()) return;
    
    const currentEmployee = this.employee()!;
    const formValue = this.profileForm.getRawValue();

    const updatedEmployee: Employee = {
      ...currentEmployee,
      name: `${formValue.firstName} ${formValue.lastName}`.trim(),
    };
    
    this.employeeService.updateEmployee(updatedEmployee);
    
    // Also update the auth service user
    const currentUser = this.authService.currentUser();
    if(currentUser) {
        this.authService.currentUser.set({
            ...currentUser,
            name: updatedEmployee.name
        });
    }

    this.showSuccessMessage.set(true);
    setTimeout(() => this.showSuccessMessage.set(false), 3000);
  }

  logoutAll(): void {
    // Placeholder for logging out of all devices
    alert('This functionality is not yet implemented.');
  }

  deleteAccount(): void {
    // Placeholder for account deletion
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        alert('This functionality is not yet implemented.');
    }
  }
}
