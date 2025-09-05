import { Injectable, signal, computed } from '@angular/core';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface EmploymentHistoryEntry {
  jobTitle: string;
  department: string;
  startDate: string; // ISO string
  endDate: string | null; // ISO string or null for current
}

export interface EducationEntry {
  level: string; // e.g., Bachelor's, Master's
  field: string;
  institution: string;
  yearOfGraduation: number;
}

export interface Certificate {
  name: string;
  issuer: string;
  issueDate: string; // ISO string
  expiryDate: string | null; // ISO string or null
}

export interface Employee {
  id: number;
  name: string;
  nickname: string;
  email: string;
  jobTitle: string;
  department: string;
  site: string;
  status: 'Active' | 'On Leave' | 'Invited';
  managerId: number | null;
  startDate: string; // ISO string
  avatar: string;
  selected: boolean;
  
  // New detailed fields from PRD
  phone: string;
  dateOfBirth: string; // ISO string
  currentAddress: string;
  permanentAddress: string;
  citizenId: string;
  taxId: string;
  siteEmoji: string;
  salary: string;
  location: string;
  
  // New structured fields
  emergencyContacts: EmergencyContact[];
  employmentHistory: EmploymentHistoryEntry[];
  educationHistory: EducationEntry[];
  certificates: Certificate[];
}

export type NewEmployee = Omit<Employee, 'id' | 'selected' | 'siteEmoji' | 'salary' | 'location' | 'emergencyContacts' | 'employmentHistory' | 'educationHistory' | 'certificates' | 'phone' | 'currentAddress' | 'permanentAddress'> & {
  citizenId?: string;
  taxId?: string;
  dateOfBirth?: string;
};


