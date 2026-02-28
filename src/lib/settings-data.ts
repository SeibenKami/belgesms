export type Theme = "light" | "dark" | "system";

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  attendanceAlerts: boolean;
  gradeUpdates: boolean;
  eventReminders: boolean;
}

export interface SystemSettings {
  schoolName: string;
  schoolPhone: string;
  schoolEmail: string;
  schoolAddress: string;
  academicYear: string;
  currentTerm: string;
  principalName: string;
  motto: string;
}

export const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false,
  attendanceAlerts: true,
  gradeUpdates: true,
  eventReminders: true,
};

export const defaultSystemSettings: SystemSettings = {
  schoolName: "Belge International School",
  schoolPhone: "+233 24 000 0000",
  schoolEmail: "info@belgeschool.com",
  schoolAddress: "123 Education Street, Accra",
  academicYear: "2025-2026",
  currentTerm: "1",
  principalName: "Dr. Kwame Mensah",
  motto: "Excellence in Education",
};
