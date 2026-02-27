"use client";

import {
  StudentBill,
  Bill,
  paymentStatusConfig,
  paymentMethodConfig,
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
  User,
  GraduationCap,
  Hash,
  CreditCard,
} from "lucide-react";

interface StudentBillDetailsProps {
  studentBill: StudentBill;
  bill: Bill;
  onRecordPayment: () => void;
  onClose: () => void;
}

export function StudentBillDetails({
  studentBill,
  bill,
  onRecordPayment,
  onClose,
}: StudentBillDetailsProps) {
  const statusConf = paymentStatusConfig[studentBill.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{studentBill.studentName}</h2>
          <p className="text-sm text-muted-foreground">{bill.title}</p>
        </div>
        <Badge className={statusConf.color}>{statusConf.label}</Badge>
      </div>

      <Separator />

      {/* Student Info */}
      <div>
        <h3 className="mb-3 font-medium">Student Information</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{studentBill.studentName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span>Student ID: {studentBill.studentId}</span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>{studentBill.grade}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Financial Summary */}
      <div>
        <h3 className="mb-3 font-medium">Financial Summary</h3>
        <div className="grid gap-3 rounded-lg border p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Due</span>
            <span className="font-medium">
              {formatCurrency(studentBill.totalDue)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Paid</span>
            <span className="font-medium text-green-600">
              {formatCurrency(studentBill.totalPaid)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Outstanding Balance</span>
            <span className="font-medium text-red-600">
              {formatCurrency(studentBill.balance)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {studentBill.payments.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="mb-3 font-medium">
              Payment History ({studentBill.payments.length})
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="hidden sm:table-cell">Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentBill.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>
                        {paymentMethodConfig[payment.method].label}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {payment.reference}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
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
        {studentBill.balance > 0 && (
          <Button onClick={onRecordPayment}>
            <CreditCard className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        )}
      </div>
    </div>
  );
}
