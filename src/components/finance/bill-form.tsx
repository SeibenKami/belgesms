"use client";

import { useState } from "react";
import { Bill, FeeItem } from "@/lib/finance-data";
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
import { Plus, Trash2 } from "lucide-react";

interface BillFormProps {
  bill?: Bill;
  onSubmit: (data: Omit<Bill, "id" | "billNumber" | "createdAt">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BillForm({
  bill,
  onSubmit,
  onCancel,
  isSubmitting,
}: BillFormProps) {
  const [title, setTitle] = useState(bill?.title || "");
  const [semester, setSemester] = useState(bill?.semester || "Term 1");
  const [academicYear, setAcademicYear] = useState(
    bill?.academicYear || "2024/2025"
  );
  const [feeItems, setFeeItems] = useState<FeeItem[]>(
    bill?.feeItems || [{ id: crypto.randomUUID(), name: "", amount: 0 }]
  );

  const totalAmount = feeItems.reduce((sum, item) => sum + item.amount, 0);

  const addFeeItem = () => {
    setFeeItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", amount: 0 },
    ]);
  };

  const removeFeeItem = (id: string) => {
    if (feeItems.length <= 1) return;
    setFeeItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateFeeItem = (id: string, field: "name" | "amount", value: string | number) => {
    setFeeItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      semester,
      academicYear,
      feeItems,
      totalAmount,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Term 1 School Fees"
          required
        />
      </div>

      {/* Semester & Academic Year */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="semester">Semester *</Label>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Term 1">Term 1</SelectItem>
              <SelectItem value="Term 2">Term 2</SelectItem>
              <SelectItem value="Term 3">Term 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="academicYear">Academic Year *</Label>
          <Input
            id="academicYear"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="e.g. 2024/2025"
            required
          />
        </div>
      </div>

      {/* Fee Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Fee Items *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addFeeItem}>
            <Plus className="mr-1 h-4 w-4" />
            Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {feeItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                value={item.name}
                onChange={(e) => updateFeeItem(item.id, "name", e.target.value)}
                placeholder={`Fee item ${index + 1}`}
                className="flex-1"
                required
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                value={item.amount || ""}
                onChange={(e) =>
                  updateFeeItem(item.id, "amount", parseFloat(e.target.value) || 0)
                }
                placeholder="Amount"
                className="w-[120px]"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFeeItem(item.id)}
                disabled={feeItems.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex justify-end text-sm font-medium">
          Total: GHS {totalAmount.toFixed(2)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : bill
              ? "Update Bill"
              : "Create Bill"}
        </Button>
      </div>
    </form>
  );
}
