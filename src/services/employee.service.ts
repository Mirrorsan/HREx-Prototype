import { Injectable, signal, computed } from '@angular/core';

// This should ideally be in a shared types file, but for now, it's defined here.
export interface NewEmployee {
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  site: string;
  managerId: number | null;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Employee {
  id: number;
  name: string;
  nickname: string;
  email: string;
  jobTitle: string;
  department: string;
  site: string;
  siteEmoji: string;
  status: 'Active' | 'On Leave' | 'Invited';
  managerId: number | null;
  avatar: string;
  startDate: string;
  selected: boolean;
  salary: string;
  
  // New detailed fields from PRD
  citizenId: string;
  taxId: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
  emergencyContacts: EmergencyContact[];
}

const MOCK_EMPLOYEES: Employee[] = [
  { 
    id: 1, name: 'Kathryn Murphy', nickname: 'Kat', email: 'kathryn.murphy@hrex.io', 
    jobTitle: 'Chief Executive Officer', department: 'Executive', site: 'Headquarters', siteEmoji: '🏢', 
    status: 'Active', managerId: null, avatar: 'https://picsum.photos/id/40/200/200', 
    startDate: '2019-03-15', selected: false, salary: '$350,000',
    citizenId: '1-1020-30405-67-8', taxId: '9876543210', phone: '+1-202-555-0191', 
    location: 'New York, USA', dateOfBirth: '1980-05-20',
    currentAddress: '123 Tech Ave, New York, NY 10001', permanentAddress: '123 Tech Ave, New York, NY 10001',
    emergencyContacts: [{ name: 'Robert Murphy', relationship: 'Spouse', phone: '+1-202-555-0192' }]
  },
  { 
    id: 12, name: 'David Chen', nickname: 'Dave', email: 'david.chen@hrex.io', 
    jobTitle: 'Chief Technology Officer', department: 'Executive', site: 'Headquarters', siteEmoji: '🏢', 
    status: 'Active', managerId: 1, avatar: 'https://picsum.photos/id/60/200/200', 
    startDate: '2019-08-01', selected: false, salary: '$275,000',
    citizenId: '3-2109-87654-32-1', taxId: '1234509876', phone: '+1-202-555-0193', 
    location: 'New York, USA', dateOfBirth: '1982-03-15',
    currentAddress: '456 Innovation Dr, New York, NY 10001', permanentAddress: '456 Innovation Dr, New York, NY 10001',
    emergencyContacts: [{ name: 'Linda Chen', relationship: 'Spouse', phone: '+1-202-555-0194' }]
  },
  { 
    id: 2, name: 'Mike Perkins', nickname: 'Mike', email: 'mike.perkins@hrex.io', 
    jobTitle: 'Head of Engineering', department: 'Engineering', site: 'Headquarters', siteEmoji: '🏢', 
    status: 'Active', managerId: 12, avatar: 'https://picsum.photos/id/41/200/200', 
    startDate: '2020-01-20', selected: false, salary: '$180,000',
    citizenId: '2-2030-40506-78-9', taxId: '8765432109', phone: '+1-202-555-0181', 
    location: 'New York, USA', dateOfBirth: '1985-11-10',
    currentAddress: '456 Code Ln, New York, NY 10001', permanentAddress: '456 Code Ln, New York, NY 10001',
    emergencyContacts: [{ name: 'Sarah Perkins', relationship: 'Spouse', phone: '+1-202-555-0182' }]
  },
  { 
    id: 3, name: 'Albert Slater', nickname: 'Al', email: 'albert.slater@hrex.io', 
    jobTitle: 'Head of Product', department: 'Product', site: 'Headquarters', siteEmoji: '🏢', 
    status: 'Active', managerId: 1, avatar: 'https://picsum.photos/id/42/200/200', 
    startDate: '2020-02-10', selected: false, salary: '$175,000',
    citizenId: '3-3040-50607-89-0', taxId: '7654321098', phone: '+1-202-555-0171', 
    location: 'Remote', dateOfBirth: '1988-01-30',
    currentAddress: '789 Feature Rd, Austin, TX 78701', permanentAddress: '789 Feature Rd, Austin, TX 78701',
    emergencyContacts: [{ name: 'Jessica Slater', relationship: 'Spouse', phone: '+1-202-555-0172' }]
  },
  { 
    id: 4, name: 'Jane Doe', nickname: 'Jane', email: 'jane.doe@hrex.io', 
    jobTitle: 'Head of Design', department: 'Design', site: 'Headquarters', siteEmoji: '🏢', 
    status: 'Active', managerId: 1, avatar: 'https://picsum.photos/id/43/200/200', 
    startDate: '2020-06-01', selected: false, salary: '$170,000',
    citizenId: '4-4050-60708-90-1', taxId: '6543210987', phone: '+1-202-555-0161', 
    location: 'San Francisco, USA', dateOfBirth: '1990-09-05',
    currentAddress: '101 Pixel St, San Francisco, CA 94103', permanentAddress: '101 Pixel St, San Francisco, CA 94103',
    emergencyContacts: [{ name: 'John Doe', relationship: 'Spouse', phone: '+1-202-555-0162' }]
  },
  { 
    id: 5, name: 'Anatoly Belik', nickname: 'Toly', email: 'anatoly.belik@hrex.io', 
    jobTitle: 'Platform Engineering Lead', department: 'Engineering', site: 'Remote', siteEmoji: '🏠', 
    status: 'Active', managerId: 2, avatar: 'https://picsum.photos/id/44/200/200', 
    startDate: '2021-03-22', selected: false, salary: '$150,000',
    citizenId: '5-5060-70809-01-2', taxId: '5432109876', phone: '+1-202-555-0151', 
    location: 'Berlin, Germany', dateOfBirth: '1992-02-14',
    currentAddress: '22 DevOps Way, Berlin, Germany', permanentAddress: '22 DevOps Way, Berlin, Germany',
    emergencyContacts: [{ name: 'Olga Belik', relationship: 'Mother', phone: '+49-30-555-0152' }]
  },
  { 
    id: 6, name: 'Susan Smith', nickname: 'Sue', email: 'susan.smith@hrex.io', 
    jobTitle: 'Product Manager', department: 'Product', site: 'Headquarters', siteEmoji: '🏢', 
    status: 'Active', managerId: 3, avatar: 'https://picsum.photos/id/45/200/200', 
    startDate: '2021-08-16', selected: false, salary: '$140,000',
    citizenId: '6-6070-80901-12-3', taxId: '4321098765', phone: '+1-202-555-0141', 
    location: 'New York, USA', dateOfBirth: '1993-07-25',
    currentAddress: '33 Roadmap Blvd, New York, NY 10001', permanentAddress: '33 Roadmap Blvd, New York, NY 10001',
    emergencyContacts: [{ name: 'David Smith', relationship: 'Brother', phone: '+1-202-555-0142' }]
  },
  { 
    id: 7, name: 'Mark Durden', nickname: 'Mark', email: 'mark.durden@hrex.io', 
    jobTitle: 'Senior Software Engineer', department: 'Engineering', site: 'Remote', siteEmoji: '🏠', 
    status: 'On Leave', managerId: 5, avatar: 'https://picsum.photos/id/46/200/200', 
    startDate: '2022-01-10', selected: false, salary: '$130,000',
    citizenId: '7-7080-90102-23-4', taxId: '3210987654', phone: '+1-202-555-0131', 
    location: 'London, UK', dateOfBirth: '1991-04-01',
    currentAddress: '44 Commit Crescent, London, UK', permanentAddress: '44 Commit Crescent, London, UK',
    emergencyContacts: [{ name: 'Emily Durden', relationship: 'Spouse', phone: '+44-20-7946-0132' }]
  },
  { 
    id: 8, name: 'Kirsten Drucker', nickname: 'Kirsten', email: 'kirsten.drucker@hrex.io', 
    jobTitle: 'DevOps Engineer', department: 'Engineering', site: 'Remote', siteEmoji: '🏠', 
    status: 'Active', managerId: 5, avatar: 'https://picsum.photos/id/47/200/200', 
    startDate: '2022-05-30', selected: false, salary: '$125,000',
    citizenId: '8-8090-10203-34-5', taxId: '2109876543', phone: '+1-202-555-0121', 
    location: 'Austin, USA', dateOfBirth: '1994-03-12',
    currentAddress: '55 Pipeline Pl, Austin, TX 78701', permanentAddress: '55 Pipeline Pl, Austin, TX 78701',
    emergencyContacts: [{ name: 'Henry Drucker', relationship: 'Father', phone: '+1-202-555-0122' }]
  },
  {
    id: 9, name: 'Chris Blair', nickname: 'Chris', email: 'chris.blair@hrex.io', 
    jobTitle: 'Senior UI/UX Designer', department: 'Design', site: 'Headquarters', siteEmoji: '🏢', 
    status: 'Active', managerId: 4, avatar: 'https://picsum.photos/id/48/200/200', 
    startDate: '2021-09-01', selected: false, salary: '$135,000',
    citizenId: '9-9010-20304-45-6', taxId: '1098765432', phone: '+1-202-555-0111', 
    location: 'San Francisco, USA', dateOfBirth: '1989-08-15',
    currentAddress: '66 Component Ct, San Francisco, CA 94103', permanentAddress: '66 Component Ct, San Francisco, CA 94103',
    emergencyContacts: [{ name: 'Maria Blair', relationship: 'Spouse', phone: '+1-202-555-0112' }]
  },
  {
    id: 10, name: 'Hannah Perkins', nickname: 'Hannah', email: 'hannah.perkins@hrex.io', 
    jobTitle: 'UX Designer', department: 'Design', site: 'Remote', siteEmoji: '🏠', 
    status: 'Active', managerId: 4, avatar: 'https://picsum.photos/id/49/200/200', 
    startDate: '2022-08-01', selected: false, salary: '$105,000',
    citizenId: '1-0011-22334-56-7', taxId: '0987654321', phone: '+1-202-555-0101', 
    location: 'Portland, USA', dateOfBirth: '1995-06-22',
    currentAddress: '77 User Flow Ave, Portland, OR 97204', permanentAddress: '77 User Flow Ave, Portland, OR 97204',
    emergencyContacts: [{ name: 'Michael Perkins', relationship: 'Father', phone: '+1-202-555-0102' }]
  },
   { 
    id: 11, name: 'Ksenia Bator', nickname: 'Ksenia', email: 'ksenia.bator@hrex.io', 
    jobTitle: 'Marketing Specialist', department: 'Marketing', site: 'Remote', siteEmoji: '🏠', 
    status: 'Invited', managerId: 3, avatar: 'https://picsum.photos/id/50/200/200', 
    startDate: '2023-01-15', selected: false, salary: '$95,000',
    citizenId: '2-1122-33445-67-8', taxId: '9876543210-A', phone: '+1-202-555-0201', 
    location: 'Miami, USA', dateOfBirth: '1996-10-18',
    currentAddress: '88 Campaign Rd, Miami, FL 33131', permanentAddress: '88 Campaign Rd, Miami, FL 33131',
    emergencyContacts: [{ name: 'Ivan Bator', relationship: 'Father', phone: '+1-202-555-0202' }]
  },
  {
    id: 13, name: 'Olivia Garcia', nickname: 'Liv', email: 'olivia.garcia@hrex.io',
    jobTitle: 'Project Manager', department: 'Product', site: 'Remote', siteEmoji: '🏠',
    status: 'Active', managerId: 3, avatar: 'https://picsum.photos/id/51/200/200',
    startDate: '2022-11-20', selected: false, salary: '$115,000',
    citizenId: '4-3210-98765-43-2', taxId: '1122334455', phone: '+1-202-555-0211',
    location: 'Chicago, USA', dateOfBirth: '1993-01-10',
    currentAddress: '99 Gantt Chart Ln, Chicago, IL 60601', permanentAddress: '99 Gantt Chart Ln, Chicago, IL 60601',
    emergencyContacts: [{ name: 'Carlos Garcia', relationship: 'Husband', phone: '+1-202-555-0212' }]
  }
];

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees = signal<Employee[]>(MOCK_EMPLOYEES);

