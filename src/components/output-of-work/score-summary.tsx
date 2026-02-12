"use client";

import { useState, useMemo } from "react";
import {
  TermConfig,
  AssessmentScore,
  Term,
  terms,
  getStudentSummary,
  exportSummaryToCSV,
} from "@/lib/output-of-work-data";
import { classes } from "@/lib/class-data";
import { subjects } from "@/lib/subject-data";
import { students, getFullName } from "@/lib/student-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";

interface ScoreSummaryProps {
  config: TermConfig;
  scores: AssessmentScore[];
}

export function ScoreSummary({ config, scores }: ScoreSummaryProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<string>("");

  const activeClasses = classes.filter((c) => c.status === "active");
  const selectedClass = activeClasses.find((c) => c.id === selectedClassId);

  const filteredSubjects = useMemo(() => {
    if (!selectedClass) return [];
    return subjects.filter(
      (s) => s.gradeLevel === selectedClass.grade && s.status === "active"
    );
  }, [selectedClass]);

  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students.filter((s) => selectedClass.studentIds.includes(s.id));
  }, [selectedClass]);

  const allFiltersSelected = selectedClassId && selectedSubjectId && selectedTerm;

  const summaryData = useMemo(() => {
    if (!allFiltersSelected) return [];

    return classStudents.map((student) => {
      const summary = getStudentSummary(
        student.id,
        selectedSubjectId,
        selectedTerm as Term,
        scores,
        config
      );
      return {
        studentName: getFullName(student),
        ...summary,
      };
    });
  }, [allFiltersSelected, classStudents, selectedSubjectId, selectedTerm, scores, config]);

  const hasData = summaryData.some((s) => s.total > 0);

  const handleExportCSV = () => {
    if (!selectedClass || !allFiltersSelected) return;
    const subjectName =
      subjects.find((s) => s.id === selectedSubjectId)?.name ?? "Unknown";
    exportSummaryToCSV(
      summaryData,
      selectedClass.name,
      subjectName,
      selectedTerm as Term
    );
  };

  const handleClassChange = (value: string) => {
    setSelectedClassId(value);
    setSelectedSubjectId("");
    setSelectedTerm("");
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubjectId(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Score Summary</CardTitle>
          <CardDescription>
            View consolidated assessment averages for students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClassId} onValueChange={handleClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {activeClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select
                value={selectedSubjectId}
                onValueChange={handleSubjectChange}
                disabled={!selectedClassId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Term</label>
              <Select
                value={selectedTerm}
                onValueChange={setSelectedTerm}
                disabled={!selectedSubjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary Table */}
          {allFiltersSelected && hasData && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-center">CW Avg</TableHead>
                      <TableHead className="text-center">HW Avg</TableHead>
                      <TableHead className="text-center">Quiz Avg</TableHead>
                      <TableHead className="text-center">Project Avg</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.map((row) => (
                      <TableRow key={row.studentName}>
                        <TableCell className="font-medium">
                          {row.studentName}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.classWork}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.homeWork}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.quiz}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.project}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {row.total}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {row.percentage}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </>
          )}

          {allFiltersSelected && !hasData && (
            <div className="py-8 text-center text-muted-foreground">
              No score data found for the selected filters.
            </div>
          )}

          {!allFiltersSelected && (
            <div className="py-8 text-center text-muted-foreground">
              Select a class, subject, and term to view the summary.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
