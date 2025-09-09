import { Component, ChangeDetectionStrategy, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NewEmployee, EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-add-employee-modal',
  // FIX: Converted to an inline template as creating new files is not supported.
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Add New Employee</h2>
          <button (click)="onClose()" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" formControlName="name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <div>
              <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname</label>
              <input type="text" id="nickname" formControlName="nickname" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" formControlName="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <div>
              <label for="jobTitle" class="block text-sm font-medium text-gray-700">Job Title</label>
              <input type="text" id="jobTitle" formControlName="jobTitle" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <div>
              <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
              <input type="text" id="department" formControlName="department" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <div>
              <label for="site" class="block text-sm font-medium text-gray-700">Site</label>
              <input type="text" id="site" formControlName="site" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select id="status" formControlName="status" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                @for(status of availableStatuses; track status) {
                  <option [value]="status">{{ status }}</option>
                }
              </select>
            </div>
            
            <div>
              <label for="managerId" class="block text-sm font-medium text-gray-700">Manager</label>
              <select id="managerId" formControlName="managerId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option [ngValue]="null">No Manager</option>
                @for(manager of managers(); track manager.id) {
                  <option [value]="manager.id">{{ manager.name }}</option>
                }
              </select>
            </div>
            
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" id="startDate" formControlName="startDate" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

             <div>
              <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" id="dateOfBirth" formControlName="dateOfBirth" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <div>
              <label for="citizenId" class="block text-sm font-medium text-gray-700">Citizen ID</label>
              <input type="text" id="citizenId" formControlName="citizenId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <div>
              <label for="taxId" class="block text-sm font-medium text-gray-700">Tax ID</label>
              <input type="text" id="taxId" formControlName="taxId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

          </div>
          
          <div class="mt-6 flex justify-end gap-4">
            <button type="button" (click)="onClose()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" [disabled]="employeeForm.invalid" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddEmployeeModalComponent {
  close = output<void>();
  addEmployee = output<NewEmployee>();

  private employeeService = inject(EmployeeService);
  
  managers = computed(() => this.employeeService.getEmployees()().filter(e => e.jobTitle.includes('Manager') || e.jobTitle.includes('Lead') || e.jobTitle.includes('VP') || e.jobTitle.includes('CEO') || e.jobTitle.includes('CTO') || e.jobTitle.includes('Director')));
  
  readonly availableStatuses: Employee['status'][] = ['Active', 'On Leave', 'Invited'];
  
  employeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    nickname: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    jobTitle: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    site: new FormControl('', Validators.required),
    status: new FormControl<Employee['status']>('Invited', Validators.required),
    managerId: new FormControl<number | null>(null),
    startDate: new FormControl('', Validators.required),
    avatar: new FormControl('https://i.pravatar.cc/150'),
    dateOfBirth: new FormControl(''),
    citizenId: new FormControl(''),
    taxId: new FormControl(''),
  });

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    
    const formValue = this.employeeForm.getRawValue();

    const newEmployee: NewEmployee = {
      name: formValue.name!,
      nickname: formValue.nickname!,
      email: formValue.email!,
      jobTitle: formValue.jobTitle!,
      department: formValue.department!,
      site: formValue.site!,
      status: formValue.status!,
      managerId: formValue.managerId ? +formValue.managerId : null,
      startDate: formValue.startDate ? new Date(formValue.startDate).toISOString() : new Date().toISOString(),
      avatar: `${formValue.avatar}?u=${formValue.email}`,
      dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth).toISOString() : undefined,
      citizenId: formValue.citizenId || undefined,
      taxId: formValue.taxId || undefined,
    };
    
    this.addEmployee.emit(newEmployee);
  }

  onClose(): void {
    this.close.emit();
  }
}
