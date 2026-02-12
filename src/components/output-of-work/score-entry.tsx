"use client";

import { useState, useMemo } from "react";
import {
  TermConfig,
  AssessmentScore,
  AssessmentComponent,
  componentLabels,
  generateScoreId,
} from "@/lib/output-of-work-data";
import { classes } from "@/lib/class-data";
import { subjects } from "@/lib/subject-data";
import { students, getFullName } from "@/lib/student-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save } from "lucide-react";

interface ScoreEntryProps {
  config: TermConfig;
  scores: AssessmentScore[];
  onScoresChange: (scores: AssessmentScore[]) => void;
}

export function ScoreEntry({ config, scores, onScoresChange }: ScoreEntryProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [selectedAssessmentNum, setSelectedAssessmentNum] = useState<string>("");
  const [localScores, setLocalScores] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  const activeClasses = classes.filter((c) => c.status === "active");

  const selectedClass = activeClasses.find((c) => c.id === selectedClassId);

  // Filter subjects by grade level of selected class, active only
  const filteredSubjects = useMemo(() => {
    if (!selectedClass) return [];
    return subjects.filter(
      (s) => s.gradeLevel === selectedClass.grade && s.status === "active"
    );
  }, [selectedClass]);

  // Get component config for assessment number options
  const componentConfig = useMemo(() => {
    if (!selectedComponent) return null;
    return config.components.find((c) => c.key === selectedComponent);
  }, [selectedComponent, config.components]);

  // Get assessment number options
  const assessmentNumbers = useMemo(() => {
    if (!componentConfig) return [];
    return Array.from(
      { length: componentConfig.requiredAssessments },
      (_, i) => i + 1
    );
  }, [componentConfig]);

  // Get students for selected class
  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students.filter((s) => selectedClass.studentIds.includes(s.id));
  }, [selectedClass]);

  // Pre-fill existing scores when navigating to a previously-entered assessment
  const maxScore = componentConfig?.maxScore ?? 10;

  // Load existing scores when all filters are selected
  useMemo(() => {
    if (
      !selectedClassId ||
      !selectedSubjectId ||
      !selectedComponent ||
      !selectedAssessmentNum
    )
      return;

    const assessNum = parseInt(selectedAssessmentNum);
    const existing: Record<string, number> = {};

    classStudents.forEach((student) => {
      const found = scores.find(
        (s) =>
          s.studentId === student.id &&
          s.classId === selectedClassId &&
          s.subjectId === selectedSubjectId &&
          s.term === config.term &&
          s.component === selectedComponent &&
          s.assessmentNumber === assessNum
      );
      if (found) {
        existing[student.id] = found.score;
      }
    });

    setLocalScores(existing);
  }, [
    selectedClassId,
    selectedSubjectId,
    selectedComponent,
    selectedAssessmentNum,
    classStudents,
    scores,
    config.term,
  ]);

  const handleScoreChange = (studentId: string, value: string) => {
    const numValue = parseFloat(value);
    if (value === "") {
      setLocalScores((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
      return;
    }
    if (isNaN(numValue) || numValue < 0 || numValue > maxScore) return;
    setLocalScores((prev) => ({ ...prev, [studentId]: numValue }));
  };

  const handleSaveAll = async () => {
    if (!selectedClassId || !selectedSubjectId || !selectedComponent || !selectedAssessmentNum) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const assessNum = parseInt(selectedAssessmentNum);
    const updatedScores = [...scores];

    classStudents.forEach((student) => {
      const scoreValue = localScores[student.id];
      if (scoreValue === undefined) return;

      const existingIndex = updatedScores.findIndex(
        (s) =>
          s.studentId === student.id &&
          s.classId === selectedClassId &&
          s.subjectId === selectedSubjectId &&
          s.term === config.term &&
          s.component === selectedComponent &&
          s.assessmentNumber === assessNum
      );

      const scoreRecord: AssessmentScore = {
        id: existingIndex >= 0 ? updatedScores[existingIndex].id : generateScoreId(),
        studentId: student.id,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        term: config.term,
        component: selectedComponent as AssessmentComponent,
        assessmentNumber: assessNum,
        score: scoreValue,
        maxScore,
        enteredBy: "current-user",
        enteredAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        updatedScores[existingIndex] = scoreRecord;
      } else {
        updatedScores.push(scoreRecord);
      }
    });

    onScoresChange(updatedScores);
    setIsSaving(false);
  };

  const allFiltersSelected =
    selectedClassId && selectedSubjectId && selectedComponent && selectedAssessmentNum;

  // Reset dependent selects on parent change
  const handleClassChange = (value: string) => {
    setSelectedClassId(value);
    setSelectedSubjectId("");
    setSelectedComponent("");
    setSelectedAssessmentNum("");
    setLocalScores({});
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubjectId(value);
    setSelectedComponent("");
    setSelectedAssessmentNum("");
    setLocalScores({});
  };

  const handleComponentChange = (value: string) => {
    setSelectedComponent(value);
    setSelectedAssessmentNum("");
    setLocalScores({});
  };

  const handleAssessmentNumChange = (value: string) => {
    setSelectedAssessmentNum(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Score Entry</CardTitle>
          <CardDescription>
            Enter assessment scores for students. Select a class, subject,
            component, and assessment number to begin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <label className="text-sm font-medium">Component</label>
              <Select
                value={selectedComponent}
                onValueChange={handleComponentChange}
                disabled={!selectedSubjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  {config.components.map((comp) => (
                    <SelectItem key={comp.key} value={comp.key}>
                      {componentLabels[comp.key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assessment #</label>
              <Select
                value={selectedAssessmentNum}
                onValueChange={handleAssessmentNumChange}
                disabled={!selectedComponent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select #" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentNumbers.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      Assessment {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Score Entry Table */}
          {allFiltersSelected && classStudents.length > 0 && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="w-32">Score</TableHead>
                      <TableHead className="w-20">/ {maxScore}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell className="text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {getFullName(student)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            max={maxScore}
                            step={0.5}
                            value={localScores[student.id] ?? ""}
                            onChange={(e) =>
                              handleScoreChange(student.id, e.target.value)
                            }
                            placeholder="0"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          / {maxScore}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAll} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save All Scores"}
                </Button>
              </div>
            </>
          )}

          {allFiltersSelected && classStudents.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No students found in the selected class.
            </div>
          )}

          {!allFiltersSelected && (
            <div className="py-8 text-center text-muted-foreground">
              Select a class, subject, component, and assessment number to enter
              scores.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
