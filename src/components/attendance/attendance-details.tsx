"use client";

import {
  AttendanceRecord,
  attendanceStatusConfig,
  getAttendanceStudent,
  getAttendanceClass,
} from "@/lib/attendance-data";
import { students, getFullName, getInitials } from "@/lib/student-data";
import { classes } from "@/lib/class-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  GraduationCap,
  User,
  FileText,
  Edit,
} from "lucide-react";

interface AttendanceDetailsProps {
  record: AttendanceRecord;
  onEdit: () => void;
  onClose: () => void;
}

export function AttendanceDetails({
  record,
  onEdit,
  onClose,
}: AttendanceDetailsProps) {
  const student = getAttendanceStudent(record, students);
  const cls = getAttendanceClass(record, classes);
  const statusConfig = attendanceStatusConfig[record.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={student?.photo} />
          <AvatarFallback className="text-xl bg-primary text-primary-foreground">
            {student ? getInitials(student) : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {student ? getFullName(student) : "Unknown Student"}
              </h2>
              <p className="text-sm text-muted-foreground">{record.id}</p>
            </div>
            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
          </div>
          {cls && (
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                {cls.name}
              </span>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Attendance Details */}
      <div>
        <h3 className="mb-3 font-medium">Attendance Details</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Date: {formatDate(record.date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Marked By: {record.markedBy}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Marked At: {formatDateTime(record.markedAt)}</span>
          </div>
        </div>
      </div>

      {record.notes && (
        <>
          <Separator />
          <div>
            <h3 className="mb-3 font-medium">Notes</h3>
            <div className="flex items-start gap-3 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span>{record.notes}</span>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Record
        </Button>
      </div>
    </div>
  );
}
