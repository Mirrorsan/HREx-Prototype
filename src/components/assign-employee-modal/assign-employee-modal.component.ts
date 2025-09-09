import { Component, ChangeDetectionStrategy, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService, DepartmentNode } from '../../services/department.service';

@Component({
  selector: 'app-assign-employee-modal',
  // FIX: Converted to an inline template as creating new files is not supported.
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Assign Employee to Department</h2>
          <button (click)="onClose()" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <form [formGroup]="assignForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="employeeId" class="block text-sm font-medium text-gray-700">Employee</label>
              <select id="employeeId" formControlName="employeeId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option [ngValue]="null" disabled>Select an employee</option>
                @for(employee of employees(); track employee.id) {
                  <option [value]="employee.id">{{ employee.name }}</option>
                }
              </select>
            </div>
            <div>
              <label for="departmentName" class="block text-sm font-medium text-gray-700">Department</label>
              <select id="departmentName" formControlName="departmentName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option [ngValue]="null" disabled>Select a department</option>
                @for(department of flatDepartments(); track department.id) {
                  <option [value]="department.name">{{ department.name }}</option>
                }
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-4">
            <button type="button" (click)="onClose()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" [disabled]="assignForm.invalid" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">Assign Employee</button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AssignEmployeeModalComponent {
  close = output<void>();
  assignEmployee = output<{ employeeId: number; departmentName: string }>();
  
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);

  employees = this.employeeService.getEmployees();
  private departments = this.departmentService.departmentTree;

  flatDepartments = computed(() => {
    const flatten = (nodes: DepartmentNode[]): DepartmentNode[] => {
      let flatList: DepartmentNode[] = [];
      for (const node of nodes) {
        flatList.push(node);
        if (node.children && node.children.length > 0) {
          flatList = flatList.concat(flatten(node.children));
        }
      }
      return flatList;
    };
    return flatten(this.departments());
  });

  assignForm = new FormGroup({
    employeeId: new FormControl<number | null>(null, Validators.required),
    departmentName: new FormControl<string | null>(null, Validators.required),
  });

  onSubmit(): void {
    if (this.assignForm.invalid) {
      return;
    }
    const { employeeId, departmentName } = this.assignForm.getRawValue();
    if (employeeId && departmentName) {
        this.assignEmployee.emit({ employeeId, departmentName });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
