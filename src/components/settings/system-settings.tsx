"use client";

import { useState } from "react";
import { SystemSettings as SystemSettingsType } from "@/lib/settings-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SystemSettingsProps {
  settings: SystemSettingsType;
  onSave: (settings: SystemSettingsType) => Promise<void>;
}

export function SystemSettings({ settings, onSave }: SystemSettingsProps) {
  const [local, setLocal] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key: keyof SystemSettingsType, value: string) {
    setLocal((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await onSave(local);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Manage school information and academic configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="school-name">School Name</Label>
              <Input
                id="school-name"
                value={local.schoolName}
                onChange={(e) => update("schoolName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school-phone">Phone Number</Label>
              <Input
                id="school-phone"
                value={local.schoolPhone}
                onChange={(e) => update("schoolPhone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school-email">Email</Label>
              <Input
                id="school-email"
                type="email"
                value={local.schoolEmail}
                onChange={(e) => update("schoolEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school-address">Address</Label>
              <Input
                id="school-address"
                value={local.schoolAddress}
                onChange={(e) => update("schoolAddress", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academic-year">Academic Year</Label>
              <Select
                value={local.academicYear}
                onValueChange={(v) => update("academicYear", v)}
              >
                <SelectTrigger id="academic-year">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                  <SelectItem value="2026-2027">2026-2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-term">Current Term</Label>
              <Select
                value={local.currentTerm}
                onValueChange={(v) => update("currentTerm", v)}
              >
                <SelectTrigger id="current-term">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                  <SelectItem value="3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="principal-name">Principal Name</Label>
              <Input
                id="principal-name"
                value={local.principalName}
                onChange={(e) => update("principalName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motto">School Motto</Label>
              <Input
                id="motto"
                value={local.motto}
                onChange={(e) => update("motto", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
            {saved && (
              <span className="text-sm text-success">
                System settings saved successfully
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
