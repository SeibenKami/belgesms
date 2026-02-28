"use client";

import { forwardRef } from "react";
import { StudentReportData } from "@/lib/report-data";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getGradeBadgeColor(grade: string) {
  switch (grade) {
    case "A":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "B":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "C":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "D":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "F":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

export const ReportCard = forwardRef<HTMLDivElement, { reportData: StudentReportData }>(
  function ReportCard({ reportData }, ref) {
    return (
      <div ref={ref} className="report-card bg-white dark:bg-gray-950 p-6 md:p-8 rounded-lg border max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            BelgeSMS Academy
          </h1>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-1">
            Student Report Card
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Academic Year: {reportData.academicYear} &mdash; {reportData.term}
          </p>
        </div>

        {/* Student Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Student Name:</span>{" "}
            <span className="font-semibold">{reportData.studentName}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Admission No:</span>{" "}
            <span className="font-semibold">{reportData.admissionNumber}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Class:</span>{" "}
            <span className="font-semibold">{reportData.className}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Section:</span>{" "}
            <span className="font-semibold">{reportData.section}</span>
          </div>
        </div>

        {/* Subject Scores Table */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Subject Scores
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">CA (30)</TableHead>
                <TableHead className="text-center">Exam (70)</TableHead>
                <TableHead className="text-center">Total (100)</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.subjects.map((subject) => (
                <TableRow key={subject.subjectId}>
                  <TableCell className="font-medium">
                    {subject.subjectName}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({subject.subjectCode})
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{subject.caScore}</TableCell>
                  <TableCell className="text-center">{subject.examScore}</TableCell>
                  <TableCell className="text-center font-semibold">
                    {subject.total}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getGradeBadgeColor(subject.grade)}>
                      {subject.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>{subject.remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Attendance Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Attendance Summary
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-sm">
            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-700 dark:text-green-400">
                {reportData.attendance.present}
              </div>
              <div className="text-xs text-muted-foreground">Present</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-700 dark:text-red-400">
                {reportData.attendance.absent}
              </div>
              <div className="text-xs text-muted-foreground">Absent</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                {reportData.attendance.late}
              </div>
              <div className="text-xs text-muted-foreground">Late</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                {reportData.attendance.excused}
              </div>
              <div className="text-xs text-muted-foreground">Excused</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-lg font-bold">{reportData.attendance.totalDays}</div>
              <div className="text-xs text-muted-foreground">Total Days</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-lg font-bold">
                {reportData.attendance.attendancePercentage}%
              </div>
              <div className="text-xs text-muted-foreground">Attendance</div>
            </div>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Overall Performance
          </h3>
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <span className="text-sm text-muted-foreground">Overall Average:</span>{" "}
              <span className="text-xl font-bold">{reportData.overallAverage}%</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Grade:</span>{" "}
              <Badge className={`${getGradeBadgeColor(reportData.overallGrade)} text-base px-3 py-1`}>
                {reportData.overallGrade}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Remark:</span>{" "}
              <span className="font-semibold">{reportData.overallRemark}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-xs text-muted-foreground text-center">
          Generated on {new Date(reportData.generatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            .report-card {
              border: none;
              box-shadow: none;
              padding: 0;
              max-width: 100%;
              page-break-inside: avoid;
              page-break-after: always;
            }
          }
        `}</style>
      </div>
    );
  }
);
