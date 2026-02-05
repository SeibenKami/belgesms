"use client";

import {
  Teacher,
  getTeacherFullName,
  getTeacherInitials,
  departmentConfig,
  teacherStatusColors,
} from "@/lib/teacher-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Hash,
  Edit,
  BookOpen,
  Building,
} from "lucide-react";

interface TeacherDetailsProps {
  teacher: Teacher;
  onEdit: () => void;
  onClose: () => void;
}

export function TeacherDetails({ teacher, onEdit, onClose }: TeacherDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={teacher.photo} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {getTeacherInitials(teacher)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{getTeacherFullName(teacher)}</h2>
              <p className="text-sm text-muted-foreground">{teacher.teacherId}</p>
            </div>
            <Badge className={teacherStatusColors[teacher.status]}>
              {teacher.status === "on_leave" ? "On Leave" : teacher.status}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <Badge className={departmentConfig[teacher.department].color}>
              {departmentConfig[teacher.department].name}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div>
        <h3 className="mb-3 font-medium">Contact Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{teacher.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{teacher.phone}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{teacher.contactAddress}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Personal Information */}
      <div>
        <h3 className="mb-3 font-medium">Personal Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatDate(teacher.dateOfBirth)} ({calculateAge(teacher.dateOfBirth)} years old)
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Professional Information */}
      <div>
        <h3 className="mb-3 font-medium">Professional Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span>Teacher ID: {teacher.teacherId}</span>
          </div>
          <div className="flex items-center gap-3">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>Department: {departmentConfig[teacher.department].name}</span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>Qualification: {teacher.qualification}</span>
          </div>
          <div className="flex items-start gap-3">
            <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="block">Subjects:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {teacher.subjects.map((subject) => (
                  <Badge key={subject} variant="outline" className="text-xs">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined: {formatDate(teacher.joinDate)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Teacher
        </Button>
      </div>
    </div>
  );
}
