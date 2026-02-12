"use client";

import { useState } from "react";
import {
  TermConfig,
  Term,
  terms,
  componentLabels,
} from "@/lib/output-of-work-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save, Info } from "lucide-react";

interface TermConfigProps {
  config: TermConfig;
  onConfigChange: (config: TermConfig) => void;
}

export function TermConfiguration({ config, onConfigChange }: TermConfigProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [localConfig, setLocalConfig] = useState<TermConfig>(config);

  const handleTermChange = (term: Term) => {
    setLocalConfig((prev) => ({ ...prev, term }));
  };

  const handleAssessmentCountChange = (key: string, value: number) => {
    setLocalConfig((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.key === key ? { ...c, requiredAssessments: Math.max(1, value) } : c
      ),
    }));
  };

  const handleMaxScoreChange = (key: string, value: number) => {
    setLocalConfig((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.key === key ? { ...c, maxScore: Math.max(1, value) } : c
      ),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onConfigChange(localConfig);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Term Configuration</CardTitle>
          <CardDescription>
            Set up the assessment structure for the selected term
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Academic Year & Term */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Input value={localConfig.academicYear} disabled />
            </div>
            <div className="space-y-2">
              <Label>Term</Label>
              <Select
                value={localConfig.term}
                onValueChange={(v) => handleTermChange(v as Term)}
              >
                <SelectTrigger>
                  <SelectValue />
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
          </div>

          {/* Components Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Required Assessments</TableHead>
                  <TableHead>Max Score (per assessment)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localConfig.components.map((comp) => (
                  <TableRow key={comp.key}>
                    <TableCell className="font-medium">
                      {componentLabels[comp.key]}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        value={comp.requiredAssessments}
                        onChange={(e) =>
                          handleAssessmentCountChange(
                            comp.key,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={comp.maxScore}
                        onChange={(e) =>
                          handleMaxScoreChange(
                            comp.key,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-20"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>
                Configuration defines how many assessments are required per
                component and the maximum score for each.
              </span>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
