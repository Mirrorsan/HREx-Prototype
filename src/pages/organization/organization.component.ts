import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DepartmentService, DepartmentNode } from '../../services/department.service';
import { DepartmentOrgChartComponent } from '../../components/department-org-chart/department-org-chart.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, DepartmentOrgChartComponent],
})
export class OrganizationComponent {
  private departmentService = inject(DepartmentService);
  
  activeView = signal<'list' | 'orgChart'>('list');
  private departments = this.departmentService.departmentTree;
  
  expandedDepartments = signal<Set<string>>(new Set());
  searchQuery = signal('');

  filteredDepartments = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.departments();
    }

    const filterNodes = (nodes: DepartmentNode[]): DepartmentNode[] => {
      const result: DepartmentNode[] = [];
      for (const node of nodes) {
        const children = filterNodes(node.children);
        if (node.name.toLowerCase().includes(query) || children.length > 0) {
          result.push({ ...node, children });
        }
      }
      return result;
    };
    
    return filterNodes(this.departments());
  });
  
  constructor() {
    // Initially expand the root departments
    const initialExpanded = new Set(this.departments().map(d => d.id));
    this.expandedDepartments.set(initialExpanded);

    effect(() => {
      const query = this.searchQuery();
      if (query) {
        // When searching, expand all nodes in the filtered tree
        const allIds = new Set<string>();
        const collectIds = (nodes: DepartmentNode[]) => {
            for(const node of nodes) {
                allIds.add(node.id);
                collectIds(node.children);
            }
        };
        collectIds(this.filteredDepartments());
        this.expandedDepartments.set(allIds);
      } else {
        // When search is cleared, revert to initial state
        const initialExpanded = new Set(this.departments().map(d => d.id));
        this.expandedDepartments.set(initialExpanded);
      }
    });
  }

  setView(view: 'list' | 'orgChart'): void {
    this.activeView.set(view);
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

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
  }

  addSubDepartment(parentDept: DepartmentNode): void {
    const newDeptName = prompt(`Enter name for new sub-department under ${parentDept.name}:`);
    if (newDeptName) {
      alert(`Functionality to add "${newDeptName}" to ${parentDept.name} is not yet implemented.`);
      // Future: call departmentService.addDepartment(newDeptName, parentDept.id);
    }
  }

  editDepartment(dept: DepartmentNode): void {
    const updatedDeptName = prompt(`Enter new name for ${dept.name}:`, dept.name);
    if (updatedDeptName && updatedDeptName !== dept.name) {
      alert(`Functionality to rename "${dept.name}" to "${updatedDeptName}" is not yet implemented.`);
      // Future: call departmentService.updateDepartment(dept.id, updatedDeptName);
    }
  }

  deleteDepartment(dept: DepartmentNode): void {
    if (confirm(`Are you sure you want to delete the ${dept.name} department? This action cannot be undone.`)) {
      alert(`Functionality to delete ${dept.name} is not yet implemented.`);
      // Future: call departmentService.deleteDepartment(dept.id);
    }
  }
}
