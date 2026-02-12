// Types
export type AssessmentComponent = "classWork" | "homeWork" | "quiz" | "project";
export type Term = "Term 1" | "Term 2" | "Term 3";

export interface ComponentConfig {
  key: AssessmentComponent;
  label: string;
  requiredAssessments: number;
  maxScore: number;
}

export interface TermConfig {
  academicYear: string;
  term: Term;
  components: ComponentConfig[];
}

export interface AssessmentScore {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  term: Term;
  component: AssessmentComponent;
  assessmentNumber: number;
  score: number;
  maxScore: number;
  enteredBy: string;
  enteredAt: string;
}

// Config constants
export const componentLabels: Record<AssessmentComponent, string> = {
  classWork: "Class Work",
  homeWork: "Home Work",
  quiz: "Quiz",
  project: "Project",
};

export const terms: Term[] = ["Term 1", "Term 2", "Term 3"];

export const defaultTermConfig: TermConfig = {
  academicYear: "2024-2025",
  term: "Term 1",
  components: [
    { key: "classWork", label: "Class Work", requiredAssessments: 4, maxScore: 10 },
    { key: "homeWork", label: "Home Work", requiredAssessments: 4, maxScore: 10 },
    { key: "quiz", label: "Quiz", requiredAssessments: 2, maxScore: 10 },
    { key: "project", label: "Project", requiredAssessments: 1, maxScore: 10 },
  ],
};

// Helpers
export function generateScoreId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `SCR${year}${random}`;
}

export function getComponentAverage(
  studentId: string,
  subjectId: string,
  term: Term,
  component: AssessmentComponent,
  scores: AssessmentScore[]
): number {
  const componentScores = scores.filter(
    (s) =>
      s.studentId === studentId &&
      s.subjectId === subjectId &&
      s.term === term &&
      s.component === component
  );
  if (componentScores.length === 0) return 0;
  const total = componentScores.reduce((sum, s) => sum + s.score, 0);
  return Math.round((total / componentScores.length) * 100) / 100;
}

export function getStudentSummary(
  studentId: string,
  subjectId: string,
  term: Term,
  scores: AssessmentScore[],
  config: TermConfig
): {
  classWork: number;
  homeWork: number;
  quiz: number;
  project: number;
  total: number;
  percentage: number;
} {
  const classWork = getComponentAverage(studentId, subjectId, term, "classWork", scores);
  const homeWork = getComponentAverage(studentId, subjectId, term, "homeWork", scores);
  const quiz = getComponentAverage(studentId, subjectId, term, "quiz", scores);
  const project = getComponentAverage(studentId, subjectId, term, "project", scores);

  const total = Math.round((classWork + homeWork + quiz + project) * 100) / 100;
  const maxTotal = config.components.reduce((sum, c) => sum + c.maxScore, 0);
  const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100 * 100) / 100 : 0;

  return { classWork, homeWork, quiz, project, total, percentage };
}

