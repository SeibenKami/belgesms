import { Teacher, teachers } from "./teacher-data";
import { Student, students } from "./student-data";

export interface Class {
  id: string;
  classId: string;
  name: string;
  grade: string;
  section: string;
  academicYear: string;
  classTeacherId: string;
  studentIds: string[];
  roomNumber: string;
  capacity: number;
  status: "active" | "inactive";
}

// Helper to generate class ID
export function generateClassId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `CLS${year}${random}`;
}

// Helper to get class teacher
export function getClassTeacher(classData: Class): Teacher | undefined {
  return teachers.find((t) => t.id === classData.classTeacherId);
}

// Helper to get class students
export function getClassStudents(classData: Class, allStudents: Student[]): Student[] {
  return allStudents.filter((s) => classData.studentIds.includes(s.id));
}

// Helper to get student count
export function getStudentCount(classData: Class): number {
  return classData.studentIds.length;
}

// Status colors
export const classStatusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

// Export classes to CSV
export function exportClassesToCSV(classList: Class[]): void {
  const headers = [
    "Class ID",
    "Name",
    "Grade",
    "Section",
    "Academic Year",
    "Class Teacher",
    "Room Number",
    "Capacity",
    "Students Enrolled",
    "Status",
  ];

  const rows = classList.map((cls) => {
    const teacher = getClassTeacher(cls);
    return [
      cls.classId,
      cls.name,
      cls.grade,
      cls.section,
      cls.academicYear,
      teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unassigned",
      cls.roomNumber,
      cls.capacity,
      cls.studentIds.length,
      cls.status,
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `classes_export_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Get students by grade and section for easy assignment
export function getStudentsByGradeSection(grade: string, section: string, allStudents: Student[]): Student[] {
  return allStudents.filter((s) => s.grade === grade && s.section === section);
}

export const classes: Class[] = [
  {
    id: "1",
    classId: "CLS2025001",
    name: "Grade 9-A",
    grade: "9",
    section: "A",
    academicYear: "2024-2025",
    classTeacherId: "3", // Michael Thompson - English
    studentIds: ["3", "10"], // Sophia Chen, Mason Taylor
    roomNumber: "101",
    capacity: 30,
    status: "active",
  },
  {
    id: "2",
    classId: "CLS2025002",
    name: "Grade 9-B",
    grade: "9",
    section: "B",
    academicYear: "2024-2025",
    classTeacherId: "10", // Jessica Lee - Science
    studentIds: ["5", "14"], // Olivia Brown, Alexander Harris
    roomNumber: "102",
    capacity: 30,
    status: "active",
  },
  {
    id: "3",
    classId: "CLS2025003",
    name: "Grade 10-A",
    grade: "10",
    section: "A",
    academicYear: "2024-2025",
    classTeacherId: "1", // Robert Anderson - Mathematics
    studentIds: ["1", "8", "15"], // Emma Wilson, William Lee, Amelia Clark
    roomNumber: "201",
    capacity: 30,
    status: "active",
  },
  {
    id: "4",
    classId: "CLS2025004",
    name: "Grade 10-B",
    grade: "10",
    section: "B",
    academicYear: "2024-2025",
    classTeacherId: "8", // Amanda Davis - Mathematics
    studentIds: ["2", "12"], // Liam Martinez, Ethan Thomas
    roomNumber: "202",
    capacity: 30,
    status: "active",
  },
  {
    id: "5",
    classId: "CLS2025005",
    name: "Grade 11-A",
    grade: "11",
    section: "A",
    academicYear: "2024-2025",
    classTeacherId: "4", // Jennifer Garcia - History
    studentIds: ["4", "11"], // Noah Johnson, Mia Anderson
    roomNumber: "301",
    capacity: 30,
    status: "active",
  },
  {
    id: "6",
    classId: "CLS2025006",
    name: "Grade 11-B",
    grade: "11",
    section: "B",
    academicYear: "2024-2025",
    classTeacherId: "7", // Christopher Martinez - Science
    studentIds: ["7"], // Ava Garcia
    roomNumber: "302",
    capacity: 30,
    status: "active",
  },
  {
    id: "7",
    classId: "CLS2025007",
    name: "Grade 12-A",
    grade: "12",
    section: "A",
    academicYear: "2024-2025",
    classTeacherId: "2", // Sarah Mitchell - Science
    studentIds: ["6", "13"], // James Davis, Charlotte White
    roomNumber: "401",
    capacity: 30,
    status: "active",
  },
  {
    id: "8",
    classId: "CLS2025008",
    name: "Grade 12-B",
    grade: "12",
    section: "B",
    academicYear: "2024-2025",
    classTeacherId: "6", // Emily Brown - Arts
    studentIds: ["9"], // Isabella Kim
    roomNumber: "402",
    capacity: 30,
    status: "active",
  },
];
