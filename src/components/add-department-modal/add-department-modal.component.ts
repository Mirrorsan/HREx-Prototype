import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-department-modal',
  template: `
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
            <div>
                <h2 class="text-xl font-bold text-slate-800">Add New Department</h2>
                <p class="text-sm text-slate-500">Create a new department and assign its manager.</p>
            </div>
            <button (click)="close.emit()" class="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Form -->
        <form [formGroup]="addDepartmentForm" (ngSubmit)="onSubmit()">
          <div class="space-y-5">
            <div>
              <label for="departmentName" class="block text-sm font-medium text-slate-700">Department Name</label>
              <input id="departmentName" type="text" formControlName="departmentName" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
             <div>
              <label for="managerId" class="block text-sm font-medium text-slate-700">Assign a Manager</label>
              <p class="text-xs text-slate-400">The selected employee will be moved to this new department.</p>
              <select id="managerId" formControlName="managerId" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option [ngValue]="null" disabled>Select an employee</option>
                @for (employee of employees(); track employee.id) {
                  <option [value]="employee.id">{{ employee.name }} ({{ employee.jobTitle }})</option>
                }
              </select>
            </div>
          </div>

          <!-- Footer/Actions -->
          <div class="mt-8 pt-5 border-t border-slate-200 flex justify-end space-x-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" [disabled]="addDepartmentForm.invalid" class="px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md shadow-sm hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed">Create Department</button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddDepartmentModalComponent {
  private employeeService = inject(EmployeeService);
  
  close = output<void>();
  add = output<{ departmentName: string; managerId: number }>();
  
  employees = this.employeeService.getEmployees();

  addDepartmentForm = new FormGroup({
    departmentName: new FormControl('', Validators.required),
    managerId: new FormControl(null as number | null, Validators.required),
  });

  onSubmit(): void {
    if (this.addDepartmentForm.invalid) {
      this.addDepartmentForm.markAllAsTouched();
      return;
    }
    
    const formValue = this.addDepartmentForm.getRawValue();
    this.add.emit({
      departmentName: formValue.departmentName!,
      managerId: formValue.managerId!,
    });
  }
}