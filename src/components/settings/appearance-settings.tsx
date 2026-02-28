"use client";

import { useTheme } from "@/contexts/theme-context";
import { Theme } from "@/lib/settings-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const themeOptions: { value: Theme; label: string; icon: React.ElementType; description: string }[] = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    description: "Light background with dark text",
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    description: "Dark background with light text",
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    description: "Follows your device settings",
  },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how the application looks on your device
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:bg-accent",
                  isSelected && "ring-2 ring-primary border-primary"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
