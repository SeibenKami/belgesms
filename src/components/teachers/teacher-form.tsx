"use client";

import { useState } from "react";
import { Teacher, Department } from "@/lib/teacher-data";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: Omit<Teacher, "id" | "teacherId">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TeacherForm({
  teacher,
  onSubmit,
  onCancel,
  isSubmitting,
}: TeacherFormProps) {
  const isEditing = !!teacher;

  const [formData, setFormData] = useState({
    firstName: teacher?.firstName || "",
    middleName: teacher?.middleName || "",
    lastName: teacher?.lastName || "",
    email: teacher?.email || "",
    phone: teacher?.phone || "",
    dateOfBirth: teacher?.dateOfBirth || "",
    contactAddress: teacher?.contactAddress || "",
    photo: teacher?.photo || "",
    department: teacher?.department || ("mathematics" as Department),
    subjects: teacher?.subjects?.join(", ") || "",
    qualification: teacher?.qualification || "",
    status: teacher?.status || "active",
    joinDate: teacher?.joinDate || new Date().toISOString().split("T")[0],
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      subjects: formData.subjects.split(",").map((s) => s.trim()).filter(Boolean),
    };
    onSubmit(submitData as Omit<Teacher, "id" | "teacherId">);
  };

  const getInitials = () => {
    const first = formData.firstName?.[0] || "";
    const last = formData.lastName?.[0] || "";
    return (first + last).toUpperCase() || "?";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo */}
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.photo} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="photo-upload"
            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Camera className="h-4 w-4" />
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleChange("photo", reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Teacher ID - Read-only, shown only when editing */}
      {isEditing && teacher?.teacherId && (
        <div className="space-y-2">
          <Label>Teacher ID</Label>
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 py-1 text-sm">
            {teacher.teacherId}
          </div>
          <p className="text-xs text-muted-foreground">
            Teacher ID is auto-generated and cannot be changed.
          </p>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="First name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName}
            onChange={(e) => handleChange("middleName", e.target.value)}
            placeholder="Middle name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Last name"
            required
          />
        </div>
      </div>

      {/* Email and Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="teacher@school.edu"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>
      </div>

      {/* DOB */}
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          required
        />
      </div>

      {/* Contact Address */}
      <div className="space-y-2">
        <Label htmlFor="contactAddress">Contact Address *</Label>
        <Input
          id="contactAddress"
          value={formData.contactAddress}
          onChange={(e) => handleChange("contactAddress", e.target.value)}
          placeholder="Full address"
          required
        />
      </div>

      {/* Department and Qualification */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => handleChange("department", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="physical_education">Physical Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="qualification">Qualification *</Label>
          <Input
            id="qualification"
            value={formData.qualification}
            onChange={(e) => handleChange("qualification", e.target.value)}
            placeholder="e.g., M.Sc. Mathematics"
            required
          />
        </div>
      </div>

      {/* Subjects */}
      <div className="space-y-2">
        <Label htmlFor="subjects">Subjects *</Label>
        <Input
          id="subjects"
          value={formData.subjects}
          onChange={(e) => handleChange("subjects", e.target.value)}
          placeholder="Algebra, Calculus, Statistics (comma-separated)"
          required
        />
        <p className="text-xs text-muted-foreground">
          Enter subjects separated by commas
        </p>
      </div>

      {/* Status and Join Date */}
      <div className="grid gap-4 sm:grid-cols-2">
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
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="joinDate">Join Date *</Label>
          <Input
            id="joinDate"
            type="date"
            value={formData.joinDate}
            onChange={(e) => handleChange("joinDate", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : teacher ? "Update Teacher" : "Add Teacher"}
        </Button>
      </div>
    </form>
  );
}
