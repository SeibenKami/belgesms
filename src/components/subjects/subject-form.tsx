"use client";

import { useState } from "react";
import { Subject } from "@/lib/subject-data";
import { Department, departmentConfig, teachers, getTeacherFullName } from "@/lib/teacher-data";
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
import { Checkbox } from "@/components/ui/checkbox";

interface SubjectFormProps {
  subject?: Subject;
  onSubmit: (data: Omit<Subject, "id" | "subjectId">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SubjectForm({
  subject,
  onSubmit,
  onCancel,
  isSubmitting,
}: SubjectFormProps) {
  const [formData, setFormData] = useState({
    name: subject?.name || "",
    code: subject?.code || "",
    department: subject?.department || ("" as Department),
    description: subject?.description || "",
    gradeLevel: subject?.gradeLevel || "",
    teacherIds: subject?.teacherIds || ([] as string[]),
    periodsPerWeek: subject?.periodsPerWeek || 4,
    status: subject?.status || "active",
  });

  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTeacherToggle = (teacherId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      teacherIds: checked
        ? [...prev.teacherIds, teacherId]
        : prev.teacherIds.filter((id) => id !== teacherId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Subject, "id" | "subjectId">);
  };

  // Filter teachers by selected department
  const departmentTeachers = formData.department
    ? teachers.filter((t) => t.department === formData.department && t.status === "active")
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subject ID - Read-only, shown only when editing */}
      {subject?.subjectId && (
        <div className="space-y-2">
          <Label>Subject ID</Label>
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 py-1 text-sm">
            {subject.subjectId}
          </div>
          <p className="text-xs text-muted-foreground">
            Subject ID is auto-generated and cannot be changed.
          </p>
        </div>
      )}

      {/* Name and Code */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Subject Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Algebra"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Subject Code *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
            placeholder="e.g. MATH101"
            required
          />
        </div>
      </div>

      {/* Department and Grade */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => {
              handleChange("department", value);
              handleChange("teacherIds", []);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(departmentConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gradeLevel">Grade Level *</Label>
          <Select
            value={formData.gradeLevel}
            onValueChange={(value) => handleChange("gradeLevel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9">Grade 9</SelectItem>
              <SelectItem value="10">Grade 10</SelectItem>
              <SelectItem value="11">Grade 11</SelectItem>
              <SelectItem value="12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief description of the subject"
          required
        />
      </div>

      {/* Periods per Week and Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="periodsPerWeek">Periods per Week *</Label>
          <Input
            id="periodsPerWeek"
            type="number"
            min={1}
            max={10}
            value={formData.periodsPerWeek}
            onChange={(e) => handleChange("periodsPerWeek", parseInt(e.target.value) || 1)}
            required
          />
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assign Teachers */}
      <div className="space-y-2">
        <Label>Assign Teachers</Label>
        {!formData.department ? (
          <p className="text-sm text-muted-foreground">
            Select a department first to see available teachers.
          </p>
        ) : departmentTeachers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active teachers in this department.
          </p>
        ) : (
          <div className="space-y-2 rounded-md border p-3">
            {departmentTeachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`teacher-${teacher.id}`}
                  checked={formData.teacherIds.includes(teacher.id)}
                  onCheckedChange={(checked) =>
                    handleTeacherToggle(teacher.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={`teacher-${teacher.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {getTeacherFullName(teacher)}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({teacher.subjects.join(", ")})
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : subject ? "Update Subject" : "Add Subject"}
        </Button>
      </div>
    </form>
  );
}
