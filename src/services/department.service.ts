import { Injectable, computed, inject } from '@angular/core';
import { EmployeeService, Employee } from './employee.service';

export interface DepartmentNode {
  id: string;
  name: string;
  manager: Employee | null;
  memberCount: number;
  children: DepartmentNode[];
  members: Employee[];
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private employeeService = inject(EmployeeService);
  private employees = this.employeeService.getEmployees();

  departmentTree = computed(() => {
    const employees = this.employees();
    const employeeMap = new Map(employees.map(e => [e.id, e]));
    
    const departmentData: { [key: string]: { employees: Employee[], manager: Employee | null, parentDepartment: string | null } } = {};

    // Group employees by department and initialize data structure
    for (const employee of employees) {
      if (!departmentData[employee.department]) {
        departmentData[employee.department] = { employees: [], manager: null, parentDepartment: null };
      }
      departmentData[employee.department].employees.push(employee);
    }
    
    const departmentNames = Object.keys(departmentData);

    // Identify manager and parent department for each department
    for (const deptName of departmentNames) {
      const { employees: employeesInDept } = departmentData[deptName];
      
      // Find the employee(s) who are at the top of the hierarchy within this department
      const potentialHeads = employeesInDept.filter(e => {
        if (e.managerId === null) return true; // CEO or top-level
        const manager = employeeMap.get(e.managerId);
        // Head is someone whose manager is not in the same department
        return !manager || manager.department !== deptName;
      });
      
      const manager = potentialHeads.length > 0 ? potentialHeads[0] : null;
      departmentData[deptName].manager = manager;

      // Determine the parent department based on the manager's manager
      if (manager && manager.managerId) {
        const headManager = employeeMap.get(manager.managerId);
        if (headManager) {
          departmentData[deptName].parentDepartment = headManager.department;
        }
      }
    }
    
    // Build the final hierarchical tree structure
    const nodes: { [key: string]: DepartmentNode } = {};
    departmentNames.forEach(deptName => {
      nodes[deptName] = {
        id: deptName,
        name: deptName,
        manager: departmentData[deptName].manager,
        memberCount: departmentData[deptName].employees.length,
        children: [],
        members: departmentData[deptName].employees,
      };
    });
    
    const roots: DepartmentNode[] = [];
    for (const deptName of departmentNames) {
        const parentDeptName = departmentData[deptName].parentDepartment;
        if(parentDeptName && nodes[parentDeptName] && parentDeptName !== deptName) {
            nodes[parentDeptName].children.push(nodes[deptName]);
        } else {
            roots.push(nodes[deptName]);
        }
    }

    return roots;
  });
}
