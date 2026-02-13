"use client";

import { useState, useMemo } from "react";
import { LessonPlan } from "@/lib/lesson-plan-data";
import { Term, terms } from "@/lib/output-of-work-data";
import { subjects } from "@/lib/subject-data";
import { classes } from "@/lib/class-data";
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

interface LessonPlanFormProps {
  plan?: LessonPlan;
  teacherId: string;
  onSubmit: (data: {
    classId: string;
    subjectId: string;
    term: Term;
    weekNumber: number;
    title: string;
    topic: string;
    description: string;
    learningObjectives: string[];
    activities: string;
    resources: string;
    assessmentMethod: string;
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function LessonPlanForm({
  plan,
  teacherId,
  onSubmit,
  onCancel,
  isSubmitting,
}: LessonPlanFormProps) {
  const [formData, setFormData] = useState({
    classId: plan?.classId || "",
    subjectId: plan?.subjectId || "",
    term: plan?.term || ("" as string),
    weekNumber: plan?.weekNumber?.toString() || "",
    title: plan?.title || "",
    topic: plan?.topic || "",
    description: plan?.description || "",
    activities: plan?.activities || "",
    resources: plan?.resources || "",
    assessmentMethod: plan?.assessmentMethod || "",
  });

  const [objectives, setObjectives] = useState<string[]>(
    plan?.learningObjectives?.length ? plan.learningObjectives : [""]
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filter subjects where this teacher is assigned
  const teacherSubjects = useMemo(() => {
    return subjects.filter(
      (s) => s.status === "active" && s.teacherIds.includes(teacherId)
    );
  }, [teacherId]);

  const activeClasses = useMemo(() => {
    return classes.filter((c) => c.status === "active");
  }, []);

  const weekNumbers = Array.from({ length: 14 }, (_, i) => i + 1);

  const handleObjectiveChange = (index: number, value: string) => {
    setObjectives((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addObjective = () => {
    setObjectives((prev) => [...prev, ""]);
  };

  const removeObjective = (index: number) => {
    if (objectives.length <= 1) return;
    setObjectives((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      classId: formData.classId,
      subjectId: formData.subjectId,
      term: formData.term as Term,
      weekNumber: parseInt(formData.weekNumber),
      title: formData.title,
      topic: formData.topic,
      description: formData.description,
      learningObjectives: objectives.filter((o) => o.trim() !== ""),
      activities: formData.activities,
      resources: formData.resources,
      assessmentMethod: formData.assessmentMethod,
    });
  };

  const textareaClasses =
    "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subjectId">Subject *</Label>
        <Select
          value={formData.subjectId}
          onValueChange={(value) => handleChange("subjectId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {teacherSubjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Class */}
      <div className="space-y-2">
        <Label htmlFor="classId">Class *</Label>
        <Select
          value={formData.classId}
          onValueChange={(value) => handleChange("classId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {activeClasses.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Term and Week */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="term">Term *</Label>
          <Select
            value={formData.term}
            onValueChange={(value) => handleChange("term", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              {terms.map((term) => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="weekNumber">Week Number *</Label>
          <Select
            value={formData.weekNumber}
            onValueChange={(value) => handleChange("weekNumber", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {weekNumbers.map((week) => (
                <SelectItem key={week} value={week.toString()}>
                  Week {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Lesson plan title"
          required
        />
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <Label htmlFor="topic">Topic *</Label>
        <Input
          id="topic"
          value={formData.topic}
          onChange={(e) => handleChange("topic", e.target.value)}
          placeholder="Lesson topic"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe the lesson plan..."
          rows={3}
          required
          className={textareaClasses}
        />
      </div>

      {/* Learning Objectives */}
      <div className="space-y-2">
        <Label>Learning Objectives *</Label>
        <div className="space-y-2">
          {objectives.map((obj, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-6 text-right">
                {index + 1}.
              </span>
              <Input
                value={obj}
                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                placeholder={`Objective ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeObjective(index)}
                disabled={objectives.length <= 1}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addObjective}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Objective
          </Button>
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-2">
        <Label htmlFor="activities">Activities *</Label>
        <textarea
          id="activities"
          value={formData.activities}
          onChange={(e) => handleChange("activities", e.target.value)}
          placeholder="Describe the planned activities..."
          rows={3}
          required
          className={textareaClasses}
        />
      </div>

      {/* Resources */}
      <div className="space-y-2">
        <Label htmlFor="resources">Resources *</Label>
        <textarea
          id="resources"
          value={formData.resources}
          onChange={(e) => handleChange("resources", e.target.value)}
          placeholder="List required resources..."
          rows={3}
          required
          className={textareaClasses}
        />
      </div>

      {/* Assessment Method */}
      <div className="space-y-2">
        <Label htmlFor="assessmentMethod">Assessment Method *</Label>
        <textarea
          id="assessmentMethod"
          value={formData.assessmentMethod}
          onChange={(e) => handleChange("assessmentMethod", e.target.value)}
          placeholder="Describe how students will be assessed..."
          rows={3}
          required
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
            : plan
              ? "Update Lesson Plan"
              : "Create Lesson Plan"}
        </Button>
      </div>
    </form>
  );
}
