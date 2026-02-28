import {
  Term,
  getStudentSummary,
  defaultTermConfig,
  AssessmentScore,
} from "./output-of-work-data";
import { students, getFullName } from "./student-data";
import { classes } from "./class-data";
import { subjects } from "./subject-data";
import { AttendanceRecord } from "./attendance-data";

// Types
export interface ExamResult {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  term: Term;
  examScore: number; // out of 100
  enteredBy: string;
  enteredAt: string;
}

export interface GradeScale {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  remark: string;
}

export interface SubjectReportRow {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  caScore: number; // out of 30
  examScore: number; // out of 70
  total: number; // out of 100
  grade: string;
  remark: string;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  excused: number;
  totalDays: number;
  attendancePercentage: number;
}

export interface StudentReportData {
  studentId: string;
  admissionNumber: string;
  studentName: string;
  className: string;
  grade: string;
  section: string;
  term: Term;
  academicYear: string;
  subjects: SubjectReportRow[];
  attendance: AttendanceSummary;
  overallAverage: number;
  overallGrade: string;
  overallRemark: string;
  totalStudents: number;
  generatedAt: string;
}

// Grading scale config
export const gradingScale: GradeScale[] = [
  { grade: "A", minPercentage: 80, maxPercentage: 100, remark: "Excellent" },
  { grade: "B", minPercentage: 70, maxPercentage: 79, remark: "Very Good" },
  { grade: "C", minPercentage: 60, maxPercentage: 69, remark: "Good" },
  { grade: "D", minPercentage: 50, maxPercentage: 59, remark: "Fair" },
  { grade: "F", minPercentage: 0, maxPercentage: 49, remark: "Fail" },
];

// Helpers
export function getLetterGrade(percentage: number): { grade: string; remark: string } {
  const rounded = Math.round(percentage);
  for (const scale of gradingScale) {
    if (rounded >= scale.minPercentage && rounded <= scale.maxPercentage) {
      return { grade: scale.grade, remark: scale.remark };
    }
  }
  return { grade: "F", remark: "Fail" };
}

export function getSubjectsForClass(classId: string) {
  const classData = classes.find((c) => c.id === classId);
  if (!classData) return [];
  return subjects.filter(
    (s) => s.gradeLevel === classData.grade && s.status === "active"
  );
}

export function computeStudentReport(
  studentId: string,
  classId: string,
  term: Term,
  caScores: AssessmentScore[],
  examResults: ExamResult[],
  attendanceRecords: AttendanceRecord[]
): StudentReportData | null {
  const student = students.find((s) => s.id === studentId);
  const classData = classes.find((c) => c.id === classId);
  if (!student || !classData) return null;

  const classSubjects = getSubjectsForClass(classId);

  const subjectRows: SubjectReportRow[] = classSubjects.map((subject) => {
    // CA: get student summary percentage and scale to 30
    const summary = getStudentSummary(
      studentId,
      subject.id,
      term,
      caScores,
      defaultTermConfig
    );
    const caScore = Math.round((summary.percentage / 100) * 30 * 100) / 100;

    // Exam: find matching result and scale to 70
    const examResult = examResults.find(
      (e) =>
        e.studentId === studentId &&
        e.subjectId === subject.id &&
        e.term === term
    );
    const examScore = examResult
      ? Math.round((examResult.examScore / 100) * 70 * 100) / 100
      : 0;

    const total = Math.round((caScore + examScore) * 100) / 100;
    const { grade, remark } = getLetterGrade(total);

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      subjectCode: subject.code,
      caScore,
      examScore,
      total,
      grade,
      remark,
    };
  });

  // Attendance summary
  const studentAttendance = attendanceRecords.filter(
    (r) => r.studentId === studentId && r.classId === classId
  );
  const present = studentAttendance.filter((r) => r.status === "present").length;
  const absent = studentAttendance.filter((r) => r.status === "absent").length;
  const late = studentAttendance.filter((r) => r.status === "late").length;
  const excused = studentAttendance.filter((r) => r.status === "excused").length;
  const totalDays = studentAttendance.length;
  const attendancePercentage =
    totalDays > 0 ? Math.round(((present + late) / totalDays) * 100 * 100) / 100 : 0;

  const attendance: AttendanceSummary = {
    present,
    absent,
    late,
    excused,
    totalDays,
    attendancePercentage,
  };

  // Overall average
  const overallAverage =
    subjectRows.length > 0
      ? Math.round(
          (subjectRows.reduce((sum, r) => sum + r.total, 0) / subjectRows.length) *
            100
        ) / 100
      : 0;
  const { grade: overallGrade, remark: overallRemark } = getLetterGrade(overallAverage);

  return {
    studentId,
    admissionNumber: student.admissionNumber,
    studentName: getFullName(student),
    className: classData.name,
    grade: classData.grade,
    section: classData.section,
    term,
    academicYear: classData.academicYear,
    subjects: subjectRows,
    attendance,
    overallAverage,
    overallGrade,
    overallRemark,
    totalStudents: classData.studentIds.length,
    generatedAt: new Date().toISOString(),
  };
}

