"use client";

import { useState, useMemo } from "react";
import { AttendanceRecord, AttendanceStatus } from "@/lib/attendance-data";
import { students, getFullName } from "@/lib/student-data";
import { classes } from "@/lib/class-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttendanceFormProps {
  record?: AttendanceRecord;
  onSubmit: (data: Omit<AttendanceRecord, "id" | "markedAt">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AttendanceForm({
  record,
  onSubmit,
  onCancel,
  isSubmitting,
}: AttendanceFormProps) {
  const isEditing = !!record;

  const [formData, setFormData] = useState({
    classId: record?.classId || "",
    studentId: record?.studentId || "",
    date: record?.date || new Date().toISOString().split("T")[0],
    status: record?.status || ("present" as AttendanceStatus),
    notes: record?.notes || "",
    markedBy: record?.markedBy || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filter students by selected class
  const availableStudents = useMemo(() => {
    if (!formData.classId) return [];
    const selectedClass = classes.find((c) => c.id === formData.classId);
    if (!selectedClass) return [];
    return students.filter((s) => selectedClass.studentIds.includes(s.id));
  }, [formData.classId]);

  // Reset studentId when class changes (only in add mode)
  const handleClassChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      classId: value,
      ...(isEditing ? {} : { studentId: "" }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<AttendanceRecord, "id" | "markedAt">);
  };

  // Resolve names for read-only display in edit mode
  const editClassName = useMemo(() => {
    if (!isEditing) return "";
    const cls = classes.find((c) => c.id === record?.classId);
    return cls?.name || "";
  }, [isEditing, record?.classId]);

  const editStudentName = useMemo(() => {
    if (!isEditing) return "";
    const student = students.find((s) => s.id === record?.studentId);
    return student ? getFullName(student) : "";
  }, [isEditing, record?.studentId]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Class */}
      <div className="space-y-2">
        <Label htmlFor="classId">Class *</Label>
        {isEditing ? (
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 py-1 text-sm">
            {editClassName}
          </div>
        ) : (
          <Select value={formData.classId} onValueChange={handleClassChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes
                .filter((c) => c.status === "active")
                .map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Student */}
      <div className="space-y-2">
        <Label htmlFor="studentId">Student *</Label>
        {isEditing ? (
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 py-1 text-sm">
            {editStudentName}
          </div>
        ) : (
          <Select
            value={formData.studentId}
            onValueChange={(value) => handleChange("studentId", value)}
            disabled={!formData.classId}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  formData.classId
                    ? "Select student"
                    : "Select a class first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableStudents.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {getFullName(student)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="excused">Excused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Marked By */}
      <div className="space-y-2">
        <Label htmlFor="markedBy">Marked By *</Label>
        <Input
          id="markedBy"
          value={formData.markedBy}
          onChange={(e) => handleChange("markedBy", e.target.value)}
          placeholder="Teacher name"
          required
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Optional notes..."
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : record
              ? "Update Record"
              : "Mark Attendance"}
        </Button>
      </div>
    </form>
  );
}
