"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  School,
  ClipboardCheck,
  FileOutput,
  BookOpen,
  IdCard,
  FileText,
  Calendar,
  FileCheck,
  FileBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/contexts/role-context";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const adminLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/classes", label: "Class Management", icon: School },
  { href: "/subjects", label: "Subject Management", icon: BookOpen },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/output-of-work", label: "Output of Work", icon: FileOutput },
  { href: "/lesson-plans", label: "Lesson Plans", icon: FileText },
  { href: "/id-cards", label: "ID Cards", icon: IdCard },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/examinations", label: "Examinations", icon: FileCheck },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/finance", label: "Finance", icon: DollarSign },
  { href: "/settings", label: "Settings", icon: Settings },
];

const teacherLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "My Students", icon: Users },
  { href: "/classes", label: "My Classes", icon: School },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/output-of-work", label: "Output of Work", icon: FileOutput },
  { href: "/lesson-plans", label: "Lesson Plans", icon: FileText },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/examinations", label: "Examinations", icon: FileCheck },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useRole();

  const links = role === "admin" ? adminLinks : teacherLinks;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              B
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-sidebar-foreground whitespace-nowrap">
                BelgeSMS
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {links.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);

            const linkContent = (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{link.label}</TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
