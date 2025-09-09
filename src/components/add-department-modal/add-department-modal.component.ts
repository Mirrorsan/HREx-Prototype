import { Component, ChangeDetectionStrategy, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-add-department-modal',
  // FIX: Converted to an inline template as creating new files is not supported.
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Add New Department</h2>
          <button (click)="onClose()" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <form [formGroup]="departmentForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="departmentName" class="block text-sm font-medium text-gray-700">Department Name</label>
              <input type="text" id="departmentName" formControlName="departmentName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="managerId" class="block text-sm font-medium text-gray-700">Assign Manager</label>
              <select id="managerId" formControlName="managerId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option [ngValue]="null" disabled>Select a manager</option>
                @for(employee of availableManagers(); track employee.id) {
                  <option [value]="employee.id">{{ employee.name }} ({{ employee.jobTitle }})</option>
                }
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-4">
            <button type="button" (click)="onClose()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" [disabled]="departmentForm.invalid" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">Create Department</button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddDepartmentModalComponent {
  close = output<void>();
  addDepartment = output<{ departmentName: string; managerId: number }>();

  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);

  private allEmployees = this.employeeService.getEmployees();
  private departments = this.departmentService.departmentTree;

  availableManagers = computed(() => {
    const existingManagerIds = new Set(this.departments().map(d => d.manager?.id).filter(id => id != null));
    return this.allEmployees().filter(e => !existingManagerIds.has(e.id));
  });
  
  departmentForm = new FormGroup({
    departmentName: new FormControl('', Validators.required),
    managerId: new FormControl<number | null>(null, Validators.required),
  });

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      return;
    }
    const { departmentName, managerId } = this.departmentForm.getRawValue();
    if (departmentName && managerId) {
        this.addDepartment.emit({ departmentName, managerId });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
