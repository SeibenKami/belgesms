"use client";

import { useState, useMemo } from "react";
import {
  SchoolEvent,
  EventType,
  EventStatus,
  initialEvents,
  eventTypeConfig,
  eventStatusConfig,
  generateEventId,
  exportEventsToCSV,
} from "@/lib/event-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/events/event-form";
import { EventDetails } from "@/components/events/event-details";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  CalendarDays,
} from "lucide-react";

type ModalMode = "view" | "add" | "edit" | null;

export default function EventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "all" || event.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, searchQuery, typeFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: events.length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      ongoing: events.filter((e) => e.status === "ongoing").length,
      completed: events.filter((e) => e.status === "completed").length,
    };
  }, [events]);

  const openModal = (mode: ModalMode, event?: SchoolEvent) => {
    setModalMode(mode);
    setSelectedEvent(event || null);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedEvent(null);
  };

  const handleAddEvent = async (
    data: Omit<SchoolEvent, "id" | "createdAt">
  ) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newEvent: SchoolEvent = {
      ...data,
      id: generateEventId(),
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    setIsSubmitting(false);
    closeModal();
  };

  const handleEditEvent = async (
    data: Omit<SchoolEvent, "id" | "createdAt">
  ) => {
    if (!selectedEvent) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setEvents((prev) =>
      prev.map((e) =>
        e.id === selectedEvent.id
          ? { ...data, id: selectedEvent.id, createdAt: selectedEvent.createdAt }
          : e
      )
    );
    setIsSubmitting(false);
    closeModal();
  };

  const handleDeleteEvent = (event: SchoolEvent) => {
    if (
      confirm(
        `Are you sure you want to delete the event "${event.title}"?`
      )
    ) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const e = new Date(end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return start === end ? e : `${s} – ${e}`;
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage school-wide events, holidays, and activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportEventsToCSV(filteredEvents)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => openModal("add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ongoing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="h-2 w-2 rounded-full bg-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, or organizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(Object.keys(eventTypeConfig) as EventType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {eventTypeConfig[type].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
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

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead className="hidden sm:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Audience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => {
                const typeConf = eventTypeConfig[event.type];
                const statusConf = eventStatusConfig[event.status];

                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <Badge className={`mt-1 ${typeConf.color}`}>
                          {typeConf.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDateRange(event.startDate, event.endDate)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {event.location}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {audienceLabels[event.targetAudience] || event.targetAudience}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConf.color}>
                        {statusConf.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openModal("view", event)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("edit", event)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteEvent(event)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredEvents.length} of {events.length} events
      </div>

      {/* View Details Dialog */}
      <Dialog open={modalMode === "view"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              View detailed event information.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onEdit={() => setModalMode("edit")}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={modalMode === "add"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>
              Create a new school event.
            </DialogDescription>
          </DialogHeader>
          <EventForm
            onSubmit={handleAddEvent}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={modalMode === "edit"} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details below.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EventForm
              event={selectedEvent}
              onSubmit={handleEditEvent}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
