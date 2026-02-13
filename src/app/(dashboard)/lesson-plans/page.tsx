"use client";

import { useState, useMemo } from "react";
import {
  LessonPlan,
  LessonPlanStatus,
  initialLessonPlans,
  lessonPlanStatusConfig,
  generatePlanId,
  getLessonPlanTeacherName,
  getLessonPlanClassName,
  getLessonPlanSubjectName,
  exportLessonPlansToCSV,
} from "@/lib/lesson-plan-data";
import { Term, terms } from "@/lib/output-of-work-data";
import { classes } from "@/lib/class-data";
import { subjects } from "@/lib/subject-data";
import { useRole } from "@/contexts/role-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonPlanDetails } from "@/components/lesson-plans/lesson-plan-details";
import { LessonPlanForm } from "@/components/lesson-plans/lesson-plan-form";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Globe,
} from "lucide-react";

type ModalMode = "view" | "add" | "edit" | "approve" | null;

export default function LessonPlansPage() {
  const { role } = useRole();
  const { user } = useAuth();

  const [plans, setPlans] = useState<LessonPlan[]>(initialLessonPlans);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [termFilter, setTermFilter] = useState<string>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Get the teacher ID for the current user
  // The teacher mock user has id "2", which maps to teacher id "1" (Robert Anderson)
  // For the demo, teacher@belgesms.com (user id "2") acts as teacher "1"
  const currentTeacherId = role === "teacher" ? "1" : "";

  // Filter plans based on role and filters
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // Role-based: teachers see only their own plans
      if (role === "teacher" && plan.teacherId !== currentTeacherId) return false;

      const teacherName = getLessonPlanTeacherName(plan).toLowerCase();
      const title = plan.title.toLowerCase();
      const topic = plan.topic.toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        title.includes(query) || topic.includes(query) || teacherName.includes(query);

      const matchesStatus = statusFilter === "all" || plan.status === statusFilter;
      const matchesClass = classFilter === "all" || plan.classId === classFilter;
      const matchesSubject = subjectFilter === "all" || plan.subjectId === subjectFilter;
      const matchesTerm = termFilter === "all" || plan.term === termFilter;

      return matchesSearch && matchesStatus && matchesClass && matchesSubject && matchesTerm;
    });
  }, [plans, searchQuery, statusFilter, classFilter, subjectFilter, termFilter, role, currentTeacherId]);

  // Stats
  const stats = useMemo(() => {
    const relevantPlans = role === "teacher"
      ? plans.filter((p) => p.teacherId === currentTeacherId)
      : plans;
    return {
      total: relevantPlans.length,
      draft: relevantPlans.filter((p) => p.status === "draft").length,
      submitted: relevantPlans.filter((p) => p.status === "submitted").length,
      approved: relevantPlans.filter((p) => p.status === "approved").length,
      published: relevantPlans.filter((p) => p.status === "published").length,
    };
  }, [plans, role, currentTeacherId]);

  const openModal = (mode: ModalMode, plan?: LessonPlan) => {
    setModalMode(mode);
    setSelectedPlan(plan || null);
    setRejectionReason("");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPlan(null);
    setRejectionReason("");
  };

  const handleAddPlan = async (data: {
    classId: string;
    subjectId: string;
    term: Term;
    weekNumber: number;
    title: string;
    topic: string;
    description: string;
    learningObjectives: string[];
    activities: string;
    resources: string;
    assessmentMethod: string;
  }) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newPlan: LessonPlan = {
      id: Date.now().toString(),
      planId: generatePlanId(),
      teacherId: currentTeacherId,
      ...data,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => [...prev, newPlan]);
    setIsSubmitting(false);
    closeModal();
  };

  const handleEditPlan = async (data: {
    classId: string;
    subjectId: string;
    term: Term;
    weekNumber: number;
    title: string;
    topic: string;
    description: string;
    learningObjectives: string[];
    activities: string;
    resources: string;
    assessmentMethod: string;
  }) => {
    if (!selectedPlan) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlan.id
          ? {
              ...p,
              ...data,
              status: p.status === "rejected" ? "draft" as LessonPlanStatus : p.status,
              rejectionReason: p.status === "rejected" ? undefined : p.rejectionReason,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    setIsSubmitting(false);
    closeModal();
  };

  const handleSubmitForReview = (plan: LessonPlan) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id
          ? {
              ...p,
              status: "submitted" as LessonPlanStatus,
              submittedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    closeModal();
  };

  const handleApprovePlan = () => {
    if (!selectedPlan) return;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlan.id
          ? {
              ...p,
              status: "approved" as LessonPlanStatus,
              approvedBy: user?.name || "Admin",
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    closeModal();
  };

  const handleRejectPlan = () => {
    if (!selectedPlan || !rejectionReason.trim()) return;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlan.id
          ? {
              ...p,
              status: "rejected" as LessonPlanStatus,
              rejectionReason: rejectionReason.trim(),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    closeModal();
  };

  const handlePublishPlan = (plan: LessonPlan) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id
          ? {
              ...p,
              status: "published" as LessonPlanStatus,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    closeModal();
  };

  const handleDeletePlan = (plan: LessonPlan) => {
    if (confirm(`Are you sure you want to delete "${plan.title}"?`)) {
      setPlans((prev) => prev.filter((p) => p.id !== plan.id));
    }
  };

  const handleApprovePlanFromMenu = (plan: LessonPlan) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id
          ? {
              ...p,
              status: "approved" as LessonPlanStatus,
              approvedBy: user?.name || "Admin",
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    closeModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lesson Plans</h1>
          <p className="text-muted-foreground">
            {role === "teacher"
              ? "Create and manage your lesson plans"
              : "Review and manage lesson plans across all teachers"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportLessonPlansToCSV(filteredPlans)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          {role === "teacher" && (
            <Button onClick={() => openModal("add")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Lesson Plan
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <div className="h-2 w-2 rounded-full bg-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <div className="h-2 w-2 rounded-full bg-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, topic, or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes
              .filter((c) => c.status === "active")
              .map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects
              .filter((s) => s.status === "active")
              .map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={termFilter} onValueChange={setTermFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Terms</SelectItem>
            {terms.map((term) => (
              <SelectItem key={term} value={term}>
                {term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {role === "admin" && (
                <TableHead className="hidden sm:table-cell">Teacher</TableHead>
              )}
              <TableHead className="hidden sm:table-cell">Class</TableHead>
              <TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead className="hidden lg:table-cell">Term</TableHead>
              <TableHead className="hidden lg:table-cell">Week</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={role === "admin" ? 8 : 7}
                  className="h-24 text-center"
                >
                  No lesson plans found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPlans.map((plan) => {
                const statusConfig = lessonPlanStatusConfig[plan.status];

                return (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plan.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {plan.planId}
                        </div>
                      </div>
                    </TableCell>
                    {role === "admin" && (
                      <TableCell className="hidden sm:table-cell">
                        {getLessonPlanTeacherName(plan)}
                      </TableCell>
                    )}
                    <TableCell className="hidden sm:table-cell">
                      {getLessonPlanClassName(plan)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getLessonPlanSubjectName(plan)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {plan.term}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {plan.weekNumber}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openModal("view", plan)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>

                          {/* Teacher actions */}
                          {role === "teacher" &&
                            (plan.status === "draft" || plan.status === "rejected") && (
                              <DropdownMenuItem
                                onClick={() => openModal("edit", plan)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                {plan.status === "rejected" ? "Revise" : "Edit"}
                              </DropdownMenuItem>
                            )}
                          {role === "teacher" && plan.status === "draft" && (
                            <DropdownMenuItem
                              onClick={() => handleSubmitForReview(plan)}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Submit for Review
                            </DropdownMenuItem>
                          )}
                          {role === "teacher" && plan.status === "draft" && (
                            <DropdownMenuItem
                              onClick={() => handleDeletePlan(plan)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}

                          {/* Admin actions */}
                          {role === "admin" && plan.status === "submitted" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApprovePlanFromMenu(plan)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openModal("approve", plan)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {role === "admin" && plan.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => handlePublishPlan(plan)}
                            >
                              <Globe className="mr-2 h-4 w-4" />
                              Publish
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredPlans.length} of{" "}
        {role === "teacher"
          ? plans.filter((p) => p.teacherId === currentTeacherId).length
          : plans.length}{" "}
        lesson plans
      </div>

      {/* View Details Dialog */}
      <Dialog open={modalMode === "view"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lesson Plan Details</DialogTitle>
            <DialogDescription>
              View detailed lesson plan information.
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <LessonPlanDetails
              plan={selectedPlan}
              role={role}
              onEdit={() => setModalMode("edit")}
              onSubmit={() => handleSubmitForReview(selectedPlan)}
              onApprove={() => {
                handleApprovePlanFromMenu(selectedPlan);
              }}
              onReject={() => {
                setModalMode("approve");
              }}
              onPublish={() => handlePublishPlan(selectedPlan)}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Lesson Plan Dialog */}
      <Dialog open={modalMode === "add"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Lesson Plan</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new lesson plan.
            </DialogDescription>
          </DialogHeader>
          <LessonPlanForm
            teacherId={currentTeacherId}
            onSubmit={handleAddPlan}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Plan Dialog */}
      <Dialog open={modalMode === "edit"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan?.status === "rejected"
                ? "Revise Lesson Plan"
                : "Edit Lesson Plan"}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan?.status === "rejected"
                ? "Address the feedback and update your lesson plan."
                : "Update the lesson plan details."}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <LessonPlanForm
              plan={selectedPlan}
              teacherId={currentTeacherId}
              onSubmit={handleEditPlan}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Dialog */}
      <Dialog open={modalMode === "approve"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Lesson Plan</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this lesson plan. The teacher will be able to
              see this feedback and revise their plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this lesson plan is being rejected..."
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectPlan}
                disabled={!rejectionReason.trim()}
              >
                Reject Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
