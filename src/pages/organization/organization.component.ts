import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class OrganizationComponent {
  private departmentService = inject(DepartmentService);
  
  departments = this.departmentService.departmentTree;
  
  expandedDepartments = signal<Set<string>>(new Set());
  
  constructor() {
    // Initially expand the root departments to show the top-level structure
    const initialExpanded = new Set(this.departments().map(d => d.id));
    this.expandedDepartments.set(initialExpanded);
  }

  toggleDepartment(departmentId: string): void {
    this.expandedDepartments.update(currentSet => {
      const newSet = new Set(currentSet);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  }
}