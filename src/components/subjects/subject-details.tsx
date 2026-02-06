"use client";

import { Subject, getSubjectTeachers, subjectStatusColors } from "@/lib/subject-data";
import { departmentConfig } from "@/lib/teacher-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Hash,
  GraduationCap,
  Clock,
  Users,
  Edit,
  FileText,
} from "lucide-react";

interface SubjectDetailsProps {
  subject: Subject;
  onEdit: () => void;
  onClose: () => void;
}

export function SubjectDetails({ subject, onEdit, onClose }: SubjectDetailsProps) {
  const assignedTeachers = getSubjectTeachers(subject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{subject.name}</h2>
          <p className="text-sm text-muted-foreground">{subject.subjectId}</p>
        </div>
        <Badge className={subjectStatusColors[subject.status]}>{subject.status}</Badge>
      </div>

      <Separator />

      {/* Subject Information */}
      <div>
        <h3 className="mb-3 font-medium">Subject Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span>Code: {subject.code}</span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>
              Department:{" "}
              <Badge className={departmentConfig[subject.department].color}>
                {departmentConfig[subject.department].name}
              </Badge>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>Grade Level: {subject.gradeLevel}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Periods per Week: {subject.periodsPerWeek}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="mb-3 font-medium">Description</h3>
        <div className="flex items-start gap-3 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span>{subject.description}</span>
        </div>
      </div>

      <Separator />

      {/* Assigned Teachers */}
      <div>
        <h3 className="mb-3 font-medium">Assigned Teachers</h3>
        {assignedTeachers.length === 0 ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>No teachers assigned</span>
          </div>
        ) : (
          <div className="space-y-2">
            {assignedTeachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {teacher.firstName} {teacher.lastName}
                  <span className="ml-2 text-muted-foreground">
                    ({teacher.teacherId})
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Subject
        </Button>
      </div>
    </div>
  );
}