  getEmployees() {
    return this.employees.asReadonly();
  }
  
  getEmployee(id: number) {
    return computed(() => this.employees().find(e => e.id === id));
  }

  addEmployee(newEmployeeData: NewEmployee): void {
    const newId = Math.max(...this.employees().map(e => e.id)) + 1;
    const newEmployee: Employee = {
      ...newEmployeeData,
      id: newId,
      nickname: newEmployeeData.name.split(' ')[0], // Simple default
      siteEmoji: newEmployeeData.site === 'Remote' ? '🏠' : '🏢',
      status: 'Invited',
      avatar: `https://picsum.photos/id/${newId + 50}/200/200`, // a little offset for variety
      startDate: new Date().toISOString().split('T')[0],
      selected: false,
      salary: '$90,000', // Default salary for new hires
      citizenId: 'N/A',
      taxId: 'N/A',
      phone: 'N/A',
      location: 'N/A',
      dateOfBirth: 'N/A',
      currentAddress: 'N/A',
      permanentAddress: 'N/A',
      emergencyContacts: []
    };
    this.employees.update(currentEmployees => [newEmployee, ...currentEmployees]);
  }

  deleteEmployee(employeeId: number): void {
    this.employees.update(current => current.filter(e => e.id !== employeeId));
  }
  
  changeStatus(employeeId: number, newStatus: Employee['status']): void {
    this.employees.update(current => 
      current.map(e => e.id === employeeId ? { ...e, status: newStatus } : e)
    );
  }
  
  updateManager(employeeId: number, newManagerId: number): void {
    this.employees.update(current => 
      current.map(e => e.id === employeeId ? { ...e, managerId: newManagerId } : e)
    );
  }

  toggleSelection(employeeId: number): void {
    this.employees.update(current => 
      current.map(e => e.id === employeeId ? { ...e, selected: !e.selected } : e)
    );
  }

  toggleAllSelection(isChecked: boolean): void {
    this.employees.update(current => current.map(e => ({ ...e, selected: isChecked })));
  }
}