export function exportSummaryToCSV(
  summaryData: {
    studentName: string;
    classWork: number;
    homeWork: number;
    quiz: number;
    project: number;
    total: number;
    percentage: number;
  }[],
  className: string,
  subjectName: string,
  term: Term
): void {
  const headers = [
    "Student Name",
    "Class Work Avg",
    "Home Work Avg",
    "Quiz Avg",
    "Project Avg",
    "Total",
    "Percentage (%)",
  ];

  const rows = summaryData.map((row) => [
    `"${row.studentName}"`,
    row.classWork,
    row.homeWork,
    row.quiz,
    row.project,
    row.total,
    row.percentage,
  ]);

  const csvContent = [
    `Output of Work Summary - ${className} - ${subjectName} - ${term}`,
    "",
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `output_of_work_${className.replace(/\s+/g, "_")}_${subjectName.replace(/\s+/g, "_")}_${term.replace(/\s+/g, "_")}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Mock data - ~30 scores for Grade 10-A (class id "3", students 1/8/15)
// Geometry (subject id "3") and Chemistry (subject id "5"), Term 1
export const initialScores: AssessmentScore[] = [
  // Geometry - Class Work - Student 1 (Emma Wilson)
  { id: "SCR202501", studentId: "1", classId: "3", subjectId: "3", term: "Term 1", component: "classWork", assessmentNumber: 1, score: 8, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-01T09:00:00Z" },
  { id: "SCR202502", studentId: "1", classId: "3", subjectId: "3", term: "Term 1", component: "classWork", assessmentNumber: 2, score: 9, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-08T09:00:00Z" },
  { id: "SCR202503", studentId: "1", classId: "3", subjectId: "3", term: "Term 1", component: "classWork", assessmentNumber: 3, score: 7, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-15T09:00:00Z" },
  { id: "SCR202504", studentId: "1", classId: "3", subjectId: "3", term: "Term 1", component: "homeWork", assessmentNumber: 1, score: 9, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-02T09:00:00Z" },
  { id: "SCR202505", studentId: "1", classId: "3", subjectId: "3", term: "Term 1", component: "homeWork", assessmentNumber: 2, score: 8, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-09T09:00:00Z" },
  { id: "SCR202506", studentId: "1", classId: "3", subjectId: "3", term: "Term 1", component: "quiz", assessmentNumber: 1, score: 9, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-20T09:00:00Z" },
  { id: "SCR202507", studentId: "1", classId: "3", subjectId: "3", term: "Term 1", component: "project", assessmentNumber: 1, score: 10, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-11-01T09:00:00Z" },

  // Geometry - Class Work - Student 8 (William Lee)
  { id: "SCR202508", studentId: "8", classId: "3", subjectId: "3", term: "Term 1", component: "classWork", assessmentNumber: 1, score: 7, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-01T09:00:00Z" },
  { id: "SCR202509", studentId: "8", classId: "3", subjectId: "3", term: "Term 1", component: "classWork", assessmentNumber: 2, score: 6, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-08T09:00:00Z" },
  { id: "SCR202510", studentId: "8", classId: "3", subjectId: "3", term: "Term 1", component: "classWork", assessmentNumber: 3, score: 8, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-15T09:00:00Z" },
  { id: "SCR202511", studentId: "8", classId: "3", subjectId: "3", term: "Term 1", component: "homeWork", assessmentNumber: 1, score: 6, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-02T09:00:00Z" },
  { id: "SCR202512", studentId: "8", classId: "3", subjectId: "3", term: "Term 1", component: "homeWork", assessmentNumber: 2, score: 7, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-09T09:00:00Z" },
  { id: "SCR202513", studentId: "8", classId: "3", subjectId: "3", term: "Term 1", component: "quiz", assessmentNumber: 1, score: 7, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-20T09:00:00Z" },
  { id: "SCR202514", studentId: "8", classId: "3", subjectId: "3", term: "Term 1", component: "project", assessmentNumber: 1, score: 8, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-11-01T09:00:00Z" },

  // Geometry - Student 15 (Amelia Clark)
  { id: "SCR202515", studentId: "15", classId: "3", subjectId: "3", term: "Term 1", component: "classWork", assessmentNumber: 1, score: 9, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-01T09:00:00Z" },
  { id: "SCR202516", studentId: "15", classId: "3", subjectId: "3", term: "Term 1", component: "classWork", assessmentNumber: 2, score: 10, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-08T09:00:00Z" },
  { id: "SCR202517", studentId: "15", classId: "3", subjectId: "3", term: "Term 1", component: "homeWork", assessmentNumber: 1, score: 10, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-02T09:00:00Z" },
  { id: "SCR202518", studentId: "15", classId: "3", subjectId: "3", term: "Term 1", component: "quiz", assessmentNumber: 1, score: 8, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-10-20T09:00:00Z" },
  { id: "SCR202519", studentId: "15", classId: "3", subjectId: "3", term: "Term 1", component: "project", assessmentNumber: 1, score: 9, maxScore: 10, enteredBy: "TCH2021002", enteredAt: "2024-11-01T09:00:00Z" },

  // Chemistry - Student 1 (Emma Wilson)
  { id: "SCR202520", studentId: "1", classId: "3", subjectId: "5", term: "Term 1", component: "classWork", assessmentNumber: 1, score: 9, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-01T10:00:00Z" },
  { id: "SCR202521", studentId: "1", classId: "3", subjectId: "5", term: "Term 1", component: "classWork", assessmentNumber: 2, score: 8, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-08T10:00:00Z" },
  { id: "SCR202522", studentId: "1", classId: "3", subjectId: "5", term: "Term 1", component: "homeWork", assessmentNumber: 1, score: 7, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-02T10:00:00Z" },
  { id: "SCR202523", studentId: "1", classId: "3", subjectId: "5", term: "Term 1", component: "quiz", assessmentNumber: 1, score: 8, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-20T10:00:00Z" },
  { id: "SCR202524", studentId: "1", classId: "3", subjectId: "5", term: "Term 1", component: "project", assessmentNumber: 1, score: 9, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-11-01T10:00:00Z" },

  // Chemistry - Student 8 (William Lee)
  { id: "SCR202525", studentId: "8", classId: "3", subjectId: "5", term: "Term 1", component: "classWork", assessmentNumber: 1, score: 6, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-01T10:00:00Z" },
  { id: "SCR202526", studentId: "8", classId: "3", subjectId: "5", term: "Term 1", component: "classWork", assessmentNumber: 2, score: 7, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-08T10:00:00Z" },
  { id: "SCR202527", studentId: "8", classId: "3", subjectId: "5", term: "Term 1", component: "homeWork", assessmentNumber: 1, score: 8, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-02T10:00:00Z" },
  { id: "SCR202528", studentId: "8", classId: "3", subjectId: "5", term: "Term 1", component: "quiz", assessmentNumber: 1, score: 5, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-20T10:00:00Z" },
  { id: "SCR202529", studentId: "8", classId: "3", subjectId: "5", term: "Term 1", component: "project", assessmentNumber: 1, score: 7, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-11-01T10:00:00Z" },

  // Chemistry - Student 15 (Amelia Clark)
  { id: "SCR202530", studentId: "15", classId: "3", subjectId: "5", term: "Term 1", component: "classWork", assessmentNumber: 1, score: 10, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-01T10:00:00Z" },
  { id: "SCR202531", studentId: "15", classId: "3", subjectId: "5", term: "Term 1", component: "homeWork", assessmentNumber: 1, score: 9, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-02T10:00:00Z" },
  { id: "SCR202532", studentId: "15", classId: "3", subjectId: "5", term: "Term 1", component: "quiz", assessmentNumber: 1, score: 9, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-10-20T10:00:00Z" },
  { id: "SCR202533", studentId: "15", classId: "3", subjectId: "5", term: "Term 1", component: "project", assessmentNumber: 1, score: 10, maxScore: 10, enteredBy: "TCH2019001", enteredAt: "2024-11-01T10:00:00Z" },
];
