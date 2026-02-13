import { Term } from "./output-of-work-data";
import { teachers, getTeacherFullName } from "./teacher-data";
import { classes } from "./class-data";
import { subjects } from "./subject-data";

// Types
export type LessonPlanStatus = "draft" | "submitted" | "approved" | "published" | "rejected";

export interface LessonPlan {
  id: string;
  planId: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  term: Term;
  weekNumber: number;
  title: string;
  topic: string;
  description: string;
  learningObjectives: string[];
  activities: string;
  resources: string;
  assessmentMethod: string;
  status: LessonPlanStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

// Helpers
export function generatePlanId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `LP${year}${random}`;
}

export function getLessonPlanTeacherName(plan: LessonPlan): string {
  const teacher = teachers.find((t) => t.id === plan.teacherId);
  return teacher ? getTeacherFullName(teacher) : "Unknown Teacher";
}

export function getLessonPlanClassName(plan: LessonPlan): string {
  const cls = classes.find((c) => c.id === plan.classId);
  return cls?.name || "Unknown Class";
}

export function getLessonPlanSubjectName(plan: LessonPlan): string {
  const subject = subjects.find((s) => s.id === plan.subjectId);
  return subject?.name || "Unknown Subject";
}

// Status config
export const lessonPlanStatusConfig: Record<LessonPlanStatus, { label: string; color: string }> = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  submitted: {
    label: "Pending Review",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  published: {
    label: "Published",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

// CSV Export
export function exportLessonPlansToCSV(plans: LessonPlan[]): void {
  const headers = [
    "Plan ID",
    "Title",
    "Teacher",
    "Class",
    "Subject",
    "Term",
    "Week",
    "Topic",
    "Description",
    "Learning Objectives",
    "Activities",
    "Resources",
    "Assessment Method",
    "Status",
    "Created At",
    "Submitted At",
    "Approved By",
    "Approved At",
    "Rejection Reason",
  ];

  const rows = plans.map((plan) => [
    plan.planId,
    `"${plan.title.replace(/"/g, '""')}"`,
    `"${getLessonPlanTeacherName(plan)}"`,
    `"${getLessonPlanClassName(plan)}"`,
    `"${getLessonPlanSubjectName(plan)}"`,
    plan.term,
    plan.weekNumber,
    `"${plan.topic.replace(/"/g, '""')}"`,
    `"${plan.description.replace(/"/g, '""')}"`,
    `"${plan.learningObjectives.join("; ").replace(/"/g, '""')}"`,
    `"${plan.activities.replace(/"/g, '""')}"`,
    `"${plan.resources.replace(/"/g, '""')}"`,
    `"${plan.assessmentMethod.replace(/"/g, '""')}"`,
    plan.status,
    plan.createdAt,
    plan.submittedAt || "",
    plan.approvedBy || "",
    plan.approvedAt || "",
    plan.rejectionReason || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `lesson_plans_export_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Mock data
export const initialLessonPlans: LessonPlan[] = [
  {
    id: "1",
    planId: "LP20250001",
    teacherId: "1", // Robert Anderson - Mathematics
    classId: "3", // Grade 10-A
    subjectId: "1", // Algebra
    term: "Term 1",
    weekNumber: 1,
    title: "Introduction to Quadratic Equations",
    topic: "Quadratic Equations",
    description: "Students will learn the standard form of quadratic equations and explore methods for solving them, including factoring and the quadratic formula.",
    learningObjectives: [
      "Define quadratic equations and identify their standard form",
      "Solve quadratic equations by factoring",
      "Apply the quadratic formula to solve equations",
    ],
    activities: "Warm-up with review of linear equations. Direct instruction on quadratic form. Guided practice with factoring. Group activity solving real-world problems using the quadratic formula.",
    resources: "Textbook Chapter 5, graphing calculators, worksheet handouts, interactive whiteboard slides",
    assessmentMethod: "Exit ticket with 3 quadratic equations to solve. Homework assignment with 10 practice problems.",
    status: "published",
    approvedBy: "Admin User",
    approvedAt: "2025-01-08T14:00:00Z",
    createdAt: "2025-01-05T09:00:00Z",
    updatedAt: "2025-01-08T14:00:00Z",
    submittedAt: "2025-01-06T10:00:00Z",
  },
  {
    id: "2",
    planId: "LP20250002",
    teacherId: "2", // Sarah Mitchell - Science
    classId: "3", // Grade 10-A
    subjectId: "5", // Chemistry
    term: "Term 1",
    weekNumber: 2,
    title: "Chemical Bonding Fundamentals",
    topic: "Chemical Bonding",
    description: "Introduction to ionic, covalent, and metallic bonds. Students will explore electron sharing and transfer through models and lab demonstrations.",
    learningObjectives: [
      "Distinguish between ionic, covalent, and metallic bonds",
      "Draw Lewis dot structures for simple molecules",
      "Predict bond types based on electronegativity differences",
    ],
    activities: "Video introduction to bonding types. Interactive simulation of electron transfer. Lab demonstration with salt crystal formation. Pair work on Lewis structures.",
    resources: "Chemistry lab equipment, molecular model kits, PhET simulations, textbook Chapter 8",
    assessmentMethod: "Lab report on bonding demonstration. Quiz on bond types at end of week.",
    status: "approved",
    approvedBy: "Admin User",
    approvedAt: "2025-01-15T11:30:00Z",
    createdAt: "2025-01-10T08:30:00Z",
    updatedAt: "2025-01-15T11:30:00Z",
    submittedAt: "2025-01-12T09:00:00Z",
  },
  {
    id: "3",
    planId: "LP20250003",
    teacherId: "3", // Michael Thompson - English
    classId: "1", // Grade 9-A
    subjectId: "7", // English Literature
    term: "Term 1",
    weekNumber: 3,
    title: "Analyzing Shakespeare's Sonnets",
    topic: "Shakespearean Poetry",
    description: "Students will read and analyze selected sonnets by William Shakespeare, focusing on themes of love, time, and beauty. Emphasis on literary devices and poetic structure.",
    learningObjectives: [
      "Identify the structure of a Shakespearean sonnet",
      "Analyze literary devices such as metaphor, personification, and alliteration",
      "Interpret themes in Shakespeare's sonnets",
      "Write a short analytical paragraph about a chosen sonnet",
    ],
    activities: "Dramatic reading of Sonnet 18. Class discussion on themes. Small group analysis of assigned sonnets. Individual writing exercise.",
    resources: "The Complete Sonnets of Shakespeare, annotation worksheets, projector for text display",
    assessmentMethod: "Written analysis paragraph (200-300 words). Peer review session.",
    status: "submitted",
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-01-20T08:00:00Z",
    submittedAt: "2025-01-20T08:00:00Z",
  },
  {
    id: "4",
    planId: "LP20250004",
    teacherId: "1", // Robert Anderson - Mathematics
    classId: "3", // Grade 10-A
    subjectId: "1", // Algebra
    term: "Term 1",
    weekNumber: 4,
    title: "Graphing Quadratic Functions",
    topic: "Quadratic Functions and Parabolas",
    description: "Building on the quadratic equations unit, students will learn to graph parabolas and identify key features including vertex, axis of symmetry, and intercepts.",
    learningObjectives: [
      "Graph quadratic functions using a table of values",
      "Identify the vertex, axis of symmetry, and intercepts of a parabola",
      "Transform quadratic functions using vertex form",
    ],
    activities: "Desmos exploration activity. Teacher-led graphing demonstration. Partner graphing challenge. Gallery walk of completed graphs.",
    resources: "Desmos graphing tool, graph paper, colored pencils, textbook Chapter 6",
    assessmentMethod: "Graphing portfolio with 5 quadratic functions. Class participation rubric.",
    status: "draft",
    createdAt: "2025-01-22T11:00:00Z",
    updatedAt: "2025-01-22T11:00:00Z",
  },
  {
    id: "5",
    planId: "LP20250005",
    teacherId: "4", // Jennifer Garcia - History
    classId: "5", // Grade 11-A
    subjectId: "9", // World History
    term: "Term 1",
    weekNumber: 2,
    title: "The French Revolution: Causes and Consequences",
    topic: "The French Revolution",
    description: "Examination of the political, social, and economic factors that led to the French Revolution and its lasting impact on modern governance.",
    learningObjectives: [
      "Identify the key causes of the French Revolution",
      "Analyze the role of Enlightenment ideas in revolutionary movements",
      "Evaluate the short-term and long-term consequences of the revolution",
    ],
    activities: "Timeline construction activity. Primary source analysis of the Declaration of the Rights of Man. Debate on whether the revolution was justified. Documentary viewing with guided questions.",
    resources: "Primary source documents, timeline materials, documentary: 'The French Revolution', textbook Chapter 12",
    assessmentMethod: "Source analysis essay (500 words). Timeline accuracy check. Debate participation rubric.",
    status: "published",
    approvedBy: "Admin User",
    approvedAt: "2025-01-10T16:00:00Z",
    createdAt: "2025-01-04T13:00:00Z",
    updatedAt: "2025-01-10T16:00:00Z",
    submittedAt: "2025-01-07T09:30:00Z",
  },
  {
    id: "6",
    planId: "LP20250006",
    teacherId: "8", // Amanda Davis - Mathematics
    classId: "4", // Grade 10-B
    subjectId: "3", // Geometry
    term: "Term 1",
    weekNumber: 5,
    title: "Properties of Triangles",
    topic: "Triangle Geometry",
    description: "Students explore different types of triangles, the triangle inequality theorem, and basic congruence postulates (SSS, SAS, ASA).",
    learningObjectives: [
      "Classify triangles by sides and angles",
      "Apply the triangle inequality theorem",
      "Prove triangle congruence using SSS, SAS, and ASA postulates",
    ],
    activities: "Hands-on triangle construction with rulers and protractors. Discovery activity on triangle inequality. Proof-writing workshop in pairs.",
    resources: "Rulers, protractors, compasses, geometry software (GeoGebra), textbook Chapter 4",
    assessmentMethod: "Triangle classification quiz. Congruence proof homework set.",
    status: "submitted",
    createdAt: "2025-01-25T09:00:00Z",
    updatedAt: "2025-01-27T07:30:00Z",
    submittedAt: "2025-01-27T07:30:00Z",
  },
  {
    id: "7",
    planId: "LP20250007",
    teacherId: "7", // Christopher Martinez - Science
    classId: "6", // Grade 11-B
    subjectId: "6", // Physics
    term: "Term 2",
    weekNumber: 1,
    title: "Newton's Laws of Motion",
    topic: "Classical Mechanics",
    description: "Introduction to Newton's three laws of motion with real-world applications and laboratory experiments.",
    learningObjectives: [
      "State and explain Newton's three laws of motion",
      "Calculate net force and acceleration using F=ma",
      "Apply Newton's laws to solve real-world physics problems",
    ],
    activities: "Egg drop experiment for inertia. Force and acceleration lab with dynamics carts. Problem-solving stations. Video analysis of motion.",
    resources: "Dynamics carts, force sensors, eggs, padding materials, video analysis software, textbook Chapter 3",
    assessmentMethod: "Lab report on dynamics cart experiment. Problem set on Newton's laws.",
    status: "rejected",
    rejectionReason: "Please include differentiated activities for students who need additional support. Also add a formative assessment checkpoint mid-week.",
    createdAt: "2025-01-28T14:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z",
    submittedAt: "2025-01-30T08:00:00Z",
  },
  {
    id: "8",
    planId: "LP20250008",
    teacherId: "2", // Sarah Mitchell - Science
    classId: "7", // Grade 12-A
    subjectId: "4", // Biology
    term: "Term 1",
    weekNumber: 6,
    title: "Cell Division: Mitosis and Meiosis",
    topic: "Cell Division",
    description: "Comparative study of mitosis and meiosis, including the stages, significance, and role in growth, repair, and reproduction.",
    learningObjectives: [
      "Describe the stages of mitosis and meiosis",
      "Compare and contrast mitosis and meiosis",
      "Explain the significance of cell division in organisms",
    ],
    activities: "Microscope lab observing onion root tip cells. Mitosis flip-book animation project. Meiosis card sort activity. Venn diagram comparison exercise.",
    resources: "Microscopes, prepared slides, colored pencils, flip-book materials, textbook Chapter 10",
    assessmentMethod: "Microscope lab practical assessment. Flip-book project rubric. Written comparison essay.",
    status: "approved",
    approvedBy: "Admin User",
    approvedAt: "2025-02-03T09:00:00Z",
    createdAt: "2025-01-28T10:00:00Z",
    updatedAt: "2025-02-03T09:00:00Z",
    submittedAt: "2025-02-01T08:00:00Z",
  },
  {
    id: "9",
    planId: "LP20250009",
    teacherId: "1", // Robert Anderson - Mathematics
    classId: "3", // Grade 10-A
    subjectId: "1", // Algebra
    term: "Term 2",
    weekNumber: 1,
    title: "Systems of Linear Equations",
    topic: "Systems of Equations",
    description: "Students will learn to solve systems of linear equations using substitution, elimination, and graphing methods.",
    learningObjectives: [
      "Solve systems of equations by substitution",
      "Solve systems of equations by elimination",
      "Graph systems of equations and identify solutions",
      "Determine whether a system has one, no, or infinite solutions",
    ],
    activities: "Graphing warm-up activity. Guided notes on substitution method. Elimination method stations. Real-world application word problems.",
    resources: "Graphing calculators, coordinate plane worksheets, textbook Chapter 7",
    assessmentMethod: "Method comparison worksheet. End-of-week quiz on all three methods.",
    status: "draft",
    createdAt: "2025-02-05T09:00:00Z",
    updatedAt: "2025-02-05T09:00:00Z",
  },
  {
    id: "10",
    planId: "LP20250010",
    teacherId: "6", // Emily Brown - Arts
    classId: "8", // Grade 12-B
    subjectId: "11", // Visual Arts
    term: "Term 1",
    weekNumber: 3,
    title: "Color Theory and Composition",
    topic: "Color Theory",
    description: "Students explore color theory principles including the color wheel, complementary colors, warm and cool palettes, and their application in composition.",
    learningObjectives: [
      "Identify primary, secondary, and tertiary colors",
      "Apply complementary and analogous color schemes in artwork",
      "Demonstrate understanding of warm and cool color palettes",
    ],
    activities: "Color wheel painting exercise. Complementary color still life. Digital palette creation using Adobe Color. Gallery critique of famous paintings and their color usage.",
    resources: "Acrylic paints, canvases, color wheel charts, Adobe Color (digital), art history reference books",
    assessmentMethod: "Color wheel project rubric. Still life painting assessment. Written reflection on color choices.",
    status: "published",
    approvedBy: "Admin User",
    approvedAt: "2025-01-12T15:00:00Z",
    createdAt: "2025-01-06T11:00:00Z",
    updatedAt: "2025-01-12T15:00:00Z",
    submittedAt: "2025-01-09T08:00:00Z",
  },
];
