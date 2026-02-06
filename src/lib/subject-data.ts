import { Department, departmentConfig, teachers } from "./teacher-data";

export interface Subject {
  id: string;
  subjectId: string;
  name: string;
  code: string;
  department: Department;
  description: string;
  gradeLevel: string;
  teacherIds: string[];
  periodsPerWeek: number;
  status: "active" | "inactive";
}

// Helper to generate subject ID
export function generateSubjectId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `SUB${year}${random}`;
}

// Helper to get assigned teachers
export function getSubjectTeachers(subject: Subject) {
  return teachers.filter((t) => subject.teacherIds.includes(t.id));
}

// Helper to get teacher names as string
export function getSubjectTeacherNames(subject: Subject): string {
  const subjectTeachers = getSubjectTeachers(subject);
  if (subjectTeachers.length === 0) return "Unassigned";
  return subjectTeachers
    .map((t) => `${t.firstName} ${t.lastName}`)
    .join(", ");
}

// Status colors
export const subjectStatusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

// Export subjects to CSV
export function exportSubjectsToCSV(subjectsList: Subject[]): void {
  const headers = [
    "Subject ID",
    "Name",
    "Code",
    "Department",
    "Description",
    "Grade Level",
    "Teachers",
    "Periods/Week",
    "Status",
  ];

  const rows = subjectsList.map((subject) => [
    subject.subjectId,
    subject.name,
    subject.code,
    departmentConfig[subject.department].name,
    `"${subject.description.replace(/"/g, '""')}"`,
    subject.gradeLevel,
    `"${getSubjectTeacherNames(subject)}"`,
    subject.periodsPerWeek,
    subject.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `subjects_export_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const subjects: Subject[] = [
  {
    id: "1",
    subjectId: "SUB2025001",
    name: "Algebra",
    code: "MATH101",
    department: "mathematics",
    description: "Introduction to algebraic expressions, equations, and functions.",
    gradeLevel: "9",
    teacherIds: ["1"],
    periodsPerWeek: 5,
    status: "active",
  },
  {
    id: "2",
    subjectId: "SUB2025002",
    name: "Calculus",
    code: "MATH301",
    department: "mathematics",
    description: "Differential and integral calculus, limits, and series.",
    gradeLevel: "11",
    teacherIds: ["1"],
    periodsPerWeek: 5,
    status: "active",
  },
  {
    id: "3",
    subjectId: "SUB2025003",
    name: "Geometry",
    code: "MATH201",
    department: "mathematics",
    description: "Study of shapes, angles, transformations, and proofs.",
    gradeLevel: "10",
    teacherIds: ["8"],
    periodsPerWeek: 4,
    status: "active",
  },
  {
    id: "4",
    subjectId: "SUB2025004",
    name: "Biology",
    code: "SCI101",
    department: "science",
    description: "Study of living organisms, cells, genetics, and ecosystems.",
    gradeLevel: "9",
    teacherIds: ["2", "10"],
    periodsPerWeek: 5,
    status: "active",
  },
  {
    id: "5",
    subjectId: "SUB2025005",
    name: "Chemistry",
    code: "SCI201",
    department: "science",
    description: "Study of matter, chemical reactions, and the periodic table.",
    gradeLevel: "10",
    teacherIds: ["2"],
    periodsPerWeek: 5,
    status: "active",
  },
  {
    id: "6",
    subjectId: "SUB2025006",
    name: "Physics",
    code: "SCI301",
    department: "science",
    description: "Study of motion, energy, forces, and the laws of nature.",
    gradeLevel: "11",
    teacherIds: ["7"],
    periodsPerWeek: 5,
    status: "active",
  },
  {
    id: "7",
    subjectId: "SUB2025007",
    name: "English Literature",
    code: "ENG201",
    department: "english",
    description: "Analysis of classic and contemporary literary works.",
    gradeLevel: "10",
    teacherIds: ["3"],
    periodsPerWeek: 4,
    status: "active",
  },
  {
    id: "8",
    subjectId: "SUB2025008",
    name: "Creative Writing",
    code: "ENG301",
    department: "english",
    description: "Techniques for fiction, poetry, and non-fiction writing.",
    gradeLevel: "11",
    teacherIds: ["3"],
    periodsPerWeek: 3,
    status: "active",
  },
  {
    id: "9",
    subjectId: "SUB2025009",
    name: "World History",
    code: "HIS101",
    department: "history",
    description: "Survey of major civilizations, events, and historical themes.",
    gradeLevel: "9",
    teacherIds: ["4"],
    periodsPerWeek: 4,
    status: "active",
  },
  {
    id: "10",
    subjectId: "SUB2025010",
    name: "American History",
    code: "HIS201",
    department: "history",
    description: "History of the United States from colonization to the modern era.",
    gradeLevel: "11",
    teacherIds: ["4"],
    periodsPerWeek: 4,
    status: "active",
  },
  {
    id: "11",
    subjectId: "SUB2025011",
    name: "Visual Arts",
    code: "ART101",
    department: "arts",
    description: "Fundamentals of drawing, painting, and visual expression.",
    gradeLevel: "9",
    teacherIds: ["6"],
    periodsPerWeek: 3,
    status: "active",
  },
  {
    id: "12",
    subjectId: "SUB2025012",
    name: "Physical Education",
    code: "PE101",
    department: "physical_education",
    description: "Physical fitness, team sports, and health education.",
    gradeLevel: "9",
    teacherIds: ["5"],
    periodsPerWeek: 3,
    status: "inactive",
  },
  {
    id: "13",
    subjectId: "SUB2025013",
    name: "Statistics",
    code: "MATH401",
    department: "mathematics",
    description: "Probability, data analysis, and statistical inference.",
    gradeLevel: "12",
    teacherIds: ["1", "8"],
    periodsPerWeek: 4,
    status: "active",
  },
  {
    id: "14",
    subjectId: "SUB2025014",
    name: "Environmental Science",
    code: "SCI401",
    department: "science",
    description: "Study of ecosystems, sustainability, and environmental issues.",
    gradeLevel: "12",
    teacherIds: ["10"],
    periodsPerWeek: 4,
    status: "active",
  },
  {
    id: "15",
    subjectId: "SUB2025015",
    name: "Grammar & Composition",
    code: "ENG101",
    department: "english",
    description: "English grammar rules, sentence structure, and essay writing.",
    gradeLevel: "9",
    teacherIds: [],
    periodsPerWeek: 4,
    status: "inactive",
  },
];
