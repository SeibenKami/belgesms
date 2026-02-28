"use client";

import { useMemo } from "react";
import { Examination, ExamPeriod } from "@/lib/examination-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

interface UploadTrackerProps {
  examinations: Examination[];
  typeFilter: ExamPeriod | "all";
}

export function UploadTracker({
  examinations,
  typeFilter,
}: UploadTrackerProps) {
  const filtered = useMemo(() => {
    if (typeFilter === "all") return examinations;
    return examinations.filter((e) => e.type === typeFilter);
  }, [examinations, typeFilter]);

  // Group exams by classId
  const groupedByClass = useMemo(() => {
    const groups: Record<
      string,
      { className: string; exams: Examination[] }
    > = {};

    filtered.forEach((exam) => {
      if (!groups[exam.classId]) {
        groups[exam.classId] = {
          className: exam.className,
          exams: [],
        };
      }
      groups[exam.classId].exams.push(exam);
    });

    return Object.entries(groups).sort(([, a], [, b]) =>
      a.className.localeCompare(b.className)
    );
  }, [filtered]);

  // Overall stats
  const totalExams = filtered.length;
  const uploadedCount = filtered.filter((e) => e.documentUrl).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm font-medium">
          {uploadedCount} of {totalExams} total exams have documents uploaded
        </p>
        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-green-500 transition-all"
            style={{
              width: totalExams > 0 ? `${(uploadedCount / totalExams) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      {/* Class Cards */}
      {groupedByClass.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No exams found for the selected filter.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groupedByClass.map(([classId, { className, exams }]) => {
            const classUploaded = exams.filter((e) => e.documentUrl).length;

            return (
              <Card key={classId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{className}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {classUploaded}/{exams.length} uploaded
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exams.map((exam) => (
                      <div
                        key={exam.id}
                        className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                      >
                        <span>{exam.subject}</span>
                        {exam.documentUrl ? (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Uploaded
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {exam.uploadedBy}
                            </span>
                          </div>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
