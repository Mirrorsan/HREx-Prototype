import { Injectable, signal } from '@angular/core';

export type Role = 'Admin' | 'HR' | 'Manager' | 'Employee';

export interface User {
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
  currentUser = signal<User | null>(null);

  constructor() {
    // Set a default user for initial load, let's say HR.
    this.login('HR');
  }

  login(role: Role): void {
    const user: User = {
      name: 'Lora Piterson', // Using the name from the profile card
      role,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    };
    this.currentUser.set(user);
  }

  logout(): void {
    this.currentUser.set(null);
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user) {
      return false;
    }
    return PERMISSIONS[user.role]?.includes(permission);
  }
}