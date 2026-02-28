import { classes } from "./class-data";
import { subjects } from "./subject-data";

export type ExamPeriod = "mid_semester" | "end_of_semester";

export type ExamStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

export interface Examination {
  id: string;
  title: string;
  type: ExamPeriod;
  subjectId: string;
  subject: string;
  classId: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalStudents: number;
  status: ExamStatus;
  documentUrl: string | null;
  documentName: string | null;
  uploadedBy: string | null;
  uploadedAt: string | null;
  createdAt: string;
}

// Period display config
export const examPeriodConfig: Record<
  ExamPeriod,
  { label: string; color: string }
> = {
  mid_semester: {
    label: "Mid-Semester",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  end_of_semester: {
    label: "End of Semester",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
};

// Status display config
export const examStatusConfig: Record<
  ExamStatus,
  { label: string; color: string }
> = {
  scheduled: {
    label: "Scheduled",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  ongoing: {
    label: "Ongoing",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

// Generate exam ID
export function generateExamId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `EXM${year}${random}`;
}

// Export exams to CSV
export function exportExamsToCSV(exams: Examination[]): void {
  const headers = [
    "ID",
    "Title",
    "Type",
    "Subject",
    "Class",
    "Date",
    "Start Time",
    "End Time",
    "Duration (min)",
    "Total Students",
    "Status",
    "Document",
    "Uploaded By",
    "Uploaded At",
    "Created At",
  ];

  const rows = exams.map((exam) => [
    exam.id,
    `"${exam.title.replace(/"/g, '""')}"`,
    examPeriodConfig[exam.type].label,
    `"${exam.subject.replace(/"/g, '""')}"`,
    `"${exam.className.replace(/"/g, '""')}"`,
    exam.date,
    exam.startTime,
    exam.endTime,
    exam.duration,
    exam.totalStudents,
    exam.status,
    exam.documentName || "Not uploaded",
    exam.uploadedBy || "",
    exam.uploadedAt || "",
    exam.createdAt,
  ]);

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
    `examinations_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Mock examinations
export const initialExaminations: Examination[] = [
  {
    id: "EXM20250001",
    title: "Mid-Semester Algebra Exam",
    type: "mid_semester",
    subjectId: "1",
    subject: "Algebra",
    classId: "1",
    className: "Grade 9-A",
    date: "2025-03-10",
    startTime: "08:00",
    endTime: "10:00",
    duration: 120,
    totalStudents: 2,
    status: "completed",
    documentUrl: "data:application/pdf;base64,mock",
    documentName: "algebra_mid_sem_9a.pdf",
    uploadedBy: "Robert Anderson",
    uploadedAt: "2025-03-05T10:00:00Z",
    createdAt: "2025-02-15T09:00:00Z",
  },
  {
    id: "EXM20250002",
    title: "Mid-Semester Biology Exam",
    type: "mid_semester",
    subjectId: "4",
    subject: "Biology",
    classId: "1",
    className: "Grade 9-A",
    date: "2025-03-11",
    startTime: "08:00",
    endTime: "10:00",
    duration: 120,
    totalStudents: 2,
    status: "completed",
    documentUrl: "data:application/pdf;base64,mock",
    documentName: "biology_mid_sem_9a.pdf",
    uploadedBy: "Sarah Mitchell",
    uploadedAt: "2025-03-06T11:00:00Z",
    createdAt: "2025-02-15T09:30:00Z",
  },
  {
    id: "EXM20250003",
    title: "Mid-Semester World History Exam",
    type: "mid_semester",
    subjectId: "9",
    subject: "World History",
    classId: "2",
    className: "Grade 9-B",
    date: "2025-03-12",
    startTime: "10:30",
    endTime: "12:30",
    duration: 120,
    totalStudents: 2,
    status: "completed",
    documentUrl: null,
    documentName: null,
    uploadedBy: null,
    uploadedAt: null,
    createdAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "EXM20250004",
    title: "Mid-Semester Geometry Exam",
    type: "mid_semester",
    subjectId: "3",
    subject: "Geometry",
    classId: "3",
    className: "Grade 10-A",
    date: "2025-03-10",
    startTime: "08:00",
    endTime: "10:00",
    duration: 120,
    totalStudents: 3,
    status: "completed",
    documentUrl: "data:application/pdf;base64,mock",
    documentName: "geometry_mid_sem_10a.pdf",
    uploadedBy: "Amanda Davis",
    uploadedAt: "2025-03-04T14:00:00Z",
    createdAt: "2025-02-16T09:00:00Z",
  },
  {
    id: "EXM20250005",
    title: "Mid-Semester Chemistry Exam",
    type: "mid_semester",
    subjectId: "5",
    subject: "Chemistry",
    classId: "3",
    className: "Grade 10-A",
    date: "2025-03-11",
    startTime: "10:30",
    endTime: "12:30",
    duration: 120,
    totalStudents: 3,
    status: "completed",
    documentUrl: null,
    documentName: null,
    uploadedBy: null,
    uploadedAt: null,
    createdAt: "2025-02-16T09:30:00Z",
  },
  {
    id: "EXM20250006",
    title: "End-of-Semester Calculus Exam",
    type: "end_of_semester",
    subjectId: "2",
    subject: "Calculus",
    classId: "5",
    className: "Grade 11-A",
    date: "2025-06-16",
    startTime: "08:00",
    endTime: "11:00",
    duration: 180,
    totalStudents: 2,
    status: "scheduled",
    documentUrl: null,
    documentName: null,
    uploadedBy: null,
    uploadedAt: null,
    createdAt: "2025-04-01T10:00:00Z",
  },
  {
    id: "EXM20250007",
    title: "End-of-Semester Physics Exam",
    type: "end_of_semester",
    subjectId: "6",
    subject: "Physics",
    classId: "5",
    className: "Grade 11-A",
    date: "2025-06-17",
    startTime: "08:00",
    endTime: "11:00",
    duration: 180,
    totalStudents: 2,
    status: "scheduled",
    documentUrl: "data:application/pdf;base64,mock",
    documentName: "physics_final_11a.pdf",
    uploadedBy: "Christopher Martinez",
    uploadedAt: "2025-05-20T09:00:00Z",
    createdAt: "2025-04-01T10:30:00Z",
  },
  {
    id: "EXM20250008",
    title: "End-of-Semester Statistics Exam",
    type: "end_of_semester",
    subjectId: "13",
    subject: "Statistics",
    classId: "7",
    className: "Grade 12-A",
    date: "2025-06-18",
    startTime: "08:00",
    endTime: "11:00",
    duration: 180,
    totalStudents: 2,
    status: "scheduled",
    documentUrl: "data:application/pdf;base64,mock",
    documentName: "statistics_final_12a.pdf",
    uploadedBy: "Robert Anderson",
    uploadedAt: "2025-05-22T15:00:00Z",
    createdAt: "2025-04-02T09:00:00Z",
  },
  {
    id: "EXM20250009",
    title: "End-of-Semester Environmental Science Exam",
    type: "end_of_semester",
    subjectId: "14",
    subject: "Environmental Science",
    classId: "7",
    className: "Grade 12-A",
    date: "2025-06-19",
    startTime: "10:30",
    endTime: "13:00",
    duration: 150,
    totalStudents: 2,
    status: "scheduled",
    documentUrl: null,
    documentName: null,
    uploadedBy: null,
    uploadedAt: null,
    createdAt: "2025-04-02T09:30:00Z",
  },
  {
    id: "EXM20250010",
    title: "Mid-Semester English Literature Exam",
    type: "mid_semester",
    subjectId: "7",
    subject: "English Literature",
    classId: "4",
    className: "Grade 10-B",
    date: "2025-03-13",
    startTime: "08:00",
    endTime: "09:30",
    duration: 90,
    totalStudents: 2,
    status: "cancelled",
    documentUrl: null,
    documentName: null,
    uploadedBy: null,
    uploadedAt: null,
    createdAt: "2025-02-17T08:00:00Z",
  },
];
