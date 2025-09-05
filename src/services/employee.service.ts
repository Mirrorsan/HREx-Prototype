import { Injectable, signal, computed } from '@angular/core';
import { NewEmployee } from '../components/add-employee-modal/add-employee-modal.component';

export interface Employee {
  id: number;
  managerId: number | null;
  name: string;
  nickname: string;
  email: string;
  avatar: string;
  jobTitle: string;
  department: string;
  site: string;
  siteEmoji: string;
  salary: string;
  startDate: string;
  status: 'Active' | 'On Leave' | 'Invited';
  selected: boolean;
  location: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees = signal<Employee[]>([
    { id: 11, managerId: null, name: 'Kathryn Murphy', nickname: 'Kat', email: 'kathryn.m@example.com', avatar: 'https://i.pravatar.cc/150?u=11', jobTitle: 'CEO', department: 'Leadership', site: 'Headquarters', siteEmoji: '🏢', salary: '$5,000', startDate: '2020-01-15', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
    
    { id: 12, managerId: 11, name: 'Mike Perkins', nickname: 'Mike', email: 'mike.p@example.com', avatar: 'https://i.pravatar.cc/150?u=12', jobTitle: 'Head of Sales', department: 'Sales', site: 'Miami', siteEmoji: '🇺🇸', salary: '$2,800', startDate: '2021-03-20', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
    { id: 13, managerId: 11, name: 'Albert Slater', nickname: 'Al', email: 'albert.s@example.com', avatar: 'https://i.pravatar.cc/150?u=13', jobTitle: 'Head of Design', department: 'Design', site: 'Stockholm', siteEmoji: '🇸🇪', salary: '$3,200', startDate: '2020-11-10', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
    { id: 14, managerId: 11, name: 'Jane Doe', nickname: 'Jane', email: 'jane.d@example.com', avatar: 'https://i.pravatar.cc/150?u=14', jobTitle: 'Head of Marketing', department: 'Marketing', site: 'London', siteEmoji: '🇬🇧', salary: '$3,100', startDate: '2021-02-01', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },

    { id: 15, managerId: 13, name: 'Susan Smith', nickname: 'Sue', email: 'susan.s@example.com', avatar: 'https://i.pravatar.cc/150?u=15', jobTitle: 'UI Team Lead', department: 'Design', site: 'Stockholm', siteEmoji: '🇸🇪', salary: '$2,500', startDate: '2022-04-05', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
    { id: 16, managerId: 13, name: 'Esther Howard', nickname: 'Esther', email: 'esther.h@example.com', avatar: 'https://i.pravatar.cc/150?u=16', jobTitle: 'Brand Team Lead', department: 'Design', site: 'Stockholm', siteEmoji: '🇸🇪', salary: '$2,400', startDate: '2022-06-15', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },

    { id: 17, managerId: 15, name: 'Mark Durden', nickname: 'Mark', email: 'mark.d@example.com', avatar: 'https://i.pravatar.cc/150?u=17', jobTitle: 'Product Designer', department: 'Design', site: 'Stockholm', siteEmoji: '🇸🇪', salary: '$1,800', startDate: '2023-01-20', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
    { id: 18, managerId: 15, name: 'Kirsten Drucker', nickname: 'Kirsten', email: 'kirsten.d@example.com', avatar: 'https://i.pravatar.cc/150?u=18', jobTitle: 'UI Designer', department: 'Design', site: 'Stockholm', siteEmoji: '🇸🇪', salary: '$1,750', startDate: '2023-03-01', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
    { id: 19, managerId: 15, name: 'Chris Blair', nickname: 'Chris', email: 'chris.b@example.com', avatar: 'https://i.pravatar.cc/150?u=19', jobTitle: 'UI Designer', department: 'Design', site: 'Stockholm', siteEmoji: '🇸🇪', salary: '$1,750', startDate: '2023-03-01', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
    { id: 20, managerId: 15, name: 'Hannah Perkins', nickname: 'Hannah', email: 'hannah.p@example.com', avatar: 'https://i.pravatar.cc/150?u=20', jobTitle: 'UX Designer', department: 'Design', site: 'Stockholm', siteEmoji: '🇸🇪', salary: '$1,850', startDate: '2023-02-15', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
    
    // Original list, now re-parented or could be integrated. For now, they are unassigned.
    { id: 1, name: 'Anatoly Belik', managerId: 12, nickname: 'Toly', email: 'anatoly.b@example.com', avatar: 'https://i.pravatar.cc/150?u=1', jobTitle: 'Sales Rep', department: 'Sales', site: 'Stockholm', siteEmoji: '🇸🇪', salary: '$1,350', startDate: '2023-03-13', status: 'Active', selected: false, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
    { id: 2, name: 'Ksenia Bator', managerId: 14, nickname: 'Kseni', email: 'ksenia.b@example.com', avatar: 'https://i.pravatar.cc/150?u=2', jobTitle: 'Marketing Spec.', department: 'Marketing', site: 'Miami', siteEmoji: '🇺🇸', salary: '$1,500', startDate: '2023-10-13', status: 'On Leave', selected: true, location: 'Copenhagen, Denmark', phone: '+45 63 81 04 92' },
  ]);

  getEmployees() {
    return this.employees.asReadonly();
  }

  getEmployee(id: number) {
    return computed(() => this.employees().find(e => e.id === id));
  }

  addEmployee(newEmployeeData: NewEmployee) {
    const newId = Math.max(...this.employees().map(e => e.id)) + 1;
    
    const siteEmojiMap: { [key: string]: string } = {
      'Stockholm': '🇸🇪', 'Miami': '🇺🇸', 'Kyiv': '🇺🇦', 'Ottawa': '🇨🇦', 'Sao Paulo': '🇧🇷', 'London': '🇬🇧',
    };

    const newEmployee: Employee = {
      id: newId, 
      managerId: 11, // Default to CEO
      ...newEmployeeData, 
      salary: `$${newEmployeeData.salary}`,
      avatar: `https://i.pravatar.cc/150?u=${newId}`,
      siteEmoji: siteEmojiMap[newEmployeeData.site] || '🏳️', 
      selected: false,
      location: 'Copenhagen, Denmark', // Placeholder
      phone: '+45 63 81 04 92', // Placeholder
    };

    this.employees.update(currentEmployees => [newEmployee, ...currentEmployees]);
  }

  deleteEmployee(employeeId: number) {
    this.employees.update(current => current.filter(emp => emp.id !== employeeId));
  }
  
  updateManager(employeeId: number, newManagerId: number): void {
    this.employees.update(employees =>
      employees.map(emp =>
        emp.id === employeeId ? { ...emp, managerId: newManagerId } : emp
      )
    );
  }

  changeStatus(employeeId: number, newStatus: Employee['status']) {
    this.employees.update(employees =>
      employees.map(emp =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      )
    );
  }

  toggleSelection(employeeId: number) {
    this.employees.update(employees => 
      employees.map(emp => 
        emp.id === employeeId ? { ...emp, selected: !emp.selected } : emp
      )
    );
  }

  toggleAllSelection(isChecked: boolean) {
    this.employees.update(employees => 
      employees.map(emp => ({ ...emp, selected: isChecked }))
    );
  }
}