import { Student, students, getFullName } from "./student-data";
import { Class, classes } from "./class-data";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  markedBy: string;
  markedAt: string;
}

// Status display config
export const attendanceStatusConfig: Record<
  AttendanceStatus,
  { label: string; color: string }
> = {
  present: {
    label: "Present",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  absent: {
    label: "Absent",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  late: {
    label: "Late",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  excused: {
    label: "Excused",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
};

// Generate attendance ID
export function generateAttendanceId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ATT${year}${random}`;
}

// Resolve studentId to Student
export function getAttendanceStudent(
  record: AttendanceRecord,
  allStudents: Student[]
): Student | undefined {
  return allStudents.find((s) => s.id === record.studentId);
}

// Resolve classId to Class
export function getAttendanceClass(
  record: AttendanceRecord,
  allClasses: Class[]
): Class | undefined {
  return allClasses.find((c) => c.id === record.classId);
}

// Export attendance to CSV
export function exportAttendanceToCSV(records: AttendanceRecord[]): void {
  const headers = [
    "ID",
    "Student",
    "Class",
    "Date",
    "Status",
    "Marked By",
    "Marked At",
    "Notes",
  ];

  const rows = records.map((record) => {
    const student = getAttendanceStudent(record, students);
    const cls = getAttendanceClass(record, classes);
    return [
      record.id,
      student ? getFullName(student) : record.studentId,
      cls ? cls.name : record.classId,
      record.date,
      record.status,
      record.markedBy,
      record.markedAt,
      `"${(record.notes || "").replace(/"/g, '""')}"`,
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
  link.setAttribute(
    "download",
    `attendance_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Mock attendance records
export const attendanceRecords: AttendanceRecord[] = [
  // 2025-01-20 — Grade 9-A (class 1: students 3, 10)
  {
    id: "ATT20250001",
    studentId: "3",
    classId: "1",
    date: "2025-01-20",
    status: "present",
    markedBy: "Michael Thompson",
    markedAt: "2025-01-20T08:05:00Z",
  },
  {
    id: "ATT20250002",
    studentId: "10",
    classId: "1",
    date: "2025-01-20",
    status: "late",
    notes: "Arrived 10 minutes late",
    markedBy: "Michael Thompson",
    markedAt: "2025-01-20T08:15:00Z",
  },
  // 2025-01-20 — Grade 10-A (class 3: students 1, 8, 15)
  {
    id: "ATT20250003",
    studentId: "1",
    classId: "3",
    date: "2025-01-20",
    status: "present",
    markedBy: "Robert Anderson",
    markedAt: "2025-01-20T09:00:00Z",
  },
  {
    id: "ATT20250004",
    studentId: "8",
    classId: "3",
    date: "2025-01-20",
    status: "absent",
    notes: "No notification received",
    markedBy: "Robert Anderson",
    markedAt: "2025-01-20T09:00:00Z",
  },
  {
    id: "ATT20250005",
    studentId: "15",
    classId: "3",
    date: "2025-01-20",
    status: "excused",
    notes: "Medical appointment",
    markedBy: "Robert Anderson",
    markedAt: "2025-01-20T09:00:00Z",
  },
  // 2025-01-20 — Grade 11-A (class 5: students 4, 11)
  {
    id: "ATT20250006",
    studentId: "4",
    classId: "5",
    date: "2025-01-20",
    status: "present",
    markedBy: "Jennifer Garcia",
    markedAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "ATT20250007",
    studentId: "11",
    classId: "5",
    date: "2025-01-20",
    status: "present",
    markedBy: "Jennifer Garcia",
    markedAt: "2025-01-20T10:00:00Z",
  },
  // 2025-01-21 — Grade 10-B (class 4: students 2, 12)
  {
    id: "ATT20250008",
    studentId: "2",
    classId: "4",
    date: "2025-01-21",
    status: "present",
    markedBy: "Amanda Davis",
    markedAt: "2025-01-21T08:05:00Z",
  },
  {
    id: "ATT20250009",
    studentId: "12",
    classId: "4",
    date: "2025-01-21",
    status: "late",
    notes: "Bus delay",
    markedBy: "Amanda Davis",
    markedAt: "2025-01-21T08:20:00Z",
  },
  // 2025-01-21 — Grade 12-A (class 7: students 6, 13)
  {
    id: "ATT20250010",
    studentId: "6",
    classId: "7",
    date: "2025-01-21",
    status: "present",
    markedBy: "Sarah Mitchell",
    markedAt: "2025-01-21T09:00:00Z",
  },
  {
    id: "ATT20250011",
    studentId: "13",
    classId: "7",
    date: "2025-01-21",
    status: "absent",
    notes: "Family emergency",
    markedBy: "Sarah Mitchell",
    markedAt: "2025-01-21T09:00:00Z",
  },
  // 2025-01-22 — Grade 9-B (class 2: students 5, 14)
  {
    id: "ATT20250012",
    studentId: "5",
    classId: "2",
    date: "2025-01-22",
    status: "present",
    markedBy: "Jessica Lee",
    markedAt: "2025-01-22T08:05:00Z",
  },
  {
    id: "ATT20250013",
    studentId: "14",
    classId: "2",
    date: "2025-01-22",
    status: "excused",
    notes: "School event participation",
    markedBy: "Jessica Lee",
    markedAt: "2025-01-22T08:05:00Z",
  },
  // 2025-01-22 — Grade 11-B (class 6: student 7)
  {
    id: "ATT20250014",
    studentId: "7",
    classId: "6",
    date: "2025-01-22",
    status: "absent",
    notes: "Transferred student — no longer attending",
    markedBy: "Christopher Martinez",
    markedAt: "2025-01-22T10:00:00Z",
  },
  // 2025-01-22 — Grade 12-B (class 8: student 9)
  {
    id: "ATT20250015",
    studentId: "9",
    classId: "8",
    date: "2025-01-22",
    status: "present",
    markedBy: "Emily Brown",
    markedAt: "2025-01-22T11:00:00Z",
  },
  // 2025-01-23 — Grade 9-A
  {
    id: "ATT20250016",
    studentId: "3",
    classId: "1",
    date: "2025-01-23",
    status: "absent",
    notes: "Sick — parent called in",
    markedBy: "Michael Thompson",
    markedAt: "2025-01-23T08:05:00Z",
  },
  {
    id: "ATT20250017",
    studentId: "10",
    classId: "1",
    date: "2025-01-23",
    status: "present",
    markedBy: "Michael Thompson",
    markedAt: "2025-01-23T08:05:00Z",
  },
  // 2025-01-23 — Grade 10-A
  {
    id: "ATT20250018",
    studentId: "1",
    classId: "3",
    date: "2025-01-23",
    status: "late",
    notes: "Traffic delay",
    markedBy: "Robert Anderson",
    markedAt: "2025-01-23T09:10:00Z",
  },
  {
    id: "ATT20250019",
    studentId: "8",
    classId: "3",
    date: "2025-01-23",
    status: "present",
    markedBy: "Robert Anderson",
    markedAt: "2025-01-23T09:00:00Z",
  },
  {
    id: "ATT20250020",
    studentId: "15",
    classId: "3",
    date: "2025-01-23",
    status: "present",
    markedBy: "Robert Anderson",
    markedAt: "2025-01-23T09:00:00Z",
  },
];
