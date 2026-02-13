"use client";

import { Student, getFullName, getInitials, houseConfig } from "@/lib/student-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface IdCardTemplateProps {
  student: Student;
  schoolName?: string;
  academicYear?: string;
}

export function IdCardTemplate({
  student,
  schoolName = "BelgeSMS Academy",
  academicYear = "2024-2025",
}: IdCardTemplateProps) {
  const house = houseConfig[student.house];

  return (
    <div className="id-card w-[324px] h-[204px] rounded-lg border border-border bg-white shadow-md overflow-hidden flex flex-col print:shadow-none print:border print:border-gray-300">
      {/* Top banner */}
      <div className="bg-primary px-3 py-1.5 text-center">
        <h3 className="text-[10px] font-bold text-primary-foreground tracking-wide uppercase">
          {schoolName}
        </h3>
        <div className="h-[2px] bg-primary-foreground/30 mt-0.5 mx-auto w-3/4" />
      </div>

      {/* Card body */}
      <div className="flex flex-1 gap-3 px-3 py-2">
        {/* Left: Photo */}
        <div className="flex flex-col items-center gap-1">
          <Avatar className="h-16 w-16 rounded-md border-2 border-primary/20">
            <AvatarImage src={student.photo} className="object-cover" />
            <AvatarFallback className="rounded-md text-sm font-bold bg-primary text-primary-foreground">
              {getInitials(student)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center gap-0.5 min-w-0 flex-1">
          <p className="text-[11px] font-bold text-gray-900 leading-tight truncate">
            {getFullName(student)}
          </p>
          <p className="text-[9px] text-gray-500 font-mono">
            {student.admissionNumber}
          </p>
          <p className="text-[9px] text-gray-600">
            Grade {student.grade} - Section {student.section}
          </p>
          <Badge
            className={`${house.color} text-[8px] px-1.5 py-0 w-fit mt-0.5`}
          >
            {house.name}
          </Badge>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-muted px-3 py-1 flex items-center justify-between border-t">
        <span className="text-[8px] text-muted-foreground font-medium">
          STUDENT ID CARD
        </span>
        <span className="text-[8px] text-muted-foreground">
          {academicYear}
        </span>
      </div>
    </div>
  );
}
