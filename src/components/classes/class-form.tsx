"use client";

import { useState } from "react";
import { Class } from "@/lib/class-data";
import { Teacher } from "@/lib/teacher-data";
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

interface ClassFormProps {
  classData?: Class;
  teachers: Teacher[];
  onSubmit: (data: Omit<Class, "id" | "classId">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ClassForm({
  classData,
  teachers,
  onSubmit,
  onCancel,
  isSubmitting,
}: ClassFormProps) {
  const isEditing = !!classData;

  const [formData, setFormData] = useState({
    name: classData?.name || "",
    grade: classData?.grade || "",
    section: classData?.section || "",
    academicYear: classData?.academicYear || "2024-2025",
    classTeacherId: classData?.classTeacherId || "",
    studentIds: classData?.studentIds || [],
    roomNumber: classData?.roomNumber || "",
    capacity: classData?.capacity || 30,
    status: classData?.status || "active",
  });

  const handleChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-generate class name when grade and section change
  const updateClassName = (grade: string, section: string) => {
    if (grade && section) {
      handleChange("name", `Grade ${grade}-${section}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Class, "id" | "classId">);
  };

  // Filter active teachers only
  const activeTeachers = teachers.filter((t) => t.status === "active");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Class ID - Read-only, shown only when editing */}
      {isEditing && classData?.classId && (
        <div className="space-y-2">
          <Label>Class ID</Label>
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 py-1 text-sm">
            {classData.classId}
          </div>
          <p className="text-xs text-muted-foreground">
            Class ID is auto-generated and cannot be changed.
          </p>
        </div>
      )}

      {/* Grade and Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade *</Label>
          <Select
            value={formData.grade}
            onValueChange={(value) => {
              handleChange("grade", value);
              updateClassName(value, formData.section);
            }}
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
        <div className="space-y-2">
          <Label htmlFor="section">Section *</Label>
          <Select
            value={formData.section}
            onValueChange={(value) => {
              handleChange("section", value);
              updateClassName(formData.grade, value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
              <SelectItem value="C">Section C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Class Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Class Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g., Grade 10-A"
          required
        />
        <p className="text-xs text-muted-foreground">
          Auto-generated based on grade and section, but can be customized.
        </p>
      </div>

      {/* Academic Year and Room */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="academicYear">Academic Year *</Label>
          <Select
            value={formData.academicYear}
            onValueChange={(value) => handleChange("academicYear", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2025-2026">2025-2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="roomNumber">Room Number *</Label>
          <Input
            id="roomNumber"
            value={formData.roomNumber}
            onChange={(e) => handleChange("roomNumber", e.target.value)}
            placeholder="e.g., 101"
            required
          />
        </div>
      </div>

      {/* Class Teacher */}
      <div className="space-y-2">
        <Label htmlFor="classTeacherId">Class Teacher *</Label>
        <Select
          value={formData.classTeacherId}
          onValueChange={(value) => handleChange("classTeacherId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select class teacher" />
          </SelectTrigger>
          <SelectContent>
            {activeTeachers.map((teacher) => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName} - {teacher.department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Capacity and Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            type="number"
            min={1}
            max={100}
            value={formData.capacity}
            onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 30)}
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

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : classData ? "Update Class" : "Add Class"}
        </Button>
      </div>
    </form>
  );
}
