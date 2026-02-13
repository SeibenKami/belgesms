"use client";

import { useState, useMemo } from "react";
import {
  students,
  getFullName,
  getInitials,
  houseConfig,
} from "@/lib/student-data";
import { classes, getClassStudents } from "@/lib/class-data";
import { IdCardTemplate } from "@/components/id-cards/id-card-template";
import { IdCardPrintView } from "@/components/id-cards/id-card-print-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  MoreHorizontal,
  Eye,
  Printer,
  IdCard,
  Users,
  UserCheck,
  UserX,
  CheckSquare,
} from "lucide-react";

type ViewMode = "list" | "print";

export default function IdCardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [previewStudent, setPreviewStudent] = useState<
    (typeof students)[0] | null
  >(null);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        searchQuery === "" ||
        getFullName(student).toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.admissionNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesClass =
        classFilter === "all" ||
        classes
          .find((c) => c.id === classFilter)
          ?.studentIds.includes(student.id);

      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [searchQuery, classFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: students.length,
      active: students.filter((s) => s.status === "active").length,
      inactive: students.filter((s) => s.status !== "active").length,
      selected: selectedStudentIds.length,
    };
  }, [selectedStudentIds]);

  // Students to print
  const printStudents = useMemo(() => {
    return students.filter((s) => selectedStudentIds.includes(s.id));
  }, [selectedStudentIds]);

  // Checkbox handlers
  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredStudents.map((s) => s.id);
    const allSelected = filteredIds.every((id) =>
      selectedStudentIds.includes(id)
    );

    if (allSelected) {
      setSelectedStudentIds((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      );
    } else {
      setSelectedStudentIds((prev) => [
        ...new Set([...prev, ...filteredIds]),
      ]);
    }
  };

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudentIds.includes(s.id));

  // Actions
  const handleGenerateSelected = () => {
    if (selectedStudentIds.length > 0) {
      setViewMode("print");
    }
  };

  const handleGenerateForClass = (classId: string) => {
    const cls = classes.find((c) => c.id === classId);
    if (!cls) return;

    const classStudents = getClassStudents(cls, students).filter(
      (s) => s.status === "active"
    );
    const classStudentIds = classStudents.map((s) => s.id);
    setSelectedStudentIds(classStudentIds);
    setViewMode("print");
  };

  const handleViewCard = (student: (typeof students)[0]) => {
    setPreviewStudent(student);
  };

  const handleGenerateSingle = (student: (typeof students)[0]) => {
    setSelectedStudentIds([student.id]);
    setViewMode("print");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  // Print mode
  if (viewMode === "print") {
    return <IdCardPrintView students={printStudents} onClose={handleBackToList} />;
  }

  // List mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ID Cards</h1>
          <p className="text-muted-foreground">
            Generate and print student ID cards
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Generate for Class
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {classes
                .filter((c) => c.status === "active")
                .map((cls) => (
                  <DropdownMenuItem
                    key={cls.id}
                    onClick={() => handleGenerateForClass(cls.id)}
                  >
                    {cls.name}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={handleGenerateSelected}
            disabled={selectedStudentIds.length === 0}
          >
            <Printer className="mr-2 h-4 w-4" />
            Generate Selected ({selectedStudentIds.length})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <IdCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.selected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or admission number..."
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
            {classes
              .filter((c) => c.status === "active")
              .map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="transferred">Transferred</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allFilteredSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="hidden sm:table-cell">
                Grade-Section
              </TableHead>
              <TableHead className="hidden md:table-cell">House</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => {
                const house = houseConfig[student.house];
                const statusColor =
                  student.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : student.status === "inactive"
                      ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";

                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudentIds.includes(student.id)}
                        onCheckedChange={() => toggleStudent(student.id)}
                        aria-label={`Select ${getFullName(student)}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={student.photo} />
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getInitials(student)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {getFullName(student)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.admissionNumber}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {student.grade}-{student.section}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={house.color}>{house.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColor}>
                        {student.status.charAt(0).toUpperCase() +
                          student.status.slice(1)}
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
                            onClick={() => handleViewCard(student)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View ID Card
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleGenerateSingle(student)}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Generate ID Card
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
        Showing {filteredStudents.length} of {students.length} students
        {selectedStudentIds.length > 0 && (
          <span className="ml-2">
            ({selectedStudentIds.length} selected)
          </span>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={previewStudent !== null}
        onOpenChange={() => setPreviewStudent(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ID Card Preview</DialogTitle>
            <DialogDescription>
              Preview of the student ID card.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {previewStudent && <IdCardTemplate student={previewStudent} />}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewStudent(null)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (previewStudent) {
                  handleGenerateSingle(previewStudent);
                  setPreviewStudent(null);
                }
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print This Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