// Lora Piterson from profile card
const MOCK_EMPLOYEES: Employee[] = [
  { 
    id: 1, name: 'Lora Piterson', nickname: 'Lora', email: 'lora.piterson@example.com', jobTitle: 'CEO', department: 'Executive', site: 'HQ', status: 'Active', managerId: null, startDate: '2020-01-15T09:00:00Z', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', selected: false,
    phone: '+45 63 81 04 92', dateOfBirth: '1985-05-20', currentAddress: '123 Main St, Anytown, USA 12345', permanentAddress: '123 Main St, Anytown, USA 12345', citizenId: '123-456-7890', taxId: '987-654-3210', siteEmoji: '🏢', salary: '$120,000', location: 'Copenhagen, Denmark',
    emergencyContacts: [{ name: 'John Piterson', relationship: 'Spouse', phone: '111-222-3333' }],
    employmentHistory: [{ jobTitle: 'CEO', department: 'Executive', startDate: '2020-01-15T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Master of Business Administration', field: 'Business', institution: 'Copenhagen Business School', yearOfGraduation: 2010 }],
    certificates: [{ name: 'Certified Professional in Human Resources (PHR)', issuer: 'HRCI', issueDate: '2015-06-01', expiryDate: '2025-06-01' }]
  },
  { 
    id: 2, name: 'John Doe', nickname: 'John', email: 'john.doe@example.com', jobTitle: 'CTO', department: 'Engineering', site: 'HQ', status: 'Active', managerId: 1, startDate: '2020-02-01T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=john.doe@example.com', selected: false,
    phone: '+1 555-0101', dateOfBirth: '1988-11-10', currentAddress: '456 Oak Ave, Anytown, USA 12345', permanentAddress: '456 Oak Ave, Anytown, USA 12345', citizenId: '234-567-8901', taxId: '876-543-2109', siteEmoji: '🏢', salary: '$110,000', location: 'New York, USA',
    emergencyContacts: [{ name: 'Jane Doe', relationship: 'Spouse', phone: '444-555-6666' }],
    employmentHistory: [{ jobTitle: 'CTO', department: 'Engineering', startDate: '2020-02-01T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Master of Science', field: 'Computer Science', institution: 'Stanford University', yearOfGraduation: 2012 }],
    certificates: [{ name: 'AWS Certified Solutions Architect – Professional', issuer: 'Amazon Web Services', issueDate: '2019-03-15', expiryDate: '2025-03-15' }]
  },
  { 
    id: 3, name: 'Jane Smith', nickname: 'Jane', email: 'jane.smith@example.com', jobTitle: 'CFO', department: 'Finance', site: 'HQ', status: 'Active', managerId: 1, startDate: '2020-03-10T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=jane.smith@example.com', selected: false,
    phone: '+1 555-0102', dateOfBirth: '1990-01-25', currentAddress: '789 Pine St, Anytown, USA 12345', permanentAddress: '789 Pine St, Anytown, USA 12345', citizenId: '345-678-9012', taxId: '765-432-1098', siteEmoji: '🏢', salary: '$105,000', location: 'London, UK',
    emergencyContacts: [{ name: 'Jim Smith', relationship: 'Brother', phone: '777-888-9999' }],
    employmentHistory: [{ jobTitle: 'CFO', department: 'Finance', startDate: '2020-03-10T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Commerce', field: 'Accounting', institution: 'London School of Economics', yearOfGraduation: 2011 }],
    certificates: [{ name: 'Certified Public Accountant (CPA)', issuer: 'AICPA', issueDate: '2013-08-20', expiryDate: null }]
  },
  { 
    id: 4, name: 'Peter Jones', nickname: 'Peter', email: 'peter.jones@example.com', jobTitle: 'Lead Engineer', department: 'Engineering', site: 'Remote', status: 'Active', managerId: 2, startDate: '2021-05-20T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=peter.jones@example.com', selected: false,
    phone: '+1 555-0103', dateOfBirth: '1992-07-30', currentAddress: '101 Maple Dr, Anytown, USA 12345', permanentAddress: '101 Maple Dr, Anytown, USA 12345', citizenId: '456-789-0123', taxId: '654-321-0987', siteEmoji: '🏠', salary: '$95,000', location: 'Berlin, Germany',
    emergencyContacts: [{ name: 'Susan Jones', relationship: 'Mother', phone: '123-123-1234' }],
    employmentHistory: [{ jobTitle: 'Lead Engineer', department: 'Engineering', startDate: '2021-05-20T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Engineering', field: 'Software Engineering', institution: 'University of Waterloo', yearOfGraduation: 2014 }],
    certificates: []
  },
  { 
    id: 5, name: 'Mary Johnson', nickname: 'Mary', email: 'mary.johnson@example.com', jobTitle: 'Senior Engineer', department: 'Engineering', site: 'HQ', status: 'On Leave', managerId: 2, startDate: '2021-06-15T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=mary.johnson@example.com', selected: false,
    phone: '+1 555-0104', dateOfBirth: '1993-02-14', currentAddress: '212 Birch Rd, Anytown, USA 12345', permanentAddress: '212 Birch Rd, Anytown, USA 12345', citizenId: '567-890-1234', taxId: '543-210-9876', siteEmoji: '🏢', salary: '$85,000', location: 'Tokyo, Japan',
    emergencyContacts: [{ name: 'Robert Johnson', relationship: 'Father', phone: '234-234-2345' }],
    employmentHistory: [{ jobTitle: 'Senior Engineer', department: 'Engineering', startDate: '2021-06-15T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Computer Engineering', institution: 'University of Tokyo', yearOfGraduation: 2015 }],
    certificates: []
  },
  { 
    id: 6, name: 'Chris Lee', nickname: 'Chris', email: 'chris.lee@example.com', jobTitle: 'Accountant', department: 'Finance', site: 'HQ', status: 'Active', managerId: 3, startDate: '2022-01-10T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=chris.lee@example.com', selected: false,
    phone: '+1 555-0105', dateOfBirth: '1995-09-05', currentAddress: '333 Cedar Ln, Anytown, USA 12345', permanentAddress: '333 Cedar Ln, Anytown, USA 12345', citizenId: '678-901-2345', taxId: '432-109-8765', siteEmoji: '🏢', salary: '$75,000', location: 'Sydney, Australia',
    emergencyContacts: [{ name: 'Michelle Lee', relationship: 'Sister', phone: '345-345-3456' }],
    employmentHistory: [{ jobTitle: 'Accountant', department: 'Finance', startDate: '2022-01-10T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Business', field: 'Finance', institution: 'University of Sydney', yearOfGraduation: 2017 }],
    certificates: []
  },
  { 
    id: 7, name: 'Patricia Brown', nickname: 'Pat', email: 'patricia.brown@example.com', jobTitle: 'Junior Accountant', department: 'Finance', site: 'Remote', status: 'Invited', managerId: 3, startDate: '2023-08-01T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=patricia.brown@example.com', selected: false,
    phone: '+1 555-0106', dateOfBirth: '1998-03-12', currentAddress: '444 Spruce Way, Anytown, USA 12345', permanentAddress: '444 Spruce Way, Anytown, USA 12345', citizenId: '789-012-3456', taxId: '321-098-7654', siteEmoji: '🏠', salary: '$60,000', location: 'Toronto, Canada',
    emergencyContacts: [{ name: 'David Brown', relationship: 'Father', phone: '456-456-4567' }],
    employmentHistory: [{ jobTitle: 'Junior Accountant', department: 'Finance', startDate: '2023-08-01T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Diploma', field: 'Accounting', institution: 'Toronto School of Business', yearOfGraduation: 2020 }],
    certificates: []
  },
  { 
    id: 8, name: 'Michael Williams', nickname: 'Mike', email: 'michael.williams@example.com', jobTitle: 'Frontend Developer', department: 'Engineering', site: 'HQ', status: 'Active', managerId: 4, startDate: '2022-09-01T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=michael.williams@example.com', selected: false,
    phone: '+1 555-0107', dateOfBirth: '1996-12-24', currentAddress: '555 Redwood Blvd, Anytown, USA 12345', permanentAddress: '555 Redwood Blvd, Anytown, USA 12345', citizenId: '890-123-4567', taxId: '210-987-6543', siteEmoji: '🏢', salary: '$80,000', location: 'San Francisco, USA',
    emergencyContacts: [{ name: 'Laura Williams', relationship: 'Wife', phone: '567-567-5678' }],
    employmentHistory: [{ jobTitle: 'Frontend Developer', department: 'Engineering', startDate: '2022-09-01T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Arts', field: 'Web Design and Development', institution: 'Academy of Art University', yearOfGraduation: 2018 }],
    certificates: [{ name: 'Certified JavaScript Developer', issuer: 'W3Schools', issueDate: '2021-01-15', expiryDate: null }]
  },
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

  toggleSelection(employeeId: number): void {
    this.employees.update(employees =>
      employees.map(emp =>
        emp.id === employeeId ? { ...emp, selected: !emp.selected } : emp
      )
    );
  }

  toggleAllSelection(isChecked: boolean): void {
    this.employees.update(employees =>
      employees.map(emp => ({ ...emp, selected: isChecked }))
    );
  }

  addEmployee(newEmployeeData: NewEmployee): void {
    this.employees.update(employees => {
        const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
        const newEmployee: Employee = {
            ...newEmployeeData,
            id: newId,
            selected: false,
            phone: '',
            dateOfBirth: newEmployeeData.dateOfBirth || '',
            currentAddress: '',
            permanentAddress: '',
            citizenId: newEmployeeData.citizenId || '',
            taxId: newEmployeeData.taxId || '',
            siteEmoji: '🏢',
            salary: '$50,000', // Default salary
            location: 'To be determined',
            emergencyContacts: [],
            employmentHistory: [{
              jobTitle: newEmployeeData.jobTitle,
              department: newEmployeeData.department,
              startDate: newEmployeeData.startDate,
              endDate: null
            }],
            educationHistory: [],
            certificates: [],
        };
        return [newEmployee, ...employees];
    });
  }
  
  updateEmployee(updatedEmployee: Employee): void {
    this.employees.update(employees =>
      employees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
  }

  deleteEmployee(employeeId: number): void {
    this.employees.update(employees => employees.filter(emp => emp.id !== employeeId));
  }

  changeStatus(employeeId: number, newStatus: Employee['status']): void {
    this.employees.update(employees =>
      employees.map(emp =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      )
    );
  }

  updateManager(employeeId: number, newManagerId: number): void {
    this.employees.update(employees =>
      employees.map(emp =>
        emp.id === employeeId ? { ...emp, managerId: newManagerId } : emp
      )
    );
  }
}
