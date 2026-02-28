"use client";

import { useState } from "react";
import { useRole } from "@/contexts/role-context";
import {
  NotificationSettings as NotificationSettingsType,
  SystemSettings as SystemSettingsType,
  defaultNotificationSettings,
  defaultSystemSettings,
} from "@/lib/settings-data";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { PasswordSettings } from "@/components/settings/password-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { SystemSettings } from "@/components/settings/system-settings";
import { Button } from "@/components/ui/button";
import { User, Lock, Bell, Palette, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "profile" | "password" | "notifications" | "appearance" | "system";

const allTabs: {
  key: Tab;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "password", label: "Password", icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "system", label: "System", icon: Building2, adminOnly: true },
];

export default function SettingsPage() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [notifications, setNotifications] = useState<NotificationSettingsType>(
    defaultNotificationSettings
  );
  const [systemSettings, setSystemSettings] = useState<SystemSettingsType>(
    defaultSystemSettings
  );

  const tabs = allTabs.filter((tab) => !tab.adminOnly || role === "admin");

  async function handleNotificationSave(settings: NotificationSettingsType) {
    await new Promise((r) => setTimeout(r, 500));
    setNotifications(settings);
  }

  async function handleSystemSave(settings: SystemSettingsType) {
    await new Promise((r) => setTimeout(r, 500));
    setSystemSettings(settings);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "gap-2",
                activeTab !== tab.key && "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && <ProfileSettings />}
      {activeTab === "password" && <PasswordSettings />}
      {activeTab === "notifications" && (
        <NotificationSettings
          settings={notifications}
          onSave={handleNotificationSave}
        />
      )}
      {activeTab === "appearance" && <AppearanceSettings />}
      {activeTab === "system" && role === "admin" && (
        <SystemSettings
          settings={systemSettings}
          onSave={handleSystemSave}
        />
      )}
    </div>
  );
}
