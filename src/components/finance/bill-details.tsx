"use client";

import {
  Bill,
  StudentBill,
  paymentStatusConfig,
  formatCurrency,
} from "@/lib/finance-data";
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
  Hash,
  BookOpen,
  GraduationCap,
  Edit,
} from "lucide-react";

interface BillDetailsProps {
  bill: Bill;
  studentBills: StudentBill[];
  onEdit: () => void;
  onClose: () => void;
}

export function BillDetails({
  bill,
  studentBills,
  onEdit,
  onClose,
}: BillDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalCollected = studentBills.reduce((sum, sb) => sum + sb.totalPaid, 0);
  const totalOutstanding = studentBills.reduce((sum, sb) => sum + sb.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">{bill.title}</h2>
        <p className="text-sm text-muted-foreground">{bill.billNumber}</p>
      </div>

      <Separator />

      {/* Bill Info */}
      <div>
        <h3 className="mb-3 font-medium">Bill Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span>Bill Number: {bill.billNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>Semester: {bill.semester}</span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>Academic Year: {bill.academicYear}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Created: {formatDate(bill.createdAt)}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Fee Breakdown */}
      <div>
        <h3 className="mb-3 font-medium">Fee Breakdown</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bill.feeItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(bill.totalAmount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Student Payment Summary */}
      {studentBills.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="mb-3 font-medium">
              Student Payments ({studentBills.length} students)
            </h3>
            <div className="mb-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                Total Collected:{" "}
                <span className="font-medium text-green-600">
                  {formatCurrency(totalCollected)}
                </span>
              </div>
              <div>
                Outstanding:{" "}
                <span className="font-medium text-red-600">
                  {formatCurrency(totalOutstanding)}
                </span>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden sm:table-cell">Grade</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentBills.map((sb) => {
                    const statusConf = paymentStatusConfig[sb.status];
                    return (
                      <TableRow key={sb.id}>
                        <TableCell className="font-medium">
                          {sb.studentName}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {sb.grade}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(sb.totalPaid)}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConf.color}>
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Bill
        </Button>
      </div>
    </div>
  );
}
