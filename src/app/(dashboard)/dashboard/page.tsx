"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRole } from "@/contexts/role-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Calendar, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "1,234",
    description: "+12% from last month",
    icon: Users,
  },
  {
    title: "Total Teachers",
    value: "56",
    description: "+2 new this semester",
    icon: GraduationCap,
  },
  {
    title: "Classes Today",
    value: "24",
    description: "8 AM - 4 PM",
    icon: Calendar,
  },
  {
    title: "Revenue",
    value: "$45,231",
    description: "+8% from last month",
    icon: DollarSign,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { role } = useRole();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! You are logged in as {role}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your school</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity feed coming soon...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Quick actions coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
