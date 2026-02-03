"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "@/contexts/role-context";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { role, setRole } = useRole();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMobileMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className={role === "teacher" ? "font-medium" : "text-muted-foreground"}>
            Teacher
          </span>
          <Switch
            checked={role === "admin"}
            onCheckedChange={(checked) => setRole(checked ? "admin" : "teacher")}
          />
          <span className={role === "admin" ? "font-medium" : "text-muted-foreground"}>
            Admin
          </span>
        </div>

        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-600" />
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            FA
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
