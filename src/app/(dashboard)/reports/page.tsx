"use client";

import { useState, useRef } from "react";
import {
  StudentReportData,
  computeStudentReport,
  generateBulkReports,
  initialExamResults,
} from "@/lib/report-data";
import { initialScores } from "@/lib/output-of-work-data";
import { attendanceRecords } from "@/lib/attendance-data";
import { classes } from "@/lib/class-data";
import { students, getFullName } from "@/lib/student-data";
import { Term, terms } from "@/lib/output-of-work-data";
import { ReportCard } from "@/components/reports/report-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  User,
  Users,
  Printer,
  FileBarChart,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";

type Tab = "individual" | "class";

const tabConfig: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "individual", label: "Individual Report", icon: User },
  { key: "class", label: "Class Reports", icon: Users },
];

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

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("individual");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [generatedReport, setGeneratedReport] = useState<StudentReportData | null>(null);
  const [bulkReports, setBulkReports] = useState<StudentReportData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const bulkPrintRef = useRef<HTMLDivElement>(null);

  // Get students for selected class
  const classStudents = selectedClass
    ? students.filter((s) => {
        const classData = classes.find((c) => c.id === selectedClass);
        return classData?.studentIds.includes(s.id);
      })
    : [];

  // Reset student when class changes
  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedStudent("");
    setGeneratedReport(null);
    setBulkReports([]);
  };

  const handleTermChange = (value: string) => {
    setSelectedTerm(value);
    setGeneratedReport(null);
    setBulkReports([]);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setGeneratedReport(null);
    setBulkReports([]);
    setExpandedReportId(null);
  };

  // Generate individual report
  const handleGenerateIndividual = async () => {
    if (!selectedClass || !selectedStudent || !selectedTerm) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const report = computeStudentReport(
      selectedStudent,
      selectedClass,
      selectedTerm as Term,
      initialScores,
      initialExamResults,
      attendanceRecords
    );
    setGeneratedReport(report);
    setIsGenerating(false);
  };

  // Generate bulk reports
  const handleGenerateBulk = async () => {
    if (!selectedClass || !selectedTerm) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const reports = generateBulkReports(
      selectedClass,
      selectedTerm as Term,
      initialScores,
      initialExamResults,
      attendanceRecords
    );
    setBulkReports(reports);
    setIsGenerating(false);
  };

  // Print handlers
  const handlePrint = () => {
    window.print();
  };

  const selectedClassName =
    classes.find((c) => c.id === selectedClass)?.name || "";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileBarChart className="h-8 w-8" />
          Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate end-of-semester student report cards
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Individual Report Tab */}
      {activeTab === "individual" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Individual Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={selectedClass} onValueChange={handleClassChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes
                        .filter((c) => c.status === "active")
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select
                    value={selectedStudent}
                    onValueChange={setSelectedStudent}
                    disabled={!selectedClass}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Student" />
                    </SelectTrigger>
                    <SelectContent>
                      {classStudents.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {getFullName(s)} ({s.admissionNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Term</Label>
                  <Select value={selectedTerm} onValueChange={handleTermChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Term" />
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

                <Button
                  onClick={handleGenerateIndividual}
                  disabled={
                    !selectedClass ||
                    !selectedStudent ||
                    !selectedTerm ||
                    isGenerating
                  }
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Individual Report */}
          {generatedReport && (
            <div className="space-y-4">
              <div className="flex justify-end print:hidden">
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print / Download PDF
                </Button>
              </div>
              <div ref={printRef} className="print-area">
                <ReportCard reportData={generatedReport} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Class Reports Tab */}
      {activeTab === "class" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Class Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={selectedClass} onValueChange={handleClassChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes
                        .filter((c) => c.status === "active")
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Term</Label>
                  <Select value={selectedTerm} onValueChange={handleTermChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Term" />
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

                <Button
                  onClick={handleGenerateBulk}
                  disabled={!selectedClass || !selectedTerm || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate All Reports"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Reports Results */}
          {bulkReports.length > 0 && (
            <div className="space-y-4">
              {/* Summary Bar */}
              <div className="flex items-center justify-between print:hidden">
                <p className="text-sm text-muted-foreground">
                  Generated{" "}
                  <span className="font-semibold text-foreground">
                    {bulkReports.length}
                  </span>{" "}
                  report{bulkReports.length !== 1 && "s"} for{" "}
                  <span className="font-semibold text-foreground">
                    {selectedClassName}
                  </span>
                </p>
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print All
                </Button>
              </div>

              {/* Expandable List */}
              <div className="space-y-2 print:hidden">
                {bulkReports.map((report) => (
                  <Card key={report.studentId}>
                    <button
                      className="w-full"
                      onClick={() =>
                        setExpandedReportId(
                          expandedReportId === report.studentId
                            ? null
                            : report.studentId
                        )
                      }
                    >
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                          {expandedReportId === report.studentId ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="text-left">
                            <span className="font-medium">{report.studentName}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({report.admissionNumber})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            Avg: {report.overallAverage}%
                          </span>
                          <Badge className={getGradeBadgeColor(report.overallGrade)}>
                            {report.overallGrade}
                          </Badge>
                        </div>
                      </CardContent>
                    </button>
                    {expandedReportId === report.studentId && (
                      <div className="px-6 pb-6">
                        <ReportCard reportData={report} />
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Hidden printable area with all reports */}
              <div ref={bulkPrintRef} className="hidden print:block print-area">
                {bulkReports.map((report) => (
                  <ReportCard key={report.studentId} reportData={report} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible !important;
            display: block;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
