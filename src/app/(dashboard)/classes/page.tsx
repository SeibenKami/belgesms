"use client";

import { useState, useMemo } from "react";
import {
  Class,
  classes as initialClasses,
  generateClassId,
  classStatusColors,
  exportClassesToCSV,
  getClassTeacher,
} from "@/lib/class-data";
import {
  teachers as allTeachers,
  getTeacherFullName,
} from "@/lib/teacher-data";
import {
  students as allStudents,
} from "@/lib/student-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ClassForm } from "@/components/classes/class-form";
import { ClassDetails } from "@/components/classes/class-details";
import { ManageStudents } from "@/components/classes/manage-students";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  School,
  Download,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ModalMode = "view" | "add" | "edit" | "manage-students" | null;

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter classes based on search and filters
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const teacher = getClassTeacher(cls);
      const teacherName = teacher ? getTeacherFullName(teacher).toLowerCase() : "";

      const matchesSearch =
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.classId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacherName.includes(searchQuery.toLowerCase());

      const matchesGrade = gradeFilter === "all" || cls.grade === gradeFilter;
      const matchesStatus = statusFilter === "all" || cls.status === statusFilter;

      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [classes, searchQuery, gradeFilter, statusFilter]);

  // Stats based on filtered classes
  const stats = useMemo(() => {
    const totalStudents = filteredClasses.reduce(
      (acc, cls) => acc + cls.studentIds.length,
      0
    );
    const totalCapacity = filteredClasses.reduce(
      (acc, cls) => acc + cls.capacity,
      0
    );
    return {
      total: filteredClasses.length,
      active: filteredClasses.filter((c) => c.status === "active").length,
      inactive: filteredClasses.filter((c) => c.status === "inactive").length,
      totalStudents,
      totalCapacity,
    };
  }, [filteredClasses]);

  const openModal = (mode: ModalMode, cls?: Class) => {
    setModalMode(mode);
    setSelectedClass(cls || null);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedClass(null);
  };

  const handleAddClass = async (data: Omit<Class, "id" | "classId">) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newClass: Class = {
      ...data,
      id: String(Date.now()),
      classId: generateClassId(),
    };
    setClasses((prev) => [...prev, newClass]);
    setIsSubmitting(false);
    closeModal();
  };

  const handleEditClass = async (data: Omit<Class, "id" | "classId">) => {
    if (!selectedClass) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClass.id
          ? { ...data, id: selectedClass.id, classId: selectedClass.classId }
          : c
      )
    );
    setIsSubmitting(false);
    closeModal();
  };

  const handleManageStudents = async (studentIds: string[]) => {
    if (!selectedClass) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClass.id ? { ...c, studentIds } : c
      )
    );
    setIsSubmitting(false);
    closeModal();
  };

  const handleDeleteClass = (cls: Class) => {
    if (confirm(`Are you sure you want to delete ${cls.name}?`)) {
      setClasses((prev) => prev.filter((c) => c.id !== cls.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Class Management</h1>
          <p className="text-muted-foreground">
            Manage classes, assign teachers, and enroll students
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportClassesToCSV(filteredClasses)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => openModal("add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalStudents}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ {stats.totalCapacity}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by class name, ID, room, or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
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
              <TableHead>Class</TableHead>
              <TableHead className="hidden md:table-cell">Class ID</TableHead>
              <TableHead className="hidden sm:table-cell">Class Teacher</TableHead>
              <TableHead className="hidden lg:table-cell">Room</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No classes found.
                </TableCell>
              </TableRow>
            ) : (
              filteredClasses.map((cls) => {
                const teacher = getClassTeacher(cls);
                return (
                  <TableRow key={cls.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{cls.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {cls.academicYear}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {cls.classId}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {teacher ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={teacher.photo} />
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {teacher.firstName[0]}{teacher.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {teacher.firstName} {teacher.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {cls.roomNumber}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {cls.studentIds.length} / {cls.capacity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={classStatusColors[cls.status]}>
                        {cls.status}
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
                          <DropdownMenuItem onClick={() => openModal("view", cls)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openModal("edit", cls)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("manage-students", cls)}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Manage Students
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClass(cls)}
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
        Showing {filteredClasses.length} of {classes.length} classes
      </div>

      {/* View Class Dialog */}
      <Dialog open={modalMode === "view"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Class Details</DialogTitle>
            <DialogDescription>
              View detailed information about this class.
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <ClassDetails
              classData={selectedClass}
              students={allStudents}
              onEdit={() => setModalMode("edit")}
              onClose={closeModal}
              onManageStudents={() => setModalMode("manage-students")}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Class Dialog */}
      <Dialog open={modalMode === "add"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Fill in the information below to create a new class.
            </DialogDescription>
          </DialogHeader>
          <ClassForm
            teachers={allTeachers}
            onSubmit={handleAddClass}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={modalMode === "edit"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update the class information below.
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <ClassForm
              classData={selectedClass}
              teachers={allTeachers}
              onSubmit={handleEditClass}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Students Dialog */}
      <Dialog
        open={modalMode === "manage-students"}
        onOpenChange={() => closeModal()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Students - {selectedClass?.name}</DialogTitle>
            <DialogDescription>
              Add or remove students from this class.
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <ManageStudents
              classData={selectedClass}
              allStudents={allStudents}
              onSave={handleManageStudents}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
