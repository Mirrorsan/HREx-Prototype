import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService, NewEmployee } from '../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee-modal',
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative" (click)="$event.stopPropagation()">
        <button (click)="close.emit()" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 class="text-2xl font-bold mb-6">Add New Employee</h2>
        <form [formGroup]="addEmployeeForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" type="text" formControlName="name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
             <div>
              <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname</label>
              <input id="nickname" type="text" formControlName="nickname" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <input id="email" type="email" formControlName="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
            <div>
              <label for="jobTitle" class="block text-sm font-medium text-gray-700">Job Title</label>
              <input id="jobTitle" type="text" formControlName="jobTitle" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
            <div>
              <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
              <input id="department" type="text" formControlName="department" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
            <div>
              <label for="site" class="block text-sm font-medium text-gray-700">Site</label>
              <input id="site" type="text" formControlName="site" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
            <div>
              <label for="manager" class="block text-sm font-medium text-gray-700">Manager</label>
              <select id="manager" formControlName="managerId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
                <option [ngValue]="null">No Manager (e.g., CEO)</option>
                @for (manager of managers(); track manager.id) {
                  <option [value]="manager.id">{{ manager.name }}</option>
                }
              </select>
            </div>
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
              <input id="startDate" type="date" formControlName="startDate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
             <div class="md:col-span-2"><hr class="my-2"></div>
             <div>
              <label for="citizenId" class="block text-sm font-medium text-gray-700">Citizen ID</label>
              <input id="citizenId" type="text" formControlName="citizenId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
             <div>
              <label for="taxId" class="block text-sm font-medium text-gray-700">Tax ID</label>
              <input id="taxId" type="text" formControlName="taxId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
             <div>
              <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input id="dateOfBirth" type="date" formControlName="dateOfBirth" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
            <button type="submit" [disabled]="addEmployeeForm.invalid" class="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 disabled:bg-slate-400">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddEmployeeModalComponent {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  
  close = output<void>();
  add = output<NewEmployee>();
  
  managers = this.employeeService.getEmployees();

  addEmployeeForm = this.fb.group({
    name: ['', Validators.required],
    nickname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jobTitle: ['', Validators.required],
    department: ['', Validators.required],
    site: ['', Validators.required],
    managerId: [null as number | null],
    startDate: ['', Validators.required],
    citizenId: [''],
    taxId: [''],
    dateOfBirth: [''],
  });

  onSubmit(): void {
    if (this.addEmployeeForm.invalid) {
      this.addEmployeeForm.markAllAsTouched();
      return;
    }
    
    const formValue = this.addEmployeeForm.getRawValue();

    const newEmployee: NewEmployee = {
      name: formValue.name!,
      nickname: formValue.nickname!,
      email: formValue.email!,
      jobTitle: formValue.jobTitle!,
      department: formValue.department!,
      site: formValue.site!,
      status: 'Invited', // New employees are invited
      managerId: formValue.managerId ? +formValue.managerId : null,
      startDate: new Date(formValue.startDate!).toISOString(),
      avatar: `https://i.pravatar.cc/150?u=${formValue.email}`,
      citizenId: formValue.citizenId || '',
      taxId: formValue.taxId || '',
      dateOfBirth: formValue.dateOfBirth || ''
    };

    this.add.emit(newEmployee);
  }
}
