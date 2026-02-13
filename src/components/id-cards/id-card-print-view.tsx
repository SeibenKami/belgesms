"use client";

import { Student } from "@/lib/student-data";
import { IdCardTemplate } from "./id-card-template";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";

interface IdCardPrintViewProps {
  students: Student[];
  onClose: () => void;
}

export function IdCardPrintView({ students, onClose }: IdCardPrintViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          /* Hide everything except the print view */
          body * {
            visibility: hidden;
          }
          #id-card-print-area,
          #id-card-print-area * {
            visibility: visible;
          }
          #id-card-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Hide the toolbar when printing */
          #print-toolbar {
            display: none !important;
          }
          /* Print grid layout */
          #id-card-print-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            padding: 16px;
          }
          .id-card {
            break-inside: avoid;
            border: 1px solid #d1d5db !important;
            box-shadow: none !important;
          }
          @page {
            margin: 0.5in;
            size: landscape;
          }
        }
      `}</style>

      <div className="space-y-6">
        {/* Toolbar - hidden in print */}
        <div
          id="print-toolbar"
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
            <span className="text-sm text-muted-foreground">
              {students.length} card{students.length !== 1 ? "s" : ""} ready to
              print
            </span>
          </div>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Cards
          </Button>
        </div>

        {/* Print area */}
        <div id="id-card-print-area">
          <div
            id="id-card-print-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
          >
            {students.map((student) => (
              <IdCardTemplate key={student.id} student={student} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
