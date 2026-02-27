"use client";

import { useState } from "react";
import {
  StudentBill,
  Payment,
  PaymentMethod,
  paymentMethodConfig,
  formatCurrency,
} from "@/lib/finance-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecordPaymentProps {
  studentBill: StudentBill;
  onSubmit: (data: Omit<Payment, "id" | "recordedAt">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function RecordPayment({
  studentBill,
  onSubmit,
  onCancel,
  isSubmitting,
}: RecordPaymentProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [reference, setReference] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date, amount, method, reference });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Banner */}
      <div className="rounded-lg border bg-muted/50 p-4 text-sm">
        <div className="font-medium">{studentBill.studentName}</div>
        <div className="text-muted-foreground">
          Outstanding Balance:{" "}
          <span className="font-medium text-red-600">
            {formatCurrency(studentBill.balance)}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="paymentDate">Payment Date *</Label>
        <Input
          id="paymentDate"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (GHS) *</Label>
        <Input
          id="amount"
          type="number"
          min="0.01"
          max={studentBill.balance}
          step="0.01"
          value={amount || ""}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          placeholder={`Max: ${studentBill.balance.toFixed(2)}`}
          required
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Label htmlFor="method">Payment Method *</Label>
        <Select
          value={method}
          onValueChange={(value) => setMethod(value as PaymentMethod)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            {(
              Object.keys(paymentMethodConfig) as PaymentMethod[]
            ).map((m) => (
              <SelectItem key={m} value={m}>
                {paymentMethodConfig[m].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reference */}
      <div className="space-y-2">
        <Label htmlFor="reference">Reference *</Label>
        <Input
          id="reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g. TRF-2025-0101"
          required
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Recording..." : "Record Payment"}
        </Button>
      </div>
    </form>
  );
}
