import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Employee } from '../../services/employee.service';

export type NewEmployee = Omit<Employee, 'id' | 'avatar' | 'siteEmoji' | 'selected' | 'salary' | 'managerId'> & { salary: number };

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class AddEmployeeModalComponent {
  add = output<NewEmployee>();
  close = output<void>();

  addEmployeeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addEmployeeForm = this.fb.group({
      name: ['', Validators.required],
      nickname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: ['', Validators.required],
      department: ['Product', Validators.required],
      site: ['Stockholm', Validators.required],
      salary: [1000, [Validators.required, Validators.min(0)]],
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
      status: ['Active', Validators.required],
      phone: ['+45 63 81 04 92', Validators.required],
      location: ['Copenhagen, Denmark', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addEmployeeForm.valid) {
      this.add.emit(this.addEmployeeForm.value);
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
