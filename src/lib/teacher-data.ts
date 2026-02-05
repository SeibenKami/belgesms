export type Department = "mathematics" | "science" | "english" | "history" | "arts" | "physical_education";

export interface Teacher {
  id: string;
  teacherId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  contactAddress: string;
  photo?: string;
  department: Department;
  subjects: string[];
  qualification: string;
  status: "active" | "inactive" | "on_leave";
  joinDate: string;
}

// Helper to get full name
export function getTeacherFullName(teacher: Teacher): string {
  return [teacher.firstName, teacher.middleName, teacher.lastName]
    .filter(Boolean)
    .join(" ");
}

// Helper to get initials
export function getTeacherInitials(teacher: Teacher): string {
  return `${teacher.firstName[0]}${teacher.lastName[0]}`.toUpperCase();
}

// Generate teacher ID
export function generateTeacherId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `TCH${year}${random}`;
}

// Department display names and colors
export const departmentConfig: Record<Department, { name: string; color: string }> = {
  mathematics: { name: "Mathematics", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  science: { name: "Science", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  english: { name: "English", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
  history: { name: "History", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" },
  arts: { name: "Arts", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300" },
  physical_education: { name: "Physical Education", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
};

// Status colors
export const teacherStatusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  on_leave: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

// Export teachers to CSV
export function exportTeachersToCSV(teachersList: Teacher[]): void {
  const headers = [
    "Teacher ID",
    "First Name",
    "Middle Name",
    "Last Name",
    "Email",
    "Phone",
    "Date of Birth",
    "Contact Address",
    "Department",
    "Subjects",
    "Qualification",
    "Status",
    "Join Date",
  ];

  const rows = teachersList.map((teacher) => [
    teacher.teacherId,
    teacher.firstName,
    teacher.middleName || "",
    teacher.lastName,
    teacher.email,
    teacher.phone,
    teacher.dateOfBirth,
    `"${teacher.contactAddress.replace(/"/g, '""')}"`,
    departmentConfig[teacher.department].name,
    `"${teacher.subjects.join(", ")}"`,
    teacher.qualification,
    teacher.status,
    teacher.joinDate,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `teachers_export_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const teachers: Teacher[] = [
  {
    id: "1",
    teacherId: "TCH2020001",
    firstName: "Robert",
    middleName: "James",
    lastName: "Anderson",
    email: "r.anderson@school.edu",
    phone: "+1 (555) 100-1001",
    dateOfBirth: "1985-03-15",
    contactAddress: "100 Faculty Lane, Springfield, IL 62701",
    department: "mathematics",
    subjects: ["Algebra", "Calculus", "Statistics"],
    qualification: "M.Sc. Mathematics",
    status: "active",
    joinDate: "2020-08-15",
  },
  {
    id: "2",
    teacherId: "TCH2019001",
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "s.mitchell@school.edu",
    phone: "+1 (555) 100-1002",
    dateOfBirth: "1982-07-22",
    contactAddress: "102 Faculty Lane, Springfield, IL 62701",
    department: "science",
    subjects: ["Biology", "Chemistry"],
    qualification: "Ph.D. Biology",
    status: "active",
    joinDate: "2019-08-15",
  },
  {
    id: "3",
    teacherId: "TCH2021001",
    firstName: "Michael",
    middleName: "David",
    lastName: "Thompson",
    email: "m.thompson@school.edu",
    phone: "+1 (555) 100-1003",
    dateOfBirth: "1990-11-08",
    contactAddress: "104 Faculty Lane, Springfield, IL 62702",
    department: "english",
    subjects: ["English Literature", "Creative Writing"],
    qualification: "M.A. English Literature",
    status: "active",
    joinDate: "2021-01-10",
  },
  {
    id: "4",
    teacherId: "TCH2018001",
    firstName: "Jennifer",
    lastName: "Garcia",
    email: "j.garcia@school.edu",
    phone: "+1 (555) 100-1004",
    dateOfBirth: "1978-05-30",
    contactAddress: "106 Faculty Lane, Springfield, IL 62702",
    department: "history",
    subjects: ["World History", "American History", "Geography"],
    qualification: "M.A. History",
    status: "active",
    joinDate: "2018-08-15",
  },
  {
    id: "5",
    teacherId: "TCH2022001",
    firstName: "David",
    middleName: "Lee",
    lastName: "Wilson",
    email: "d.wilson@school.edu",
    phone: "+1 (555) 100-1005",
    dateOfBirth: "1988-09-12",
    contactAddress: "108 Faculty Lane, Springfield, IL 62703",
    department: "physical_education",
    subjects: ["Physical Education", "Health"],
    qualification: "B.S. Physical Education",
    status: "on_leave",
    joinDate: "2022-08-15",
  },
  {
    id: "6",
    teacherId: "TCH2017001",
    firstName: "Emily",
    middleName: "Rose",
    lastName: "Brown",
    email: "e.brown@school.edu",
    phone: "+1 (555) 100-1006",
    dateOfBirth: "1980-01-25",
    contactAddress: "110 Faculty Lane, Springfield, IL 62703",
    department: "arts",
    subjects: ["Visual Arts", "Art History"],
    qualification: "M.F.A. Fine Arts",
    status: "active",
    joinDate: "2017-08-15",
  },
  {
    id: "7",
    teacherId: "TCH2020002",
    firstName: "Christopher",
    lastName: "Martinez",
    email: "c.martinez@school.edu",
    phone: "+1 (555) 100-1007",
    dateOfBirth: "1987-08-17",
    contactAddress: "112 Faculty Lane, Springfield, IL 62704",
    department: "science",
    subjects: ["Physics", "Astronomy"],
    qualification: "M.Sc. Physics",
    status: "active",
    joinDate: "2020-01-10",
  },
  {
    id: "8",
    teacherId: "TCH2021002",
    firstName: "Amanda",
    middleName: "Claire",
    lastName: "Davis",
    email: "a.davis@school.edu",
    phone: "+1 (555) 100-1008",
    dateOfBirth: "1992-12-03",
    contactAddress: "114 Faculty Lane, Springfield, IL 62704",
    department: "mathematics",
    subjects: ["Geometry", "Pre-Calculus"],
    qualification: "M.Sc. Mathematics",
    status: "active",
    joinDate: "2021-08-15",
  },
  {
    id: "9",
    teacherId: "TCH2016001",
    firstName: "William",
    lastName: "Taylor",
    email: "w.taylor@school.edu",
    phone: "+1 (555) 100-1009",
    dateOfBirth: "1975-04-20",
    contactAddress: "116 Faculty Lane, Springfield, IL 62705",
    department: "english",
    subjects: ["Grammar", "Public Speaking"],
    qualification: "M.A. Communications",
    status: "inactive",
    joinDate: "2016-08-15",
  },
  {
    id: "10",
    teacherId: "TCH2023001",
    firstName: "Jessica",
    middleName: "Ann",
    lastName: "Lee",
    email: "j.lee@school.edu",
    phone: "+1 (555) 100-1010",
    dateOfBirth: "1995-02-14",
    contactAddress: "118 Faculty Lane, Springfield, IL 62705",
    department: "science",
    subjects: ["Environmental Science", "Biology"],
    qualification: "M.Sc. Environmental Science",
    status: "active",
    joinDate: "2023-08-15",
  },
];
