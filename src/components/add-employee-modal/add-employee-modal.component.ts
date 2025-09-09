import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
// FIX: Import FormGroup and FormControl, and remove FormBuilder.
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService, NewEmployee } from '../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee-modal',
  template: `
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl relative" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-xl font-bold text-slate-800">Add New Employee</h2>
            <p class="text-sm text-slate-500">Enter the details for the new team member.</p>
          </div>
          <button (click)="close.emit()" class="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <!-- Form -->
        <form [formGroup]="addEmployeeForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <label for="name" class="block text-sm font-medium text-slate-700">Full Name</label>
              <input id="name" type="text" formControlName="name" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
             <div>
              <label for="nickname" class="block text-sm font-medium text-slate-700">Nickname</label>
              <input id="nickname" type="text" formControlName="nickname" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700">Email Address</label>
              <input id="email" type="email" formControlName="email" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="jobTitle" class="block text-sm font-medium text-slate-700">Job Title</label>
              <input id="jobTitle" type="text" formControlName="jobTitle" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="department" class="block text-sm font-medium text-slate-700">Department</label>
              <input id="department" type="text" formControlName="department" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="site" class="block text-sm font-medium text-slate-700">Site</label>
              <input id="site" type="text" formControlName="site" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="manager" class="block text-sm font-medium text-slate-700">Manager</label>
              <select id="manager" formControlName="managerId" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option [ngValue]="null">No Manager (e.g., CEO)</option>
                @for (manager of managers(); track manager.id) {
                  <option [value]="manager.id">{{ manager.name }}</option>
                }
              </select>
            </div>
            <div>
              <label for="startDate" class="block text-sm font-medium text-slate-700">Start Date</label>
              <input id="startDate" type="date" formControlName="startDate" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
             <div class="md:col-span-2 pt-2"><hr></div>
             <div>
              <label for="citizenId" class="block text-sm font-medium text-slate-700">Citizen ID (Optional)</label>
              <input id="citizenId" type="text" formControlName="citizenId" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
             <div>
              <label for="taxId" class="block text-sm font-medium text-slate-700">Tax ID (Optional)</label>
              <input id="taxId" type="text" formControlName="taxId" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
             <div>
              <label for="dateOfBirth" class="block text-sm font-medium text-slate-700">Date of Birth (Optional)</label>
              <input id="dateOfBirth" type="date" formControlName="dateOfBirth" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>

          <!-- Footer/Actions -->
          <div class="mt-8 pt-5 border-t border-slate-200 flex justify-end space-x-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" [disabled]="addEmployeeForm.invalid" class="px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md shadow-sm hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddEmployeeModalComponent {
  private employeeService = inject(EmployeeService);
  
  close = output<void>();
  add = output<NewEmployee>();
  
  managers = this.employeeService.getEmployees();

  // FIX: Use new FormGroup and new FormControl instead of FormBuilder to avoid injection issues.
  addEmployeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    jobTitle: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    site: new FormControl('', Validators.required),
    managerId: new FormControl(null as number | null),
    startDate: new FormControl('', Validators.required),
    citizenId: new FormControl(''),
    taxId: new FormControl(''),
    dateOfBirth: new FormControl(''),
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