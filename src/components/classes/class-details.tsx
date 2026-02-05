"use client";

import { Class, classStatusColors, getClassTeacher } from "@/lib/class-data";
import { Student, getFullName, getInitials } from "@/lib/student-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  GraduationCap,
  Hash,
  Edit,
  Users,
  DoorOpen,
  User,
} from "lucide-react";

interface ClassDetailsProps {
  classData: Class;
  students: Student[];
  onEdit: () => void;
  onClose: () => void;
  onManageStudents: () => void;
}

export function ClassDetails({
  classData,
  students,
  onEdit,
  onClose,
  onManageStudents,
}: ClassDetailsProps) {
  const teacher = getClassTeacher(classData);
  const classStudents = students.filter((s) => classData.studentIds.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{classData.name}</h2>
          <p className="text-sm text-muted-foreground">{classData.classId}</p>
        </div>
        <Badge className={classStatusColors[classData.status]}>
          {classData.status}
        </Badge>
      </div>

      <Separator />

      {/* Class Information */}
      <div>
        <h3 className="mb-3 font-medium">Class Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span>Class ID: {classData.classId}</span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>Grade {classData.grade}, Section {classData.section}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Academic Year: {classData.academicYear}</span>
          </div>
          <div className="flex items-center gap-3">
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
            <span>Room: {classData.roomNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Capacity: {classStudents.length} / {classData.capacity} students</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Class Teacher */}
      <div>
        <h3 className="mb-3 font-medium">Class Teacher</h3>
        {teacher ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={teacher.photo} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {teacher.firstName[0]}{teacher.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {teacher.firstName} {teacher.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {teacher.email}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No teacher assigned</p>
        )}
      </div>

      <Separator />

      {/* Students List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Students ({classStudents.length})</h3>
          <Button variant="outline" size="sm" onClick={onManageStudents}>
            <User className="mr-2 h-4 w-4" />
            Manage Students
          </Button>
        </div>
        {classStudents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No students enrolled in this class.</p>
        ) : (
          <div className="rounded-md border max-h-[200px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={student.photo} />
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getInitials(student)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{getFullName(student)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {student.admissionNumber}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          student.status === "active"
                            ? "text-green-600"
                            : "text-gray-600"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          Edit Class
        </Button>
      </div>
    </div>
  );
}
