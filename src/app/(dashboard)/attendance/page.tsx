"use client";

import { useState, useMemo } from "react";
import {
  AttendanceRecord,
  AttendanceStatus,
  attendanceRecords as initialRecords,
  attendanceStatusConfig,
  generateAttendanceId,
  getAttendanceStudent,
  getAttendanceClass,
  exportAttendanceToCSV,
} from "@/lib/attendance-data";
import { students, getFullName, getInitials } from "@/lib/student-data";
import { classes } from "@/lib/class-data";
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
import { AttendanceForm } from "@/components/attendance/attendance-form";
import { AttendanceDetails } from "@/components/attendance/attendance-details";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  ClipboardCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ModalMode = "view" | "add" | "edit" | null;

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedRecord, setSelectedRecord] =
    useState<AttendanceRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const student = getAttendanceStudent(record, students);
      const studentName = student ? getFullName(student).toLowerCase() : "";
      const matchesSearch = studentName.includes(searchQuery.toLowerCase());

      const matchesClass =
        classFilter === "all" || record.classId === classFilter;
      const matchesDate = !dateFilter || record.date === dateFilter;
      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter;

      return matchesSearch && matchesClass && matchesDate && matchesStatus;
    });
  }, [records, searchQuery, classFilter, dateFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      present: filteredRecords.filter((r) => r.status === "present").length,
      absent: filteredRecords.filter((r) => r.status === "absent").length,
      late: filteredRecords.filter((r) => r.status === "late").length,
    };
  }, [filteredRecords]);

  const openModal = (mode: ModalMode, record?: AttendanceRecord) => {
    setModalMode(mode);
    setSelectedRecord(record || null);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedRecord(null);
  };

  const handleAddRecord = async (
    data: Omit<AttendanceRecord, "id" | "markedAt">
  ) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newRecord: AttendanceRecord = {
      ...data,
      id: generateAttendanceId(),
      markedAt: new Date().toISOString(),
    };
    setRecords((prev) => [...prev, newRecord]);
    setIsSubmitting(false);
    closeModal();
  };

  const handleEditRecord = async (
    data: Omit<AttendanceRecord, "id" | "markedAt">
  ) => {
    if (!selectedRecord) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setRecords((prev) =>
      prev.map((r) =>
        r.id === selectedRecord.id
          ? { ...data, id: selectedRecord.id, markedAt: selectedRecord.markedAt }
          : r
      )
    );
    setIsSubmitting(false);
    closeModal();
  };

  const handleDeleteRecord = (record: AttendanceRecord) => {
    const student = getAttendanceStudent(record, students);
    const name = student ? getFullName(student) : "this student";
    if (
      confirm(
        `Are you sure you want to delete the attendance record for ${name}?`
      )
    ) {
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track and manage student attendance records
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportAttendanceToCSV(filteredRecords)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => openModal("add")}>
            <Plus className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.late}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student name..."
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
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full sm:w-[180px]"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="excused">Excused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="hidden sm:table-cell">Class</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Marked By</TableHead>
              <TableHead className="hidden xl:table-cell">Notes</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No attendance records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => {
                const student = getAttendanceStudent(record, students);
                const cls = getAttendanceClass(record, classes);
                const statusConfig = attendanceStatusConfig[record.status];

                return (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={student?.photo} />
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {student ? getInitials(student) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {student
                              ? getFullName(student)
                              : "Unknown Student"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {cls?.name || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.date}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {record.markedBy}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <span className="max-w-[200px] truncate block">
                        {record.notes || "—"}
                      </span>
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
                            onClick={() => openModal("view", record)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("edit", record)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRecord(record)}
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
        Showing {filteredRecords.length} of {records.length} records
      </div>

      {/* View Details Dialog */}
      <Dialog open={modalMode === "view"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attendance Details</DialogTitle>
            <DialogDescription>
              View detailed attendance record information.
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <AttendanceDetails
              record={selectedRecord}
              onEdit={() => setModalMode("edit")}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Record Dialog */}
      <Dialog open={modalMode === "add"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Record attendance for a student.
            </DialogDescription>
          </DialogHeader>
          <AttendanceForm
            onSubmit={handleAddRecord}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={modalMode === "edit"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              Update the attendance record below.
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <AttendanceForm
              record={selectedRecord}
              onSubmit={handleEditRecord}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
