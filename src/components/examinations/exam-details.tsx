"use client";

import {
  Examination,
  examPeriodConfig,
  examStatusConfig,
} from "@/lib/examination-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  School,
  FileText,
  Edit,
  Download,
  AlertCircle,
} from "lucide-react";

interface ExamDetailsProps {
  exam: Examination;
  onEdit: () => void;
  onClose: () => void;
}

export function ExamDetails({ exam, onEdit, onClose }: ExamDetailsProps) {
  const periodConfig = examPeriodConfig[exam.type];
  const statusConfig = examStatusConfig[exam.status];

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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{exam.title}</h2>
          <p className="text-sm text-muted-foreground">{exam.id}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={periodConfig.color}>{periodConfig.label}</Badge>
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>
      </div>

      <Separator />

      {/* Exam Details */}
      <div>
        <h3 className="mb-3 font-medium">Exam Details</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <School className="h-4 w-4 text-muted-foreground" />
            <span>Class: {exam.className}</span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>Subject: {exam.subject}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Date: {formatDate(exam.date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              Time: {exam.startTime} – {exam.endTime} ({exam.duration} min)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Total Students: {exam.totalStudents}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Created: {formatDateTime(exam.createdAt)}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Document Section */}
      <div>
        <h3 className="mb-3 font-medium">Exam Document</h3>
        {exam.documentUrl ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{exam.documentName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Uploaded by: {exam.uploadedBy}</span>
            </div>
            {exam.uploadedAt && (
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Uploaded: {formatDateTime(exam.uploadedAt)}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                if (exam.documentUrl) {
                  const link = document.createElement("a");
                  link.href = exam.documentUrl;
                  link.download = exam.documentName || "exam-document";
                  link.click();
                }
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Document
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>No document uploaded yet.</span>
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
          Edit Exam
        </Button>
      </div>
    </div>
  );
}
