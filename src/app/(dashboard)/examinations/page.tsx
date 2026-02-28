"use client";

import { useState, useMemo } from "react";
import {
  Examination,
  ExamPeriod,
  ExamStatus,
  initialExaminations,
  examPeriodConfig,
  examStatusConfig,
  generateExamId,
  exportExamsToCSV,
} from "@/lib/examination-data";
import { classes } from "@/lib/class-data";
import { ExamForm } from "@/components/examinations/exam-form";
import { ExamDetails } from "@/components/examinations/exam-details";
import { UploadTracker } from "@/components/examinations/upload-tracker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  BarChart3,
  CalendarDays,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  School,
} from "lucide-react";

type Tab = "overview" | "schedule" | "upload-status";

type ModalMode = "view" | "add" | "edit" | "upload" | null;

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "schedule", label: "Exam Schedule", icon: CalendarDays },
  { key: "upload-status", label: "Upload Status", icon: Upload },
];

export default function ExaminationsPage() {
  const [examinations, setExaminations] =
    useState<Examination[]>(initialExaminations);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Upload dialog state
  const [uploadFile, setUploadFile] = useState<{
    url: string;
    name: string;
  } | null>(null);

  // Stats
  const stats = useMemo(() => {
    const total = examinations.length;
    const uploaded = examinations.filter((e) => e.documentUrl).length;
    const pending = total - uploaded;
    const classesCovered = new Set(examinations.map((e) => e.classId)).size;
    return { total, uploaded, pending, classesCovered };
  }, [examinations]);

  // Recent exams (5 most recent by createdAt)
  const recentExams = useMemo(() => {
    return [...examinations]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [examinations]);

  // Filtered exams for schedule tab
  const filteredExams = useMemo(() => {
    return examinations.filter((exam) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        exam.title.toLowerCase().includes(query) ||
        exam.subject.toLowerCase().includes(query) ||
        exam.className.toLowerCase().includes(query);

      const matchesClass =
        classFilter === "all" || exam.classId === classFilter;
      const matchesType = typeFilter === "all" || exam.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || exam.status === statusFilter;

      return matchesSearch && matchesClass && matchesType && matchesStatus;
    });
  }, [examinations, searchQuery, classFilter, typeFilter, statusFilter]);

  // Modal helpers
  const openModal = (mode: ModalMode, exam?: Examination) => {
    setModalMode(mode);
    setSelectedExam(exam || null);
    setUploadFile(null);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedExam(null);
    setUploadFile(null);
  };

  // CRUD handlers
  const handleAddExam = async (
    data: Omit<Examination, "id" | "createdAt">
  ) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newExam: Examination = {
      ...data,
      id: generateExamId(),
      createdAt: new Date().toISOString(),
    };
    setExaminations((prev) => [...prev, newExam]);
    setIsSubmitting(false);
    closeModal();
  };

  const handleEditExam = async (
    data: Omit<Examination, "id" | "createdAt">
  ) => {
    if (!selectedExam) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setExaminations((prev) =>
      prev.map((e) =>
        e.id === selectedExam.id
          ? { ...data, id: selectedExam.id, createdAt: selectedExam.createdAt }
          : e
      )
    );
    setIsSubmitting(false);
    closeModal();
  };

  const handleDeleteExam = (exam: Examination) => {
    if (
      confirm(`Are you sure you want to delete "${exam.title}"?`)
    ) {
      setExaminations((prev) => prev.filter((e) => e.id !== exam.id));
    }
  };

  // Upload document handler
  const handleUploadDocument = async () => {
    if (!selectedExam || !uploadFile) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setExaminations((prev) =>
      prev.map((e) =>
        e.id === selectedExam.id
          ? {
              ...e,
              documentUrl: uploadFile.url,
              documentName: uploadFile.name,
              uploadedBy: "Current User",
              uploadedAt: new Date().toISOString(),
            }
          : e
      )
    );
    setIsSubmitting(false);
    closeModal();
  };

  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadFile({
        url: reader.result as string,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Unique classes for filter
  const uniqueClasses = useMemo(() => {
    const classIds = [...new Set(examinations.map((e) => e.classId))];
    return classIds
      .map((id) => {
        const cls = classes.find((c) => c.id === id);
        return cls ? { id: cls.id, name: cls.name } : null;
      })
      .filter(Boolean) as { id: string; name: string }[];
  }, [examinations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Examinations</h1>
          <p className="text-muted-foreground">
            Manage exam schedules, papers, and upload tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportExamsToCSV(filteredExams)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => openModal("add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Exam
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "gap-2",
                activeTab !== tab.key && "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* ============ OVERVIEW TAB ============ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Exams
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Papers Uploaded
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.uploaded}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Uploads
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {stats.pending}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Classes Covered
                </CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.classesCovered}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Exams</CardTitle>
            </CardHeader>
            <CardContent>
              {recentExams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No exams created yet.
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exam</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Date
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Document
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentExams.map((exam) => {
                        const periodConf = examPeriodConfig[exam.type];
                        const statusConf = examStatusConfig[exam.status];
                        return (
                          <TableRow key={exam.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{exam.title}</div>
                                <Badge className={`mt-1 ${periodConf.color}`}>
                                  {periodConf.label}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{exam.className}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {formatDate(exam.date)}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusConf.color}>
                                {statusConf.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {exam.documentUrl ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Uploaded
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============ EXAM SCHEDULE TAB ============ */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, subject, or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(Object.keys(examPeriodConfig) as ExamPeriod[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {examPeriodConfig[type].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {(Object.keys(examStatusConfig) as ExamStatus[]).map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      {examStatusConfig[status].label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Subject
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Time</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Duration
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Students
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Document
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No exams found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExams.map((exam) => {
                    const periodConf = examPeriodConfig[exam.type];
                    const statusConf = examStatusConfig[exam.status];

                    return (
                      <TableRow key={exam.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{exam.title}</div>
                            <Badge className={`mt-1 ${periodConf.color}`}>
                              {periodConf.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{exam.className}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {exam.subject}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(exam.date)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {exam.startTime} – {exam.endTime}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {exam.duration} min
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {exam.totalStudents}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConf.color}>
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {exam.documentUrl ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Uploaded
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
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
                                onClick={() => openModal("view", exam)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openModal("edit", exam)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openModal("upload", exam)}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Document
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteExam(exam)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
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
            Showing {filteredExams.length} of {examinations.length} exams
          </div>
        </div>
      )}

      {/* ============ UPLOAD STATUS TAB ============ */}
      {activeTab === "upload-status" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label>Filter by Type:</Label>
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(Object.keys(examPeriodConfig) as ExamPeriod[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {examPeriodConfig[type].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <UploadTracker
            examinations={examinations}
            typeFilter={typeFilter as ExamPeriod | "all"}
          />
        </div>
      )}

      {/* ============ MODALS ============ */}

      {/* View Details Dialog */}
      <Dialog open={modalMode === "view"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
            <DialogDescription>
              View detailed exam information.
            </DialogDescription>
          </DialogHeader>
          {selectedExam && (
            <ExamDetails
              exam={selectedExam}
              onEdit={() => setModalMode("edit")}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Exam Dialog */}
      <Dialog open={modalMode === "add"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Exam</DialogTitle>
            <DialogDescription>
              Create a new examination.
            </DialogDescription>
          </DialogHeader>
          <ExamForm
            onSubmit={handleAddExam}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Exam Dialog */}
      <Dialog open={modalMode === "edit"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
            <DialogDescription>
              Update the exam details below.
            </DialogDescription>
          </DialogHeader>
          {selectedExam && (
            <ExamForm
              exam={selectedExam}
              onSubmit={handleEditExam}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={modalMode === "upload"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Exam Document</DialogTitle>
            <DialogDescription>
              {selectedExam
                ? `Upload document for "${selectedExam.title}"`
                : "Upload an exam document"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select File</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("upload-doc-input")?.click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                <input
                  id="upload-doc-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleUploadFileChange}
                  className="hidden"
                />
                {uploadFile && (
                  <span className="text-sm text-muted-foreground">
                    {uploadFile.name}
                  </span>
                )}
              </div>
            </div>

            {selectedExam?.documentUrl && (
              <div className="rounded-md border bg-muted/50 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Current: {selectedExam.documentName}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Uploading a new file will replace the existing document.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={handleUploadDocument}
                disabled={!uploadFile || isSubmitting}
              >
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
