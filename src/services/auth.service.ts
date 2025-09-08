import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';

export type Role = 'Admin' | 'HR' | 'Manager' | 'Employee';

export interface User {
  id: number;
  name: string;
  role: Role;
  avatar: string;
}

const PERMISSIONS: Record<Role, string[]> = {
  Admin: [
    'people:list:view',
    'people:list:export',
    'people:employee:add',
    'people:employee:edit',
    'people:employee:delete',
    'people:employee:status',
    'people:org-chart:view',
    'people:org-chart:manage',
    'dashboard:view:full'
  ],
  HR: [
    'people:list:view',
    'people:list:export',
    'people:employee:add',
    'people:employee:edit',
    'people:employee:delete',
    'people:employee:status',
    'people:org-chart:view',
    'people:org-chart:manage',
    'dashboard:view:full'
  ],
  Manager: [
    'people:list:view',
    'people:list:export',
    'people:org-chart:view',
    'dashboard:view:full'
  ],
  Employee: [
    'people:list:view', // Can view colleagues
    'people:org-chart:view',
    'dashboard:view:limited'
  ],
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  currentUser = signal<User | null>(null);

  constructor() {
    // No default user on startup
  }

  login(role: Role): void {
    const employee = this.employeeService.getEmployee(1)();
    if (!employee) {
        console.error("Login failed: Employee with ID 1 not found.");
        return;
    }
    
    let jobTitle = employee.jobTitle;
    switch (role) {
      case 'Admin':
        jobTitle = 'System Administrator';
        break;
      case 'HR':
        jobTitle = 'HR Manager';
        break;
      case 'Manager':
        jobTitle = 'Team Manager';
        break;
      case 'Employee':
        jobTitle = 'UX/UI Designer';
        break;
    }

    this.employeeService.updateEmployee({ ...employee, jobTitle });

    const user: User = {
      id: 1, // Lora Piterson's ID
      name: 'Lora Piterson', // Using the name from the profile card
      role,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    };
    this.currentUser.set(user);
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user) {
      return false;
    }
    return PERMISSIONS[user.role]?.includes(permission);
  }
}