export function generateBulkReports(
  classId: string,
  term: Term,
  caScores: AssessmentScore[],
  examResults: ExamResult[],
  attendanceRecords: AttendanceRecord[]
): StudentReportData[] {
  const classData = classes.find((c) => c.id === classId);
  if (!classData) return [];

  return classData.studentIds
    .map((studentId) =>
      computeStudentReport(studentId, classId, term, caScores, examResults, attendanceRecords)
    )
    .filter((report): report is StudentReportData => report !== null);
}

// Mock exam results
export const initialExamResults: ExamResult[] = [
  // Grade 10-A (class 3) — Geometry (subject 3), Term 1
  { id: "EXR001", studentId: "1", classId: "3", subjectId: "3", term: "Term 1", examScore: 85, enteredBy: "TCH2021002", enteredAt: "2025-01-15T10:00:00Z" },
  { id: "EXR002", studentId: "8", classId: "3", subjectId: "3", term: "Term 1", examScore: 68, enteredBy: "TCH2021002", enteredAt: "2025-01-15T10:00:00Z" },
  { id: "EXR003", studentId: "15", classId: "3", subjectId: "3", term: "Term 1", examScore: 92, enteredBy: "TCH2021002", enteredAt: "2025-01-15T10:00:00Z" },

  // Grade 10-A (class 3) — Chemistry (subject 5), Term 1
  { id: "EXR004", studentId: "1", classId: "3", subjectId: "5", term: "Term 1", examScore: 78, enteredBy: "TCH2019001", enteredAt: "2025-01-16T10:00:00Z" },
  { id: "EXR005", studentId: "8", classId: "3", subjectId: "5", term: "Term 1", examScore: 55, enteredBy: "TCH2019001", enteredAt: "2025-01-16T10:00:00Z" },
  { id: "EXR006", studentId: "15", classId: "3", subjectId: "5", term: "Term 1", examScore: 88, enteredBy: "TCH2019001", enteredAt: "2025-01-16T10:00:00Z" },

  // Grade 10-A (class 3) — English Literature (subject 7), Term 1
  { id: "EXR007", studentId: "1", classId: "3", subjectId: "7", term: "Term 1", examScore: 72, enteredBy: "TCH2020003", enteredAt: "2025-01-17T10:00:00Z" },
  { id: "EXR008", studentId: "8", classId: "3", subjectId: "7", term: "Term 1", examScore: 60, enteredBy: "TCH2020003", enteredAt: "2025-01-17T10:00:00Z" },
  { id: "EXR009", studentId: "15", classId: "3", subjectId: "7", term: "Term 1", examScore: 80, enteredBy: "TCH2020003", enteredAt: "2025-01-17T10:00:00Z" },

  // Grade 9-A (class 1) — Algebra (subject 1), Term 1
  { id: "EXR010", studentId: "3", classId: "1", subjectId: "1", term: "Term 1", examScore: 90, enteredBy: "TCH2021002", enteredAt: "2025-01-15T11:00:00Z" },
  { id: "EXR011", studentId: "10", classId: "1", subjectId: "1", term: "Term 1", examScore: 74, enteredBy: "TCH2021002", enteredAt: "2025-01-15T11:00:00Z" },

  // Grade 9-A (class 1) — Biology (subject 4), Term 1
  { id: "EXR012", studentId: "3", classId: "1", subjectId: "4", term: "Term 1", examScore: 82, enteredBy: "TCH2019001", enteredAt: "2025-01-16T11:00:00Z" },
  { id: "EXR013", studentId: "10", classId: "1", subjectId: "4", term: "Term 1", examScore: 65, enteredBy: "TCH2019001", enteredAt: "2025-01-16T11:00:00Z" },

  // Grade 11-A (class 5) — Calculus (subject 2), Term 1
  { id: "EXR014", studentId: "4", classId: "5", subjectId: "2", term: "Term 1", examScore: 70, enteredBy: "TCH2021002", enteredAt: "2025-01-18T10:00:00Z" },
  { id: "EXR015", studentId: "11", classId: "5", subjectId: "2", term: "Term 1", examScore: 85, enteredBy: "TCH2021002", enteredAt: "2025-01-18T10:00:00Z" },

  // Grade 12-A (class 7) — Statistics (subject 13), Term 1
  { id: "EXR016", studentId: "6", classId: "7", subjectId: "13", term: "Term 1", examScore: 76, enteredBy: "TCH2021002", enteredAt: "2025-01-19T10:00:00Z" },
  { id: "EXR017", studentId: "13", classId: "7", subjectId: "13", term: "Term 1", examScore: 88, enteredBy: "TCH2021002", enteredAt: "2025-01-19T10:00:00Z" },

  // Grade 12-A (class 7) — Environmental Science (subject 14), Term 1
  { id: "EXR018", studentId: "6", classId: "7", subjectId: "14", term: "Term 1", examScore: 62, enteredBy: "TCH2019001", enteredAt: "2025-01-19T11:00:00Z" },
  { id: "EXR019", studentId: "13", classId: "7", subjectId: "14", term: "Term 1", examScore: 91, enteredBy: "TCH2019001", enteredAt: "2025-01-19T11:00:00Z" },
];
