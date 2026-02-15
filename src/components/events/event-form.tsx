"use client";

import { useState } from "react";
import {
  SchoolEvent,
  EventType,
  EventStatus,
  TargetAudience,
  eventTypeConfig,
  eventStatusConfig,
} from "@/lib/event-data";
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

interface EventFormProps {
  event?: SchoolEvent;
  onSubmit: (data: Omit<SchoolEvent, "id" | "createdAt">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EventForm({
  event,
  onSubmit,
  onCancel,
  isSubmitting,
}: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    type: event?.type || ("holiday" as EventType),
    status: event?.status || ("upcoming" as EventStatus),
    startDate: event?.startDate || new Date().toISOString().split("T")[0],
    endDate: event?.endDate || new Date().toISOString().split("T")[0],
    location: event?.location || "",
    organizer: event?.organizer || "",
    targetAudience: event?.targetAudience || ("all" as TargetAudience),
    isRecurring: event?.isRecurring || false,
    description: event?.description || "",
    notes: event?.notes || "",
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<SchoolEvent, "id" | "createdAt">);
  };

  const textareaClasses =
    "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Event title"
          required
        />
      </div>

      {/* Type & Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(eventTypeConfig) as EventType[]).map((type) => (
                <SelectItem key={type} value={type}>
                  {eventTypeConfig[type].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(eventStatusConfig) as EventStatus[]).map(
                (status) => (
                  <SelectItem key={status} value={status}>
                    {eventStatusConfig[status].label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Start Date & End Date */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Event location"
          required
        />
      </div>

      {/* Organizer */}
      <div className="space-y-2">
        <Label htmlFor="organizer">Organizer *</Label>
        <Input
          id="organizer"
          value={formData.organizer}
          onChange={(e) => handleChange("organizer", e.target.value)}
          placeholder="Organizer name or department"
          required
        />
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label htmlFor="targetAudience">Target Audience *</Label>
        <Select
          value={formData.targetAudience}
          onValueChange={(value) => handleChange("targetAudience", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="students">Students</SelectItem>
            <SelectItem value="teachers">Teachers</SelectItem>
            <SelectItem value="parents">Parents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Is Recurring */}
      <div className="flex items-center gap-2">
        <input
          id="isRecurring"
          type="checkbox"
          checked={formData.isRecurring}
          onChange={(e) => handleChange("isRecurring", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isRecurring">Is Recurring Event</Label>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Event description..."
          rows={3}
          required
          className={textareaClasses}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Optional notes..."
          rows={3}
          className={textareaClasses}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : event
              ? "Update Event"
              : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
