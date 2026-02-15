"use client";

import {
  SchoolEvent,
  eventTypeConfig,
  eventStatusConfig,
} from "@/lib/event-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Tag,
  Repeat,
  FileText,
  Edit,
} from "lucide-react";

interface EventDetailsProps {
  event: SchoolEvent;
  onEdit: () => void;
  onClose: () => void;
}

export function EventDetails({ event, onEdit, onClose }: EventDetailsProps) {
  const typeConfig = eventTypeConfig[event.type];
  const statusConfig = eventStatusConfig[event.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const audienceLabels: Record<string, string> = {
    all: "All",
    students: "Students",
    teachers: "Teachers",
    parents: "Parents",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-sm text-muted-foreground">{event.id}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>
      </div>

      <Separator />

      {/* Event Details */}
      <div>
        <h3 className="mb-3 font-medium">Event Details</h3>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>Type: {typeConfig.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Start Date: {formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>End Date: {formatDate(event.endDate)}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Location: {event.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Organizer: {event.organizer}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              Audience: {audienceLabels[event.targetAudience] || event.targetAudience}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            <span>Recurring: {event.isRecurring ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Created At: {formatDateTime(event.createdAt)}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="mb-3 font-medium">Description</h3>
        <div className="flex items-start gap-3 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span>{event.description}</span>
        </div>
      </div>

      {/* Notes (conditional) */}
      {event.notes && (
        <>
          <Separator />
          <div>
            <h3 className="mb-3 font-medium">Notes</h3>
            <div className="flex items-start gap-3 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span>{event.notes}</span>
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
          Edit Event
        </Button>
      </div>
    </div>
  );
}
