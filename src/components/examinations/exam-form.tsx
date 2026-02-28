"use client";

import { useState, useMemo } from "react";
import {
  Examination,
  ExamPeriod,
  ExamStatus,
  examPeriodConfig,
  examStatusConfig,
} from "@/lib/examination-data";
import { classes } from "@/lib/class-data";
import { subjects } from "@/lib/subject-data";
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
import { Upload } from "lucide-react";

interface ExamFormProps {
  exam?: Examination;
  onSubmit: (data: Omit<Examination, "id" | "createdAt">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ExamForm({
  exam,
  onSubmit,
  onCancel,
  isSubmitting,
}: ExamFormProps) {
  const [formData, setFormData] = useState({
    title: exam?.title || "",
    type: exam?.type || ("mid_semester" as ExamPeriod),
    classId: exam?.classId || "",
    className: exam?.className || "",
    subjectId: exam?.subjectId || "",
    subject: exam?.subject || "",
    date: exam?.date || new Date().toISOString().split("T")[0],
    startTime: exam?.startTime || "08:00",
    endTime: exam?.endTime || "10:00",
    duration: exam?.duration || 120,
    totalStudents: exam?.totalStudents || 0,
    status: exam?.status || ("scheduled" as ExamStatus),
    documentUrl: exam?.documentUrl || (null as string | null),
    documentName: exam?.documentName || (null as string | null),
    uploadedBy: exam?.uploadedBy || (null as string | null),
    uploadedAt: exam?.uploadedAt || (null as string | null),
  });

  const handleChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get the selected class
  const selectedClass = useMemo(() => {
    return classes.find((c) => c.id === formData.classId);
  }, [formData.classId]);

  // Filter subjects by the selected class's grade level
  const filteredSubjects = useMemo(() => {
    if (!selectedClass) return [];
    return subjects.filter(
      (s) => s.gradeLevel === selectedClass.grade && s.status === "active"
    );
  }, [selectedClass]);

  // Handle class selection
  const handleClassChange = (classId: string) => {
    const cls = classes.find((c) => c.id === classId);
    if (cls) {
      setFormData((prev) => ({
        ...prev,
        classId: cls.id,
        className: cls.name,
        totalStudents: cls.studentIds.length,
        subjectId: "",
        subject: "",
      }));
    }
  };

  // Handle subject selection
  const handleSubjectChange = (subjectId: string) => {
    const sub = subjects.find((s) => s.id === subjectId);
    if (sub) {
      setFormData((prev) => ({
        ...prev,
        subjectId: sub.id,
        subject: sub.name,
      }));
    }
  };

  // Auto-calculate duration when times change
  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    const updated = { ...formData, [field]: value };
    if (updated.startTime && updated.endTime) {
      const [sh, sm] = updated.startTime.split(":").map(Number);
      const [eh, em] = updated.endTime.split(":").map(Number);
      const duration = (eh * 60 + em) - (sh * 60 + sm);
      updated.duration = duration > 0 ? duration : 0;
    }
    setFormData(updated);
  };

  // Handle document upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        documentUrl: reader.result as string,
        documentName: file.name,
        uploadedBy: "Current User",
        uploadedAt: new Date().toISOString(),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Examination, "id" | "createdAt">);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Exam title"
          required
        />
      </div>

      {/* Type & Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Exam Period *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(examPeriodConfig) as ExamPeriod[]).map((type) => (
                <SelectItem key={type} value={type}>
                  {examPeriodConfig[type].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
              {(Object.keys(examStatusConfig) as ExamStatus[]).map((status) => (
                <SelectItem key={status} value={status}>
                  {examStatusConfig[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Class & Subject */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="class">Class *</Label>
          <Select
            value={formData.classId}
            onValueChange={handleClassChange}
          >
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Select
            value={formData.subjectId}
            onValueChange={handleSubjectChange}
            disabled={!formData.classId}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  formData.classId
                    ? "Select subject"
                    : "Select a class first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredSubjects.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Total Students (read-only) */}
      {formData.classId && (
        <div className="space-y-2">
          <Label>Total Students</Label>
          <Input
            value={formData.totalStudents}
            readOnly
            className="bg-muted"
          />
        </div>
      )}

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Exam Date *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
        />
      </div>

      {/* Start Time & End Time */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleTimeChange("startTime", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleTimeChange("endTime", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Duration (min)</Label>
          <Input
            value={formData.duration}
            readOnly
            className="bg-muted"
          />
        </div>
      </div>

      {/* Document Upload */}
      <div className="space-y-2">
        <Label>Exam Document</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("exam-doc-upload")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {formData.documentName ? "Change File" : "Upload File"}
          </Button>
          <input
            id="exam-doc-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          {formData.documentName && (
            <span className="text-sm text-muted-foreground">
              {formData.documentName}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : exam
              ? "Update Exam"
              : "Create Exam"}
        </Button>
      </div>
    </form>
  );
}
