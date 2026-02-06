"use client";

import { useState, useMemo } from "react";
import {
  Subject,
  subjects as initialSubjects,
  generateSubjectId,
  getSubjectTeacherNames,
  subjectStatusColors,
  exportSubjectsToCSV,
} from "@/lib/subject-data";
import { departmentConfig, Department } from "@/lib/teacher-data";
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
import { SubjectForm } from "@/components/subjects/subject-form";
import { SubjectDetails } from "@/components/subjects/subject-details";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  BookOpen,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ModalMode = "view" | "add" | "edit" | null;

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter subjects based on search and filters
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.subjectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSubjectTeacherNames(subject).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || subject.department === departmentFilter;
      const matchesGrade = gradeFilter === "all" || subject.gradeLevel === gradeFilter;
      const matchesStatus = statusFilter === "all" || subject.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesGrade && matchesStatus;
    });
  }, [subjects, searchQuery, departmentFilter, gradeFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: filteredSubjects.length,
      active: filteredSubjects.filter((s) => s.status === "active").length,
      inactive: filteredSubjects.filter((s) => s.status === "inactive").length,
      totalPeriods: filteredSubjects
        .filter((s) => s.status === "active")
        .reduce((sum, s) => sum + s.periodsPerWeek, 0),
    };
  }, [filteredSubjects]);

  const openModal = (mode: ModalMode, subject?: Subject) => {
    setModalMode(mode);
    setSelectedSubject(subject || null);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedSubject(null);
  };

  const handleAddSubject = async (data: Omit<Subject, "id" | "subjectId">) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newSubject: Subject = {
      ...data,
      id: String(Date.now()),
      subjectId: generateSubjectId(),
    };
    setSubjects((prev) => [...prev, newSubject]);
    setIsSubmitting(false);
    closeModal();
  };

  const handleEditSubject = async (data: Omit<Subject, "id" | "subjectId">) => {
    if (!selectedSubject) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSubjects((prev) =>
      prev.map((s) =>
        s.id === selectedSubject.id
          ? { ...data, id: selectedSubject.id, subjectId: selectedSubject.subjectId }
          : s
      )
    );
    setIsSubmitting(false);
    closeModal();
  };

  const handleDeleteSubject = (subject: Subject) => {
    if (confirm(`Are you sure you want to delete "${subject.name}"?`)) {
      setSubjects((prev) => prev.filter((s) => s.id !== subject.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">
            Manage subject curriculum and teacher assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportSubjectsToCSV(filteredSubjects)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => openModal("add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <div className="h-2 w-2 rounded-full bg-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Periods/Week</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPeriods}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, code, or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {Object.entries(departmentConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="9">Grade 9</SelectItem>
            <SelectItem value="10">Grade 10</SelectItem>
            <SelectItem value="11">Grade 11</SelectItem>
            <SelectItem value="12">Grade 12</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Code</TableHead>
              <TableHead className="hidden sm:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Grade</TableHead>
              <TableHead className="hidden xl:table-cell">Teacher(s)</TableHead>
              <TableHead className="hidden lg:table-cell">Periods/Wk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No subjects found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">
                        {subject.code}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {subject.code}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className={departmentConfig[subject.department].color}>
                      {departmentConfig[subject.department].name}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    Grade {subject.gradeLevel}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="text-sm max-w-[200px] truncate">
                      {getSubjectTeacherNames(subject)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {subject.periodsPerWeek}
                  </TableCell>
                  <TableCell>
                    <Badge className={subjectStatusColors[subject.status]}>
                      {subject.status}
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
                        <DropdownMenuItem onClick={() => openModal("view", subject)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openModal("edit", subject)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSubject(subject)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSubjects.length} of {subjects.length} subjects
      </div>

      {/* View Subject Dialog */}
      <Dialog open={modalMode === "view"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subject Details</DialogTitle>
            <DialogDescription>
              View detailed information about this subject.
            </DialogDescription>
          </DialogHeader>
          {selectedSubject && (
            <SubjectDetails
              subject={selectedSubject}
              onEdit={() => setModalMode("edit")}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={modalMode === "add"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Fill in the information below to add a new subject.
            </DialogDescription>
          </DialogHeader>
          <SubjectForm
            onSubmit={handleAddSubject}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={modalMode === "edit"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the subject information below.
            </DialogDescription>
          </DialogHeader>
          {selectedSubject && (
            <SubjectForm
              subject={selectedSubject}
              onSubmit={handleEditSubject}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
