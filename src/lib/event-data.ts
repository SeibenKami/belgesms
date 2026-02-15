export type EventType =
  | "holiday"
  | "examination"
  | "vacation"
  | "sports"
  | "meeting"
  | "cultural"
  | "other";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type TargetAudience = "all" | "students" | "teachers" | "parents";

export interface SchoolEvent {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  targetAudience: TargetAudience;
  isRecurring: boolean;
  description: string;
  notes?: string;
  createdAt: string;
}

// Type display config
export const eventTypeConfig: Record<
  EventType,
  { label: string; color: string }
> = {
  holiday: {
    label: "Holiday",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  examination: {
    label: "Examination",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  vacation: {
    label: "Vacation",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  sports: {
    label: "Sports",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  meeting: {
    label: "Meeting",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  cultural: {
    label: "Cultural",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  other: {
    label: "Other",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
};

// Status display config
export const eventStatusConfig: Record<
  EventStatus,
  { label: string; color: string }
> = {
  upcoming: {
    label: "Upcoming",
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

// Generate event ID
export function generateEventId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `EVT${year}${random}`;
}

// Export events to CSV
export function exportEventsToCSV(events: SchoolEvent[]): void {
  const headers = [
    "ID",
    "Title",
    "Type",
    "Status",
    "Start Date",
    "End Date",
    "Location",
    "Organizer",
    "Target Audience",
    "Recurring",
    "Description",
    "Notes",
    "Created At",
  ];

  const rows = events.map((event) => [
    event.id,
    `"${event.title.replace(/"/g, '""')}"`,
    event.type,
    event.status,
    event.startDate,
    event.endDate,
    `"${event.location.replace(/"/g, '""')}"`,
    `"${event.organizer.replace(/"/g, '""')}"`,
    event.targetAudience,
    event.isRecurring ? "Yes" : "No",
    `"${event.description.replace(/"/g, '""')}"`,
    `"${(event.notes || "").replace(/"/g, '""')}"`,
    event.createdAt,
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
    `events_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Mock events
export const initialEvents: SchoolEvent[] = [
  {
    id: "EVT20250001",
    title: "Christmas Break",
    type: "holiday",
    status: "completed",
    startDate: "2024-12-20",
    endDate: "2025-01-06",
    location: "School-wide",
    organizer: "Administration",
    targetAudience: "all",
    isRecurring: true,
    description:
      "Annual Christmas and New Year holiday break for all students and staff.",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    id: "EVT20250002",
    title: "Easter Holiday",
    type: "holiday",
    status: "completed",
    startDate: "2025-04-18",
    endDate: "2025-04-21",
    location: "School-wide",
    organizer: "Administration",
    targetAudience: "all",
    isRecurring: true,
    description: "Easter holiday weekend for all students and staff.",
    createdAt: "2024-09-01T10:30:00Z",
  },
  {
    id: "EVT20250003",
    title: "Mid-Term Examinations",
    type: "examination",
    status: "completed",
    startDate: "2025-03-10",
    endDate: "2025-03-14",
    location: "Examination Hall",
    organizer: "Academic Department",
    targetAudience: "students",
    isRecurring: true,
    description:
      "Mid-term examinations covering all subjects for grades 9 through 12.",
    notes: "Students must arrive 30 minutes before exam start time.",
    createdAt: "2025-01-15T09:00:00Z",
  },
  {
    id: "EVT20250004",
    title: "Final Examinations",
    type: "examination",
    status: "upcoming",
    startDate: "2025-06-16",
    endDate: "2025-06-27",
    location: "Examination Hall",
    organizer: "Academic Department",
    targetAudience: "students",
    isRecurring: true,
    description:
      "End-of-year final examinations for all grades. Results determine promotion.",
    notes: "Exam timetable will be posted two weeks in advance.",
    createdAt: "2025-02-01T09:00:00Z",
  },
  {
    id: "EVT20250005",
    title: "Summer Vacation",
    type: "vacation",
    status: "upcoming",
    startDate: "2025-07-01",
    endDate: "2025-09-01",
    location: "School-wide",
    organizer: "Administration",
    targetAudience: "all",
    isRecurring: true,
    description:
      "Two-month summer vacation. School reopens in September for the new academic year.",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "EVT20250006",
    title: "Annual Sports Day",
    type: "sports",
    status: "upcoming",
    startDate: "2025-05-15",
    endDate: "2025-05-15",
    location: "School Sports Ground",
    organizer: "Physical Education Department",
    targetAudience: "all",
    isRecurring: true,
    description:
      "Annual inter-house sports competition featuring track and field events, team sports, and award ceremonies.",
    notes: "Parents are welcome to attend. Refreshments will be provided.",
    createdAt: "2025-02-10T11:00:00Z",
  },
  {
    id: "EVT20250007",
    title: "Parent-Teacher Meeting",
    type: "meeting",
    status: "upcoming",
    startDate: "2025-05-24",
    endDate: "2025-05-24",
    location: "School Auditorium",
    organizer: "Administration",
    targetAudience: "parents",
    isRecurring: true,
    description:
      "Quarterly parent-teacher meeting to discuss student progress and upcoming academic plans.",
    createdAt: "2025-03-01T10:00:00Z",
  },
  {
    id: "EVT20250008",
    title: "Cultural Festival",
    type: "cultural",
    status: "upcoming",
    startDate: "2025-04-25",
    endDate: "2025-04-26",
    location: "School Auditorium & Grounds",
    organizer: "Arts & Culture Committee",
    targetAudience: "all",
    isRecurring: true,
    description:
      "Two-day cultural festival featuring performances, art exhibitions, food stalls, and creative competitions.",
    notes:
      "Students can sign up for performances through their class teachers.",
    createdAt: "2025-02-15T14:00:00Z",
  },
  {
    id: "EVT20250009",
    title: "Science Fair",
    type: "cultural",
    status: "ongoing",
    startDate: "2025-05-02",
    endDate: "2025-05-03",
    location: "Science Laboratory & Hall",
    organizer: "Science Department",
    targetAudience: "students",
    isRecurring: true,
    description:
      "Annual science fair showcasing student projects and experiments. Judges from local universities will evaluate entries.",
    notes: "Project submissions due by April 25th.",
    createdAt: "2025-02-20T09:00:00Z",
  },
  {
    id: "EVT20250010",
    title: "Teacher Training Day",
    type: "meeting",
    status: "cancelled",
    startDate: "2025-04-10",
    endDate: "2025-04-10",
    location: "Conference Room",
    organizer: "Human Resources",
    targetAudience: "teachers",
    isRecurring: false,
    description:
      "Professional development workshop on modern teaching methodologies and digital classroom tools.",
    notes: "Rescheduled to a later date due to scheduling conflicts.",
    createdAt: "2025-03-05T08:00:00Z",
  },
];
