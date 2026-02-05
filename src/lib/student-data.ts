export type House = "red" | "blue" | "green" | "yellow";

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  contactAddress: string;
  guardianName: string;
  guardianPhone: string;
  photo?: string;
  grade: string;
  section: string;
  house: House;
  status: "active" | "inactive" | "transferred";
  enrollmentDate: string;
}

// Helper to get full name
export function getFullName(student: Student): string {
  return [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(" ");
}

// Helper to get initials
export function getInitials(student: Student): string {
  return `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
}

// Generate admission number
export function generateAdmissionNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `ADM${year}${random}`;
}

// House display names and colors
export const houseConfig: Record<House, { name: string; color: string }> = {
  red: { name: "Red House", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  blue: { name: "Blue House", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  green: { name: "Green House", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  yellow: { name: "Yellow House", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
};

// Export students to CSV
export function exportStudentsToCSV(studentsList: Student[]): void {
  const headers = [
    "Admission Number",
    "First Name",
    "Middle Name",
    "Last Name",
    "Email",
    "Date of Birth",
    "Contact Address",
    "Guardian Name",
    "Guardian Phone",
    "Grade",
    "Section",
    "House",
    "Status",
    "Enrollment Date",
  ];

  const rows = studentsList.map((student) => [
    student.admissionNumber,
    student.firstName,
    student.middleName || "",
    student.lastName,
    student.email,
    student.dateOfBirth,
    `"${student.contactAddress.replace(/"/g, '""')}"`, // Escape quotes in address
    student.guardianName,
    student.guardianPhone,
    student.grade,
    student.section,
    houseConfig[student.house].name,
    student.status,
    student.enrollmentDate,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `students_export_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const students: Student[] = [
  {
    id: "1",
    admissionNumber: "ADM2024001",
    firstName: "Emma",
    middleName: "Rose",
    lastName: "Wilson",
    email: "emma.w@school.edu",
    dateOfBirth: "2008-03-15",
    contactAddress: "123 Oak Street, Springfield, IL 62701",
    guardianName: "Sarah Wilson",
    guardianPhone: "+1 (555) 123-4567",
    grade: "10",
    section: "A",
    house: "red",
    status: "active",
    enrollmentDate: "2024-09-01",
  },
  {
    id: "2",
    admissionNumber: "ADM2024002",
    firstName: "Liam",
    lastName: "Martinez",
    email: "liam.m@school.edu",
    dateOfBirth: "2008-07-22",
    contactAddress: "456 Maple Avenue, Springfield, IL 62702",
    guardianName: "Carlos Martinez",
    guardianPhone: "+1 (555) 234-5678",
    grade: "10",
    section: "B",
    house: "blue",
    status: "active",
    enrollmentDate: "2024-09-01",
  },
  {
    id: "3",
    admissionNumber: "ADM2025001",
    firstName: "Sophia",
    middleName: "Lin",
    lastName: "Chen",
    email: "sophia.c@school.edu",
    dateOfBirth: "2009-11-08",
    contactAddress: "789 Pine Road, Springfield, IL 62703",
    guardianName: "Wei Chen",
    guardianPhone: "+1 (555) 345-6789",
    grade: "9",
    section: "A",
    house: "green",
    status: "active",
    enrollmentDate: "2025-01-15",
  },
  {
    id: "4",
    admissionNumber: "ADM2023001",
    firstName: "Noah",
    middleName: "James",
    lastName: "Johnson",
    email: "noah.j@school.edu",
    dateOfBirth: "2007-05-30",
    contactAddress: "321 Elm Street, Springfield, IL 62704",
    guardianName: "Michael Johnson",
    guardianPhone: "+1 (555) 456-7890",
    grade: "11",
    section: "A",
    house: "yellow",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "5",
    admissionNumber: "ADM2025002",
    firstName: "Olivia",
    lastName: "Brown",
    email: "olivia.b@school.edu",
    dateOfBirth: "2009-09-12",
    contactAddress: "654 Cedar Lane, Springfield, IL 62705",
    guardianName: "Jennifer Brown",
    guardianPhone: "+1 (555) 567-8901",
    grade: "9",
    section: "B",
    house: "red",
    status: "inactive",
    enrollmentDate: "2025-01-15",
  },
  {
    id: "6",
    admissionNumber: "ADM2022001",
    firstName: "James",
    middleName: "Robert",
    lastName: "Davis",
    email: "james.d@school.edu",
    dateOfBirth: "2006-01-25",
    contactAddress: "987 Birch Court, Springfield, IL 62706",
    guardianName: "Robert Davis",
    guardianPhone: "+1 (555) 678-9012",
    grade: "12",
    section: "A",
    house: "blue",
    status: "active",
    enrollmentDate: "2022-09-01",
  },
  {
    id: "7",
    admissionNumber: "ADM2023002",
    firstName: "Ava",
    middleName: "Marie",
    lastName: "Garcia",
    email: "ava.g@school.edu",
    dateOfBirth: "2007-08-17",
    contactAddress: "147 Willow Way, Springfield, IL 62707",
    guardianName: "Maria Garcia",
    guardianPhone: "+1 (555) 789-0123",
    grade: "11",
    section: "B",
    house: "green",
    status: "transferred",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "8",
    admissionNumber: "ADM2024003",
    firstName: "William",
    lastName: "Lee",
    email: "william.l@school.edu",
    dateOfBirth: "2008-12-03",
    contactAddress: "258 Spruce Drive, Springfield, IL 62708",
    guardianName: "David Lee",
    guardianPhone: "+1 (555) 890-1234",
    grade: "10",
    section: "A",
    house: "yellow",
    status: "active",
    enrollmentDate: "2024-09-01",
  },
  {
    id: "9",
    admissionNumber: "ADM2022002",
    firstName: "Isabella",
    middleName: "Sun",
    lastName: "Kim",
    email: "isabella.k@school.edu",
    dateOfBirth: "2006-04-20",
    contactAddress: "369 Aspen Circle, Springfield, IL 62709",
    guardianName: "Jin Kim",
    guardianPhone: "+1 (555) 901-2345",
    grade: "12",
    section: "B",
    house: "red",
    status: "active",
    enrollmentDate: "2022-09-01",
  },
  {
    id: "10",
    admissionNumber: "ADM2025003",
    firstName: "Mason",
    lastName: "Taylor",
    email: "mason.t@school.edu",
    dateOfBirth: "2010-02-14",
    contactAddress: "741 Redwood Blvd, Springfield, IL 62710",
    guardianName: "Amanda Taylor",
    guardianPhone: "+1 (555) 012-3456",
    grade: "9",
    section: "A",
    house: "blue",
    status: "active",
    enrollmentDate: "2025-09-01",
  },
  {
    id: "11",
    admissionNumber: "ADM2023003",
    firstName: "Mia",
    middleName: "Grace",
    lastName: "Anderson",
    email: "mia.a@school.edu",
    dateOfBirth: "2007-06-28",
    contactAddress: "852 Sequoia Street, Springfield, IL 62711",
    guardianName: "Thomas Anderson",
    guardianPhone: "+1 (555) 111-2233",
    grade: "11",
    section: "A",
    house: "green",
    status: "active",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "12",
    admissionNumber: "ADM2024004",
    firstName: "Ethan",
    lastName: "Thomas",
    email: "ethan.t@school.edu",
    dateOfBirth: "2008-10-09",
    contactAddress: "963 Magnolia Place, Springfield, IL 62712",
    guardianName: "Lisa Thomas",
    guardianPhone: "+1 (555) 222-3344",
    grade: "10",
    section: "B",
    house: "yellow",
    status: "active",
    enrollmentDate: "2024-09-01",
  },
  {
    id: "13",
    admissionNumber: "ADM2022003",
    firstName: "Charlotte",
    middleName: "Anne",
    lastName: "White",
    email: "charlotte.w@school.edu",
    dateOfBirth: "2006-07-11",
    contactAddress: "159 Cypress Lane, Springfield, IL 62713",
    guardianName: "Richard White",
    guardianPhone: "+1 (555) 333-4455",
    grade: "12",
    section: "A",
    house: "red",
    status: "active",
    enrollmentDate: "2022-09-01",
  },
  {
    id: "14",
    admissionNumber: "ADM2025004",
    firstName: "Alexander",
    middleName: "Paul",
    lastName: "Harris",
    email: "alex.h@school.edu",
    dateOfBirth: "2010-04-05",
    contactAddress: "267 Juniper Road, Springfield, IL 62714",
    guardianName: "Paul Harris",
    guardianPhone: "+1 (555) 444-5566",
    grade: "9",
    section: "B",
    house: "blue",
    status: "active",
    enrollmentDate: "2025-09-01",
  },
  {
    id: "15",
    admissionNumber: "ADM2024005",
    firstName: "Amelia",
    middleName: "Joy",
    lastName: "Clark",
    email: "amelia.c@school.edu",
    dateOfBirth: "2008-08-23",
    contactAddress: "378 Hickory Avenue, Springfield, IL 62715",
    guardianName: "Susan Clark",
    guardianPhone: "+1 (555) 555-6677",
    grade: "10",
    section: "A",
    house: "green",
    status: "inactive",
    enrollmentDate: "2024-09-01",
  },
];
