"use client";

import { Student, getFullName, getInitials, houseConfig } from "@/lib/student-data";
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
  User,
  Hash,
  Edit,
  Home,
} from "lucide-react";

interface StudentDetailsProps {
  student: Student;
  onEdit: () => void;
  onClose: () => void;
}

export function StudentDetails({ student, onEdit, onClose }: StudentDetailsProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    transferred: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

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
          <AvatarImage src={student.photo} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {getInitials(student)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{getFullName(student)}</h2>
              <p className="text-sm text-muted-foreground">{student.admissionNumber}</p>
            </div>
            <Badge className={statusColors[student.status]}>{student.status}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              Grade {student.grade} - Section {student.section}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Personal Information */}
      <div>
        <h3 className="mb-3 font-medium">Personal Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatDate(student.dateOfBirth)} ({calculateAge(student.dateOfBirth)} years old)
            </span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{student.contactAddress}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Guardian Information */}
      <div>
        <h3 className="mb-3 font-medium">Guardian Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{student.guardianName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{student.guardianPhone}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Academic Information */}
      <div>
        <h3 className="mb-3 font-medium">Academic Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span>Admission Number: {student.admissionNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>Grade {student.grade}, Section {student.section}</span>
          </div>
          <div className="flex items-center gap-3">
            <Home className="h-4 w-4 text-muted-foreground" />
            <Badge className={houseConfig[student.house].color}>
              {houseConfig[student.house].name}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Enrolled: {formatDate(student.enrollmentDate)}</span>
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
          Edit Student
        </Button>
      </div>
    </div>
  );
}
