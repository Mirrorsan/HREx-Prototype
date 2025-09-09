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
    phone: '+45 63 81 04 92', dateOfBirth: '1985-05-20', currentAddress: '123 Main St, Anytown, USA 12345', permanentAddress: '123 Main St, Anytown, USA 12345', citizenId: '123-456-7890', taxId: '987-654-3210', siteEmoji: '🏢', salary: '$250,000', location: 'Copenhagen, Denmark',
    emergencyContacts: [{ name: 'John Piterson', relationship: 'Spouse', phone: '111-222-3333' }],
    employmentHistory: [{ jobTitle: 'CEO', department: 'Executive', startDate: '2020-01-15T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Master of Business Administration', field: 'Business', institution: 'Copenhagen Business School', yearOfGraduation: 2010 }],
    certificates: [{ name: 'Certified Professional in Human Resources (PHR)', issuer: 'HRCI', issueDate: '2015-06-01', expiryDate: '2025-06-01' }]
  },
  { 
    id: 2, name: 'John Doe', nickname: 'John', email: 'john.doe@example.com', jobTitle: 'CTO', department: 'Engineering', site: 'HQ', status: 'Active', managerId: 1, startDate: '2020-02-01T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=john.doe@example.com', selected: false,
    phone: '+1 555-0101', dateOfBirth: '1988-11-10', currentAddress: '456 Oak Ave, Anytown, USA 12345', permanentAddress: '456 Oak Ave, Anytown, USA 12345', citizenId: '234-567-8901', taxId: '876-543-2109', siteEmoji: '🏢', salary: '$180,000', location: 'New York, USA',
    emergencyContacts: [{ name: 'Jane Doe', relationship: 'Spouse', phone: '444-555-6666' }],
    employmentHistory: [{ jobTitle: 'CTO', department: 'Engineering', startDate: '2020-02-01T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Master of Science', field: 'Computer Science', institution: 'Stanford University', yearOfGraduation: 2012 }],
    certificates: [{ name: 'AWS Certified Solutions Architect – Professional', issuer: 'Amazon Web Services', issueDate: '2019-03-15', expiryDate: '2025-03-15' }]
  },
  { 
    id: 3, name: 'Jane Smith', nickname: 'Jane', email: 'jane.smith@example.com', jobTitle: 'VP of Finance', department: 'Finance', site: 'HQ', status: 'Active', managerId: 1, startDate: '2020-03-10T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=jane.smith@example.com', selected: false,
    phone: '+1 555-0102', dateOfBirth: '1990-01-25', currentAddress: '789 Pine St, Anytown, USA 12345', permanentAddress: '789 Pine St, Anytown, USA 12345', citizenId: '345-678-9012', taxId: '765-432-1098', siteEmoji: '🏢', salary: '$175,000', location: 'London, UK',
    emergencyContacts: [{ name: 'Jim Smith', relationship: 'Brother', phone: '777-888-9999' }],
    employmentHistory: [{ jobTitle: 'VP of Finance', department: 'Finance', startDate: '2020-03-10T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Commerce', field: 'Accounting', institution: 'London School of Economics', yearOfGraduation: 2011 }],
    certificates: [{ name: 'Certified Public Accountant (CPA)', issuer: 'AICPA', issueDate: '2013-08-20', expiryDate: null }]
  },
  { 
    id: 4, name: 'Peter Jones', nickname: 'Peter', email: 'peter.jones@example.com', jobTitle: 'Frontend Lead', department: 'Frontend', site: 'Remote', status: 'Active', managerId: 2, startDate: '2021-05-20T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=peter.jones@example.com', selected: false,
    phone: '+1 555-0103', dateOfBirth: '1992-07-30', currentAddress: '101 Maple Dr, Anytown, USA 12345', permanentAddress: '101 Maple Dr, Anytown, USA 12345', citizenId: '456-789-0123', taxId: '654-321-0987', siteEmoji: '🏠', salary: '$125,000', location: 'Berlin, Germany',
    emergencyContacts: [{ name: 'Susan Jones', relationship: 'Mother', phone: '123-123-1234' }],
    employmentHistory: [{ jobTitle: 'Lead Engineer', department: 'Engineering', startDate: '2021-05-20T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Engineering', field: 'Software Engineering', institution: 'University of Waterloo', yearOfGraduation: 2014 }],
    certificates: []
  },
  { 
    id: 5, name: 'Mary Johnson', nickname: 'Mary', email: 'mary.johnson@example.com', jobTitle: 'Backend Lead', department: 'Backend', site: 'HQ', status: 'On Leave', managerId: 2, startDate: '2021-06-15T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=mary.johnson@example.com', selected: false,
    phone: '+1 555-0104', dateOfBirth: '1993-02-14', currentAddress: '212 Birch Rd, Anytown, USA 12345', permanentAddress: '212 Birch Rd, Anytown, USA 12345', citizenId: '567-890-1234', taxId: '543-210-9876', siteEmoji: '🏢', salary: '$110,000', location: 'Tokyo, Japan',
    emergencyContacts: [{ name: 'Robert Johnson', relationship: 'Father', phone: '234-234-2345' }],
    employmentHistory: [{ jobTitle: 'Senior Engineer', department: 'Engineering', startDate: '2021-06-15T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Computer Engineering', institution: 'University of Tokyo', yearOfGraduation: 2015 }],
    certificates: []
  },
  { 
    id: 6, name: 'Chris Lee', nickname: 'Chris', email: 'chris.lee@example.com', jobTitle: 'Senior Financial Analyst', department: 'Finance', site: 'HQ', status: 'Active', managerId: 3, startDate: '2022-01-10T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=chris.lee@example.com', selected: false,
    phone: '+1 555-0105', dateOfBirth: '1995-09-05', currentAddress: '333 Cedar Ln, Anytown, USA 12345', permanentAddress: '333 Cedar Ln, Anytown, USA 12345', citizenId: '678-901-2345', taxId: '432-109-8765', siteEmoji: '🏢', salary: '$95,000', location: 'Sydney, Australia',
    emergencyContacts: [{ name: 'Michelle Lee', relationship: 'Sister', phone: '345-345-3456' }],
    employmentHistory: [{ jobTitle: 'Senior Financial Analyst', department: 'Finance', startDate: '2022-01-10T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Business', field: 'Finance', institution: 'University of Sydney', yearOfGraduation: 2017 }],
    certificates: []
  },
  { 
    id: 7, name: 'Patricia Brown', nickname: 'Pat', email: 'patricia.brown@example.com', jobTitle: 'Financial Analyst', department: 'Finance', site: 'Remote', status: 'Invited', managerId: 3, startDate: '2023-08-01T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=patricia.brown@example.com', selected: false,
    phone: '+1 555-0106', dateOfBirth: '1998-03-12', currentAddress: '444 Spruce Way, Anytown, USA 12345', permanentAddress: '444 Spruce Way, Anytown, USA 12345', citizenId: '789-012-3456', taxId: '321-098-7654', siteEmoji: '🏠', salary: '$70,000', location: 'Toronto, Canada',
    emergencyContacts: [{ name: 'David Brown', relationship: 'Father', phone: '456-456-4567' }],
    employmentHistory: [{ jobTitle: 'Financial Analyst', department: 'Finance', startDate: '2023-08-01T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Diploma', field: 'Accounting', institution: 'Toronto School of Business', yearOfGraduation: 2020 }],
    certificates: []
  },
  { 
    id: 8, name: 'Michael Williams', nickname: 'Mike', email: 'michael.williams@example.com', jobTitle: 'Frontend Developer', department: 'Frontend', site: 'HQ', status: 'Active', managerId: 4, startDate: '2022-09-01T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=michael.williams@example.com', selected: false,
    phone: '+1 555-0107', dateOfBirth: '1996-12-24', currentAddress: '555 Redwood Blvd, Anytown, USA 12345', permanentAddress: '555 Redwood Blvd, Anytown, USA 12345', citizenId: '890-123-4567', taxId: '210-987-6543', siteEmoji: '🏢', salary: '$98,000', location: 'San Francisco, USA',
    emergencyContacts: [{ name: 'Laura Williams', relationship: 'Wife', phone: '567-567-5678' }],
    employmentHistory: [{ jobTitle: 'Frontend Developer', department: 'Engineering', startDate: '2022-09-01T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Arts', field: 'Web Design and Development', institution: 'Academy of Art University', yearOfGraduation: 2018 }],
    certificates: [{ name: 'Certified JavaScript Developer', issuer: 'W3Schools', issueDate: '2021-01-15', expiryDate: null }]
  },
  { 
    id: 9, name: 'David Chen', nickname: 'Dave', email: 'david.chen@example.com', jobTitle: 'Chief Product Officer', department: 'Product', site: 'HQ', status: 'Active', managerId: 1, startDate: '2020-04-01T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=david.chen@example.com', selected: false,
    phone: '+1 555-0108', dateOfBirth: '1982-08-15', currentAddress: '654 Pine St, Anytown, USA 12345', permanentAddress: '654 Pine St, Anytown, USA 12345', citizenId: '901-234-5678', taxId: '109-876-5432', siteEmoji: '🏢', salary: '$185,000', location: 'Austin, USA',
    emergencyContacts: [{ name: 'Emily Chen', relationship: 'Wife', phone: '678-678-6789' }],
    employmentHistory: [{ jobTitle: 'Chief Product Officer', department: 'Product', startDate: '2020-04-01T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Master of Science', field: 'Human-Computer Interaction', institution: 'Carnegie Mellon University', yearOfGraduation: 2008 }],
    certificates: []
  },
  { 
    id: 10, name: 'Sarah Miller', nickname: 'Sarah', email: 'sarah.miller@example.com', jobTitle: 'VP of Marketing', department: 'Marketing', site: 'HQ', status: 'Active', managerId: 1, startDate: '2020-05-11T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=sarah.miller@example.com', selected: false,
    phone: '+1 555-0109', dateOfBirth: '1986-06-22', currentAddress: '111 Elm St, Anytown, USA 12345', permanentAddress: '111 Elm St, Anytown, USA 12345', citizenId: '123-321-4567', taxId: '987-789-6543', siteEmoji: '🏢', salary: '$160,000', location: 'Chicago, USA',
    emergencyContacts: [{ name: 'Tom Miller', relationship: 'Husband', phone: '789-789-7890' }],
    employmentHistory: [{ jobTitle: 'VP of Marketing', department: 'Marketing', startDate: '2020-05-11T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Arts', field: 'Marketing', institution: 'University of Illinois', yearOfGraduation: 2009 }],
    certificates: []
  },
  {
    id: 11, name: 'Robert Garcia', nickname: 'Rob', email: 'robert.garcia@example.com', jobTitle: 'VP of Sales', department: 'Sales', site: 'Remote', status: 'Active', managerId: 1, startDate: '2020-06-01T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=robert.garcia@example.com', selected: false,
    phone: '+1 555-0110', dateOfBirth: '1984-03-18', currentAddress: '222 Oak Dr, Anytown, USA 12345', permanentAddress: '222 Oak Dr, Anytown, USA 12345', citizenId: '456-654-7890', taxId: '321-123-9876', siteEmoji: '🏠', salary: '$165,000', location: 'Miami, USA',
    emergencyContacts: [{ name: 'Maria Garcia', relationship: 'Wife', phone: '890-890-8901' }],
    employmentHistory: [{ jobTitle: 'VP of Sales', department: 'Sales', startDate: '2020-06-01T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Business Administration', institution: 'University of Florida', yearOfGraduation: 2007 }],
    certificates: []
  },
  {
    id: 12, name: 'Linda Martinez', nickname: 'Linda', email: 'linda.martinez@example.com', jobTitle: 'HR Director', department: 'HR', site: 'HQ', status: 'Active', managerId: 1, startDate: '2020-07-15T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=linda.martinez@example.com', selected: false,
    phone: '+1 555-0111', dateOfBirth: '1989-09-01', currentAddress: '333 Maple Ave, Anytown, USA 12345', permanentAddress: '333 Maple Ave, Anytown, USA 12345', citizenId: '789-987-6543', taxId: '654-456-3210', siteEmoji: '🏢', salary: '$140,000', location: 'Los Angeles, USA',
    emergencyContacts: [{ name: 'Carlos Martinez', relationship: 'Husband', phone: '901-901-9012' }],
    employmentHistory: [{ jobTitle: 'HR Director', department: 'HR', startDate: '2020-07-15T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Master of Science', field: 'Human Resource Management', institution: 'University of Southern California', yearOfGraduation: 2013 }],
    certificates: []
  },
  {
    id: 13, name: 'Kevin White', nickname: 'Kev', email: 'kevin.white@example.com', jobTitle: 'Backend Developer', department: 'Backend', site: 'Remote', status: 'Active', managerId: 5, startDate: '2022-10-03T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=kevin.white@example.com', selected: false,
    phone: '+1 555-0112', dateOfBirth: '1995-04-12', currentAddress: '444 Pine Ln, Anytown, USA 12345', permanentAddress: '444 Pine Ln, Anytown, USA 12345', citizenId: '147-258-3690', taxId: '369-258-1470', siteEmoji: '🏠', salary: '$95,000', location: 'Portland, USA',
    emergencyContacts: [{ name: 'Susan White', relationship: 'Mother', phone: '123-456-7890' }],
    employmentHistory: [{ jobTitle: 'Backend Developer', department: 'Engineering', startDate: '2022-10-03T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Computer Science', institution: 'Oregon State University', yearOfGraduation: 2017 }],
    certificates: []
  },
  {
    id: 14, name: 'Emily Harris', nickname: 'Em', email: 'emily.harris@example.com', jobTitle: 'DevOps Lead', department: 'DevOps', site: 'HQ', status: 'Active', managerId: 2, startDate: '2021-11-15T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=emily.harris@example.com', selected: false,
    phone: '+1 555-0113', dateOfBirth: '1991-08-25', currentAddress: '555 Birch Rd, Anytown, USA 12345', permanentAddress: '555 Birch Rd, Anytown, USA 12345', citizenId: '963-852-7410', taxId: '741-852-9630', siteEmoji: '🏢', salary: '$115,000', location: 'Seattle, USA',
    emergencyContacts: [{ name: 'Daniel Harris', relationship: 'Husband', phone: '987-654-3210' }],
    employmentHistory: [{ jobTitle: 'DevOps Engineer', department: 'Engineering', startDate: '2021-11-15T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Information Technology', institution: 'University of Washington', yearOfGraduation: 2013 }],
    certificates: [{ name: 'Docker Certified Associate', issuer: 'Docker', issueDate: '2020-10-01', expiryDate: '2024-10-01'}]
  },
  {
    id: 15, name: 'Brian Clark', nickname: 'Brian', email: 'brian.clark@example.com', jobTitle: 'Lead QA Engineer', department: 'QA', site: 'HQ', status: 'Active', managerId: 2, startDate: '2021-03-22T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=brian.clark@example.com', selected: false,
    phone: '+1 555-0114', dateOfBirth: '1987-02-19', currentAddress: '666 Cedar Blvd, Anytown, USA 12345', permanentAddress: '666 Cedar Blvd, Anytown, USA 12345', citizenId: '159-753-4862', taxId: '486-753-1592', siteEmoji: '🏢', salary: '$120,000', location: 'Boston, USA',
    emergencyContacts: [{ name: 'Nancy Clark', relationship: 'Wife', phone: '147-147-1471' }],
    employmentHistory: [{ jobTitle: 'Lead QA Engineer', department: 'Engineering', startDate: '2021-03-22T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Master of Science', field: 'Software Quality Assurance', institution: 'Northeastern University', yearOfGraduation: 2011 }],
    certificates: []
  },
  {
    id: 16, name: 'Jessica Lewis', nickname: 'Jess', email: 'jessica.lewis@example.com', jobTitle: 'QA Tester', department: 'QA', site: 'Remote', status: 'Active', managerId: 15, startDate: '2023-01-09T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=jessica.lewis@example.com', selected: false,
    phone: '+1 555-0115', dateOfBirth: '1999-05-30', currentAddress: '777 Spruce St, Anytown, USA 12345', permanentAddress: '777 Spruce St, Anytown, USA 12345', citizenId: '357-159-2486', taxId: '248-159-3576', siteEmoji: '🏠', salary: '$75,000', location: 'Denver, USA',
    emergencyContacts: [{ name: 'Paul Lewis', relationship: 'Father', phone: '258-258-2582' }],
    employmentHistory: [{ jobTitle: 'QA Tester', department: 'Engineering', startDate: '2023-01-09T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Associate Degree', field: 'Computer Information Systems', institution: 'Community College of Denver', yearOfGraduation: 2021 }],
    certificates: []
  },
  {
    id: 17, name: 'Steven Walker', nickname: 'Steve', email: 'steven.walker@example.com', jobTitle: 'Senior Product Manager', department: 'Product', site: 'HQ', status: 'Active', managerId: 9, startDate: '2021-08-02T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=steven.walker@example.com', selected: false,
    phone: '+1 555-0116', dateOfBirth: '1988-12-05', currentAddress: '888 Willow Way, Anytown, USA 12345', permanentAddress: '888 Willow Way, Anytown, USA 12345', citizenId: '951-753-8520', taxId: '852-753-9510', siteEmoji: '🏢', salary: '$145,000', location: 'San Diego, USA',
    emergencyContacts: [{ name: 'Karen Walker', relationship: 'Sister', phone: '369-369-3693' }],
    employmentHistory: [{ jobTitle: 'Senior Product Manager', department: 'Product', startDate: '2021-08-02T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Master of Business Administration', field: 'Marketing', institution: 'UCLA Anderson School of Management', yearOfGraduation: 2014 }],
    certificates: []
  },
  {
    id: 18, name: 'Amanda Hall', nickname: 'Amanda', email: 'amanda.hall@example.com', jobTitle: 'Product Manager', department: 'Product', site: 'HQ', status: 'Active', managerId: 17, startDate: '2022-04-18T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=amanda.hall@example.com', selected: false,
    phone: '+1 555-0117', dateOfBirth: '1993-07-14', currentAddress: '999 Redwood Dr, Anytown, USA 12345', permanentAddress: '999 Redwood Dr, Anytown, USA 12345', citizenId: '753-951-1234', taxId: '123-951-7534', siteEmoji: '🏢', salary: '$110,000', location: 'New York, USA',
    emergencyContacts: [{ name: 'Mark Hall', relationship: 'Brother', phone: '456-123-7890' }],
    employmentHistory: [{ jobTitle: 'Product Manager', department: 'Product', startDate: '2022-04-18T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Product Design', institution: 'Parsons School of Design', yearOfGraduation: 2016 }],
    certificates: []
  },
  {
    id: 19, name: 'James Young', nickname: 'Jim', email: 'james.young@example.com', jobTitle: 'UI/UX Designer', department: 'Product', site: 'Remote', status: 'Active', managerId: 17, startDate: '2022-09-06T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=james.young@example.com', selected: false,
    phone: '+1 555-0118', dateOfBirth: '1996-01-20', currentAddress: '121 Pinecone Rd, Anytown, USA 12345', permanentAddress: '121 Pinecone Rd, Anytown, USA 12345', citizenId: '321-654-9870', taxId: '987-654-3210', siteEmoji: '🏠', salary: '$90,000', location: 'Paris, France',
    emergencyContacts: [{ name: 'Mary Young', relationship: 'Mother', phone: '789-456-1230' }],
    employmentHistory: [{ jobTitle: 'UI/UX Designer', department: 'Product', startDate: '2022-09-06T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Fine Arts', field: 'Graphic Design', institution: 'Rhode Island School of Design', yearOfGraduation: 2018 }],
    certificates: []
  },
  {
    id: 20, name: 'Laura King', nickname: 'Laura', email: 'laura.king@example.com', jobTitle: 'UX Researcher', department: 'Product', site: 'HQ', status: 'Active', managerId: 17, startDate: '2023-02-21T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=laura.king@example.com', selected: false,
    phone: '+1 555-0119', dateOfBirth: '1997-10-10', currentAddress: '232 Aspen Ct, Anytown, USA 12345', permanentAddress: '232 Aspen Ct, Anytown, USA 12345', citizenId: '654-321-0987', taxId: '098-765-4321', siteEmoji: '🏢', salary: '$85,000', location: 'Vancouver, Canada',
    emergencyContacts: [{ name: 'Robert King', relationship: 'Father', phone: '123-789-4560' }],
    employmentHistory: [{ jobTitle: 'UX Researcher', department: 'Product', startDate: '2023-02-21T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Psychology', institution: 'University of British Columbia', yearOfGraduation: 2019 }],
    certificates: []
  },
  {
    id: 21, name: 'Daniel Wright', nickname: 'Dan', email: 'daniel.wright@example.com', jobTitle: 'Digital Marketing Manager', department: 'Marketing', site: 'HQ', status: 'Active', managerId: 10, startDate: '2021-09-13T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=daniel.wright@example.com', selected: false,
    phone: '+1 555-0120', dateOfBirth: '1990-03-03', currentAddress: '343 Oakwood Pl, Anytown, USA 12345', permanentAddress: '343 Oakwood Pl, Anytown, USA 12345', citizenId: '987-012-3456', taxId: '345-678-9012', siteEmoji: '🏢', salary: '$105,000', location: 'Singapore',
    emergencyContacts: [{ name: 'Helen Wright', relationship: 'Mother', phone: '456-789-0123' }],
    employmentHistory: [{ jobTitle: 'Digital Marketing Manager', department: 'Marketing', startDate: '2021-09-13T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Business Administration', field: 'Marketing', institution: 'National University of Singapore', yearOfGraduation: 2012 }],
    certificates: []
  },
  {
    id: 22, name: 'Nancy Lopez', nickname: 'Nancy', email: 'nancy.lopez@example.com', jobTitle: 'Content Strategist', department: 'Marketing', site: 'Remote', status: 'Active', managerId: 21, startDate: '2022-05-23T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=nancy.lopez@example.com', selected: false,
    phone: '+1 555-0121', dateOfBirth: '1994-11-18', currentAddress: '454 Elmwood Ave, Anytown, USA 12345', permanentAddress: '454 Elmwood Ave, Anytown, USA 12345', citizenId: '012-345-6789', taxId: '678-901-2345', siteEmoji: '🏠', salary: '$88,000', location: 'Mexico City, Mexico',
    emergencyContacts: [{ name: 'Luis Lopez', relationship: 'Brother', phone: '789-012-3456' }],
    employmentHistory: [{ jobTitle: 'Content Strategist', department: 'Marketing', startDate: '2022-05-23T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Arts', field: 'Journalism', institution: 'UNAM', yearOfGraduation: 2016 }],
    certificates: []
  },
  {
    id: 23, name: 'Paul Hill', nickname: 'Paul', email: 'paul.hill@example.com', jobTitle: 'SEO Specialist', department: 'Marketing', site: 'Remote', status: 'Active', managerId: 21, startDate: '2023-03-01T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=paul.hill@example.com', selected: false,
    phone: '+1 555-0122', dateOfBirth: '1998-08-08', currentAddress: '565 Pinewood Ct, Anytown, USA 12345', permanentAddress: '565 Pinewood Ct, Anytown, USA 12345', citizenId: '234-567-8901', taxId: '890-123-4567', siteEmoji: '🏠', salary: '$82,000', location: 'Dublin, Ireland',
    emergencyContacts: [{ name: 'George Hill', relationship: 'Father', phone: '890-123-4567' }],
    employmentHistory: [{ jobTitle: 'SEO Specialist', department: 'Marketing', startDate: '2023-03-01T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Digital Media', institution: 'Dublin City University', yearOfGraduation: 2020 }],
    certificates: []
  },
  {
    id: 24, name: 'Donna Green', nickname: 'Donna', email: 'donna.green@example.com', jobTitle: 'Sales Manager', department: 'Sales', site: 'HQ', status: 'Active', managerId: 11, startDate: '2021-10-11T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=donna.green@example.com', selected: false,
    phone: '+1 555-0123', dateOfBirth: '1989-04-25', currentAddress: '676 Cedarwood Ln, Anytown, USA 12345', permanentAddress: '676 Cedarwood Ln, Anytown, USA 12345', citizenId: '456-789-0123', taxId: '012-345-6789', siteEmoji: '🏢', salary: '$115,000', location: 'Chicago, USA',
    emergencyContacts: [{ name: 'Carl Green', relationship: 'Husband', phone: '901-234-5678' }],
    employmentHistory: [{ jobTitle: 'Sales Manager', department: 'Sales', startDate: '2021-10-11T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Arts', field: 'Communications', institution: 'DePaul University', yearOfGraduation: 2011 }],
    certificates: []
  },
  {
    id: 25, name: 'Frank Adams', nickname: 'Frank', email: 'frank.adams@example.com', jobTitle: 'Account Executive', department: 'Sales', site: 'Remote', status: 'Active', managerId: 24, startDate: '2022-07-18T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=frank.adams@example.com', selected: false,
    phone: '+1 555-0124', dateOfBirth: '1995-02-15', currentAddress: '787 Birchwood Dr, Anytown, USA 12345', permanentAddress: '787 Birchwood Dr, Anytown, USA 12345', citizenId: '678-901-2345', taxId: '234-567-8901', siteEmoji: '🏠', salary: '$92,000', location: 'Atlanta, USA',
    emergencyContacts: [{ name: 'Betty Adams', relationship: 'Wife', phone: '012-345-6789' }],
    employmentHistory: [{ jobTitle: 'Account Executive', department: 'Sales', startDate: '2022-07-18T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Marketing', institution: 'Georgia State University', yearOfGraduation: 2017 }],
    certificates: []
  },
  {
    id: 26, name: 'Grace Baker', nickname: 'Grace', email: 'grace.baker@example.com', jobTitle: 'Sales Development Rep', department: 'Sales', site: 'HQ', status: 'Invited', managerId: 24, startDate: '2023-09-04T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=grace.baker@example.com', selected: false,
    phone: '+1 555-0125', dateOfBirth: '2000-06-10', currentAddress: '898 Redwood Ave, Anytown, USA 12345', permanentAddress: '898 Redwood Ave, Anytown, USA 12345', citizenId: '890-123-4567', taxId: '456-789-0123', siteEmoji: '🏢', salary: '$65,000', location: 'New York, USA',
    emergencyContacts: [{ name: 'Susan Baker', relationship: 'Mother', phone: '234-567-8901' }],
    employmentHistory: [{ jobTitle: 'Sales Development Rep', department: 'Sales', startDate: '2023-09-04T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'High School Diploma', field: 'General', institution: 'Anytown High School', yearOfGraduation: 2018 }],
    certificates: []
  },
  {
    id: 27, name: 'Henry Nelson', nickname: 'Henry', email: 'henry.nelson@example.com', jobTitle: 'HR Generalist', department: 'HR', site: 'HQ', status: 'Active', managerId: 12, startDate: '2022-08-22T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=henry.nelson@example.com', selected: false,
    phone: '+1 555-0126', dateOfBirth: '1993-01-30', currentAddress: '131 Oakwood Cir, Anytown, USA 12345', permanentAddress: '131 Oakwood Cir, Anytown, USA 12345', citizenId: '012-345-6789', taxId: '678-901-2345', siteEmoji: '🏢', salary: '$80,000', location: 'Los Angeles, USA',
    emergencyContacts: [{ name: 'Irene Nelson', relationship: 'Wife', phone: '345-678-9012' }],
    employmentHistory: [{ jobTitle: 'HR Generalist', department: 'HR', startDate: '2022-08-22T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Arts', field: 'Human Resources', institution: 'California State University', yearOfGraduation: 2015 }],
    certificates: []
  },
  {
    id: 28, name: 'Ivy Carter', nickname: 'Ivy', email: 'ivy.carter@example.com', jobTitle: 'Talent Acquisition Specialist', department: 'HR', site: 'Remote', status: 'Active', managerId: 12, startDate: '2022-11-07T09:00:00Z', avatar: 'https://i.pravatar.cc/150?u=ivy.carter@example.com', selected: false,
    phone: '+1 555-0127', dateOfBirth: '1996-09-09', currentAddress: '242 Pineview Rd, Anytown, USA 12345', permanentAddress: '242 Pineview Rd, Anytown, USA 12345', citizenId: '234-567-8901', taxId: '890-123-4567', siteEmoji: '🏠', salary: '$85,000', location: 'Austin, USA',
    emergencyContacts: [{ name: 'Jack Carter', relationship: 'Brother', phone: '456-789-0123' }],
    employmentHistory: [{ jobTitle: 'Talent Acquisition Specialist', department: 'HR', startDate: '2022-11-07T09:00:00Z', endDate: null }],
    educationHistory: [{ level: 'Bachelor of Science', field: 'Psychology', institution: 'University of Texas at Austin', yearOfGraduation: 2018 }],
    certificates: []
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

  assignManagerToNewDepartment(managerId: number, departmentName: string): void {
    this.employees.update(employees =>
      employees.map(emp =>
        emp.id === managerId ? { ...emp, department: departmentName } : emp
      )
    );
  }

  assignEmployeeToDepartment(employeeId: number, departmentName: string): void {
    this.employees.update(employees =>
      employees.map(emp =>
        emp.id === employeeId ? { ...emp, department: departmentName } : emp
      )
    );
  }
}
