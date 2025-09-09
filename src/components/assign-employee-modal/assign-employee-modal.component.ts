import { Component, ChangeDetectionStrategy, output, inject, computed } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService, DepartmentNode } from '../../services/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-employee-modal',
  template: `
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
            <div>
                <h2 class="text-xl font-bold text-slate-800">Assign Employee</h2>
                <p class="text-sm text-slate-500">Move an employee to a different department.</p>
            </div>
            <button (click)="close.emit()" class="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Form -->
        <form [formGroup]="assignForm" (ngSubmit)="onSubmit()">
          <div class="space-y-5">
            <div>
              <label for="employeeId" class="block text-sm font-medium text-slate-700">Employee</label>
              <select id="employeeId" formControlName="employeeId" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option [ngValue]="null" disabled>Select an employee</option>
                @for (employee of employees(); track employee.id) {
                  <option [value]="employee.id">{{ employee.name }} (Current: {{ employee.department }})</option>
                }
              </select>
            </div>
             <div>
              <label for="departmentName" class="block text-sm font-medium text-slate-700">New Department</label>
              <select id="departmentName" formControlName="departmentName" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option [ngValue]="null" disabled>Select a department</option>
                @for (dept of allDepartments(); track dept) {
                  <option [value]="dept">{{ dept }}</option>
                }
              </select>
            </div>
          </div>
          
          <!-- Footer/Actions -->
          <div class="mt-8 pt-5 border-t border-slate-200 flex justify-end space-x-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" [disabled]="assignForm.invalid" class="px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md shadow-sm hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed">Assign</button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AssignEmployeeModalComponent {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  
  close = output<void>();
  assign = output<{ employeeId: number; departmentName: string }>();
  
  employees = this.employeeService.getEmployees();
  
  allDepartments = computed(() => {
    const flattened: string[] = [];
    const flatten = (nodes: DepartmentNode[]) => {
        for (const node of nodes) {
            flattened.push(node.name);
            if (node.children) {
                flatten(node.children);
            }
        }
    };
    flatten(this.departmentService.departmentTree());
    return flattened.sort();
  });

  assignForm = new FormGroup({
    employeeId: new FormControl(null as number | null, Validators.required),
    departmentName: new FormControl(null as string | null, Validators.required),
  });

  onSubmit(): void {
    if (this.assignForm.invalid) {
      this.assignForm.markAllAsTouched();
      return;
    }
    
    const formValue = this.assignForm.getRawValue();
    this.assign.emit({
      employeeId: formValue.employeeId!,
      departmentName: formValue.departmentName!,
    });
  }
}