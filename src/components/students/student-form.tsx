"use client";

import { useState } from "react";
import { Student, House } from "@/lib/student-data";
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

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: Omit<Student, "id" | "admissionNumber">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function StudentForm({
  student,
  onSubmit,
  onCancel,
  isSubmitting,
}: StudentFormProps) {
  const isEditing = !!student;

  const [formData, setFormData] = useState({
    firstName: student?.firstName || "",
    middleName: student?.middleName || "",
    lastName: student?.lastName || "",
    email: student?.email || "",
    dateOfBirth: student?.dateOfBirth || "",
    contactAddress: student?.contactAddress || "",
    guardianName: student?.guardianName || "",
    guardianPhone: student?.guardianPhone || "",
    photo: student?.photo || "",
    grade: student?.grade || "",
    section: student?.section || "",
    house: student?.house || ("red" as House),
    status: student?.status || "active",
    enrollmentDate: student?.enrollmentDate || new Date().toISOString().split("T")[0],
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Student, "id" | "admissionNumber">);
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

      {/* Admission Number - Read-only, shown only when editing */}
      {isEditing && student?.admissionNumber && (
        <div className="space-y-2">
          <Label>Admission Number</Label>
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 py-1 text-sm">
            {student.admissionNumber}
          </div>
          <p className="text-xs text-muted-foreground">
            Admission number is auto-generated and cannot be changed.
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

      {/* Email and DOB */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="student@school.edu"
            required
          />
        </div>
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

      {/* Guardian Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="guardianName">Guardian Name *</Label>
          <Input
            id="guardianName"
            value={formData.guardianName}
            onChange={(e) => handleChange("guardianName", e.target.value)}
            placeholder="Parent/Guardian name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guardianPhone">Guardian Phone *</Label>
          <Input
            id="guardianPhone"
            type="tel"
            value={formData.guardianPhone}
            onChange={(e) => handleChange("guardianPhone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>
      </div>

      {/* Academic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade *</Label>
          <Select
            value={formData.grade}
            onValueChange={(value) => handleChange("grade", value)}
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
            onValueChange={(value) => handleChange("section", value)}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="house">House *</Label>
          <Select
            value={formData.house}
            onValueChange={(value) => handleChange("house", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select house" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="red">Red House</SelectItem>
              <SelectItem value="blue">Blue House</SelectItem>
              <SelectItem value="green">Green House</SelectItem>
              <SelectItem value="yellow">Yellow House</SelectItem>
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="transferred">Transferred</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enrollment Date */}
      <div className="space-y-2">
        <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
        <Input
          id="enrollmentDate"
          type="date"
          value={formData.enrollmentDate}
          onChange={(e) => handleChange("enrollmentDate", e.target.value)}
          required
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : student ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>
  );
}
