"use client";

import {
  LessonPlan,
  lessonPlanStatusConfig,
  getLessonPlanTeacherName,
  getLessonPlanClassName,
  getLessonPlanSubjectName,
} from "@/lib/lesson-plan-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  School,
  User,
  FileText,
  Target,
  Activity,
  Package,
  ClipboardCheck,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  Globe,
} from "lucide-react";
import { Role } from "@/contexts/role-context";

interface LessonPlanDetailsProps {
  plan: LessonPlan;
  role: Role;
  onEdit?: () => void;
  onSubmit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onPublish?: () => void;
  onClose: () => void;
}

export function LessonPlanDetails({
  plan,
  role,
  onEdit,
  onSubmit,
  onApprove,
  onReject,
  onPublish,
  onClose,
}: LessonPlanDetailsProps) {
  const statusConfig = lessonPlanStatusConfig[plan.status];

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
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{plan.title}</h2>
            <p className="text-sm text-muted-foreground">{plan.planId}</p>
          </div>
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>
      </div>

      <Separator />

      {/* Assignment Info */}
      <div>
        <h3 className="mb-3 font-medium">Assignment Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Teacher: {getLessonPlanTeacherName(plan)}</span>
          </div>
          <div className="flex items-center gap-3">
            <School className="h-4 w-4 text-muted-foreground" />
            <span>Class: {getLessonPlanClassName(plan)}</span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>Subject: {getLessonPlanSubjectName(plan)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{plan.term} &middot; Week {plan.weekNumber}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Lesson Content */}
      <div>
        <h3 className="mb-3 font-medium">Lesson Content</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-start gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Topic:</span> {plan.topic}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-muted-foreground">{plan.description}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Learning Objectives */}
      <div>
        <h3 className="mb-3 font-medium flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          Learning Objectives
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          {plan.learningObjectives.map((obj, index) => (
            <li key={index}>{obj}</li>
          ))}
        </ol>
      </div>

      <Separator />

      {/* Teaching Plan */}
      <div>
        <h3 className="mb-3 font-medium">Teaching Plan</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-start gap-3">
            <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Activities:</span>
              <p className="mt-1 text-muted-foreground">{plan.activities}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Resources:</span>
              <p className="mt-1 text-muted-foreground">{plan.resources}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Assessment */}
      <div>
        <h3 className="mb-3 font-medium flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          Assessment Method
        </h3>
        <p className="text-sm text-muted-foreground">{plan.assessmentMethod}</p>
      </div>

      {/* Approval Status - shown when not a draft */}
      {plan.status !== "draft" && (
        <>
          <Separator />
          <div>
            <h3 className="mb-3 font-medium">Status Details</h3>
            <div className="grid gap-3 text-sm">
              {plan.submittedAt && (
                <div className="flex items-center gap-3">
                  <Send className="h-4 w-4 text-muted-foreground" />
                  <span>Submitted: {formatDateTime(plan.submittedAt)}</span>
                </div>
              )}
              {plan.approvedBy && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Approved by: {plan.approvedBy}</span>
                </div>
              )}
              {plan.approvedAt && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Approved at: {formatDateTime(plan.approvedAt)}</span>
                </div>
              )}
              {plan.rejectionReason && (
                <div className="flex items-start gap-3">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <span className="font-medium text-red-600 dark:text-red-400">Rejection Reason:</span>
                    <p className="mt-1 text-muted-foreground">{plan.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>

        {/* Teacher actions */}
        {role === "teacher" && plan.status === "draft" && onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
        {role === "teacher" && plan.status === "draft" && onSubmit && (
          <Button onClick={onSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit for Review
          </Button>
        )}
        {role === "teacher" && plan.status === "rejected" && onEdit && (
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Revise Plan
          </Button>
        )}

        {/* Admin actions */}
        {role === "admin" && plan.status === "submitted" && onReject && (
          <Button variant="destructive" onClick={onReject}>
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        )}
        {role === "admin" && plan.status === "submitted" && onApprove && (
          <Button onClick={onApprove}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
        )}
        {role === "admin" && plan.status === "approved" && onPublish && (
          <Button onClick={onPublish}>
            <Globe className="mr-2 h-4 w-4" />
            Publish
          </Button>
        )}
      </div>
    </div>
  );
}
