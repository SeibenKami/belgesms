"use client";

import { useState, useMemo } from "react";
import { Class } from "@/lib/class-data";
import { Student, getFullName, getInitials } from "@/lib/student-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users } from "lucide-react";

interface ManageStudentsProps {
  classData: Class;
  allStudents: Student[];
  onSave: (studentIds: string[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ManageStudents({
  classData,
  allStudents,
  onSave,
  onCancel,
  isSubmitting,
}: ManageStudentsProps) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    classData.studentIds
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter students that match the class grade and section, or are already in the class
  const eligibleStudents = useMemo(() => {
    return allStudents.filter((student) => {
      // Include students already in this class, or students in the same grade/section
      const isInClass = classData.studentIds.includes(student.id);
      const matchesGradeSection =
        student.grade === classData.grade && student.section === classData.section;

      // Also filter by search query
      const matchesSearch =
        searchQuery === "" ||
        getFullName(student).toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());

      return (isInClass || matchesGradeSection) && matchesSearch && student.status === "active";
    });
  }, [allStudents, classData, searchQuery]);

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAll = () => {
    setSelectedStudentIds(eligibleStudents.map((s) => s.id));
  };

  const deselectAll = () => {
    setSelectedStudentIds([]);
  };

  const handleSave = () => {
    onSave(selectedStudentIds);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {selectedStudentIds.length} of {classData.capacity} students selected
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={deselectAll}>
            Deselect All
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Student List */}
      <div className="border rounded-md max-h-[300px] overflow-y-auto">
        {eligibleStudents.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No eligible students found for Grade {classData.grade}, Section {classData.section}.
          </div>
        ) : (
          <div className="divide-y">
            {eligibleStudents.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
              >
                <Checkbox
                  checked={selectedStudentIds.includes(student.id)}
                  onCheckedChange={() => toggleStudent(student.id)}
                />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.photo} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {getInitials(student)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {getFullName(student)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {student.admissionNumber}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {student.grade}-{student.section}
                </Badge>
              </label>
            ))}
          </div>
        )}
      </div>

      {selectedStudentIds.length > classData.capacity && (
        <p className="text-sm text-destructive">
          Warning: Selected students ({selectedStudentIds.length}) exceeds class capacity ({classData.capacity}).
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
