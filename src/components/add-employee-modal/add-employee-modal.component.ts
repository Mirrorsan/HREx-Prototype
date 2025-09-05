import { Component, ChangeDetectionStrategy, input, output, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// FIX: Import EmployeeService and the consolidated NewEmployee interface.
import { EmployeeService, NewEmployee } from '../../services/employee.service';

@Component({
  selector: 'app-add-employee-modal',
  // FIX: Using an inline template as the original file was missing and this is a small component.
  template: `
    @if (show()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 z-40" (click)="closeModal()"></div>
      <div class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
          <div class="p-6 border-b">
            <h2 class="text-2xl font-semibold text-slate-800">Add New Employee</h2>
            <p class="text-slate-500">Enter the details for the new team member.</p>
          </div>
          <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" id="name" formControlName="name" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                @if (employeeForm.get('name')?.invalid && employeeForm.get('name')?.touched) {
                  <p class="text-red-500 text-xs mt-1">Full Name is required.</p>
                }
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-slate-700">Work Email</label>
                <input type="email" id="email" formControlName="email" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                 @if (employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched) {
                  <p class="text-red-500 text-xs mt-1">
                    @if (employeeForm.get('email')?.errors?.['required']) {
                      Email is required.
                    }
                    @if (employeeForm.get('email')?.errors?.['email']) {
                      Please enter a valid email address.
                    }
                  </p>
                }
              </div>
              <div>
                <label for="jobTitle" class="block text-sm font-medium text-slate-700">Job Title</label>
                <input type="text" id="jobTitle" formControlName="jobTitle" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                 @if (employeeForm.get('jobTitle')?.invalid && employeeForm.get('jobTitle')?.touched) {
                  <p class="text-red-500 text-xs mt-1">Job Title is required.</p>
                }
              </div>
              <div>
                <label for="department" class="block text-sm font-medium text-slate-700">Department</label>
                <input type="text" id="department" formControlName="department" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                 @if (employeeForm.get('department')?.invalid && employeeForm.get('department')?.touched) {
                  <p class="text-red-500 text-xs mt-1">Department is required.</p>
                }
              </div>
              <div>
                <label for="site" class="block text-sm font-medium text-slate-700">Site Location</label>
                <input type="text" id="site" formControlName="site" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                @if (employeeForm.get('site')?.invalid && employeeForm.get('site')?.touched) {
                  <p class="text-red-500 text-xs mt-1">Site is required.</p>
                }
              </div>
              <div>
                <label for="managerId" class="block text-sm font-medium text-slate-700">Manager</label>
                <select id="managerId" formControlName="managerId" class="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option [ngValue]="null">No Manager (Root Level)</option>
                  @for (manager of managers(); track manager.id) {
                    <option [value]="manager.id">{{ manager.name }}</option>
                  }
                </select>
              </div>
            </div>
            <div class="p-6 bg-slate-50 rounded-b-lg flex justify-end items-center gap-3">
              <button type="button" (click)="closeModal()" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
              <button type="submit" [disabled]="employeeForm.invalid" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                Add Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class AddEmployeeModalComponent {
  show = input.required<boolean>();
  close = output<void>();
  addEmployee = output<NewEmployee>();

  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  
  employeeForm: FormGroup;
  
  employees = this.employeeService.getEmployees();
  
  managers = computed(() => this.employees().filter(e => e.jobTitle.includes('Manager') || e.jobTitle.includes('Lead') || e.jobTitle.includes('Director') || e.jobTitle.includes('CEO')));

  constructor() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
      site: ['', Validators.required],
      managerId: [null],
    });
  }

  closeModal(): void {
    this.close.emit();
    this.employeeForm.reset();
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const newEmployee: NewEmployee = {
        name: formValue.name,
        email: formValue.email,
        jobTitle: formValue.jobTitle,
        department: formValue.department,
        site: formValue.site,
        managerId: formValue.managerId ? +formValue.managerId : null,
      };
      this.addEmployee.emit(newEmployee);
      this.closeModal();
    }
  }
}
