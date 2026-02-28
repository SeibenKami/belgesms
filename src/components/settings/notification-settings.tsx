"use client";

import { useState } from "react";
import { NotificationSettings as NotificationSettingsType } from "@/lib/settings-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onSave: (settings: NotificationSettingsType) => Promise<void>;
}

export function NotificationSettings({
  settings,
  onSave,
}: NotificationSettingsProps) {
  const [local, setLocal] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggle(key: keyof NotificationSettingsType) {
    setLocal((prev) => ({ ...prev, [key]: !prev[key] }));
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
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Channels */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Notification Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif">Email Notifications</Label>
                <Switch
                  id="email-notif"
                  checked={local.emailNotifications}
                  onCheckedChange={() => toggle("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notif">SMS Notifications</Label>
                <Switch
                  id="sms-notif"
                  checked={local.smsNotifications}
                  onCheckedChange={() => toggle("smsNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notif">Push Notifications</Label>
                <Switch
                  id="push-notif"
                  checked={local.pushNotifications}
                  onCheckedChange={() => toggle("pushNotifications")}
                />
              </div>
            </div>
          </div>

          {/* Alert Types */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Alert Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="attendance-alerts">Attendance Alerts</Label>
                <Switch
                  id="attendance-alerts"
                  checked={local.attendanceAlerts}
                  onCheckedChange={() => toggle("attendanceAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="grade-updates">Grade Updates</Label>
                <Switch
                  id="grade-updates"
                  checked={local.gradeUpdates}
                  onCheckedChange={() => toggle("gradeUpdates")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="event-reminders">Event Reminders</Label>
                <Switch
                  id="event-reminders"
                  checked={local.eventReminders}
                  onCheckedChange={() => toggle("eventReminders")}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
            {saved && (
              <span className="text-sm text-success">
                Preferences saved successfully
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
