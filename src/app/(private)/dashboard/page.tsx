"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  Building2Icon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ListChecksIcon,
  ShieldCheckIcon,
  UsersIcon,
  Settings2Icon,
  UserCircle2Icon,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth/auth-client";

type DashboardData = {
  stats: {
    workspaceName: string;
    role: string;
    memberCount: number;
    memberSince: string;
  };
  taskStats: {
    open: number;
    completedWeek: number;
    overdue: number;
  };
};

const DashboardPage = () => {
  const { data: session } = authClient.useSession();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    void apiFetch<DashboardData>("/api/dashboard")
      .then(setData)
      .catch(() => {
        // leave data null
      });
  }, []);

  if (!data || !session) {
    return (
      <div className="text-muted-foreground rounded-lg border p-12 text-center">
        <p className="text-foreground font-medium">Loading dashboard...</p>
      </div>
    );
  }

  const { stats, taskStats } = data;
  const isAdmin = session.user.role === "admin";

  const statCards = [
    {
      label: "Workspace",
      value: stats.workspaceName,
      icon: Building2Icon,
    },
    {
      label: "Your role",
      value: stats.role,
      icon: ShieldCheckIcon,
    },
    {
      label: "Members",
      value: String(stats.memberCount),
      icon: UsersIcon,
    },
    {
      label: "Member since",
      value: new Date(stats.memberSince).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      icon: CalendarDaysIcon,
    },
  ];

  const taskCards = [
    {
      label: "Open tasks",
      value: String(taskStats.open),
      icon: ListChecksIcon,
    },
    {
      label: "Completed this week",
      value: String(taskStats.completedWeek),
      icon: CheckCircle2Icon,
    },
    {
      label: "Overdue",
      value: String(taskStats.overdue),
      icon: AlertCircleIcon,
    },
  ];

  const links: {
    title: string;
    description: string;
    href: "/tasks" | "/profile" | "/members" | "/settings";
    icon: typeof ListChecksIcon;
  }[] = [
    {
      title: "Tasks",
      description: "Create, assign, and complete tasks.",
      href: "/tasks",
      icon: ListChecksIcon,
    },
    {
      title: "Profile",
      description: "View and update your account details.",
      href: "/profile",
      icon: UserCircle2Icon,
    },
    ...(isAdmin ?
      [
        {
          title: "Members",
          description: "Create accounts and manage roles.",
          href: "/members" as const,
          icon: UsersIcon,
        },
        {
          title: "Settings",
          description: "Manage workspace name and description.",
          href: "/settings" as const,
          icon: Settings2Icon,
        },
      ]
    : []),
  ];

  return (
    <section className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-semibold">
          Welcome back, {session.user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in your workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl border p-5 shadow-sm">
              <div className="bg-primary/10 mb-3 flex size-9 items-center justify-center rounded-lg">
                <Icon className="text-primary size-4.5" />
              </div>
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {stat.label}
              </p>
              <p className="font-heading mt-0.5 truncate text-lg font-semibold capitalize">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {taskCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl border p-5 shadow-sm">
              <div className="bg-primary/10 mb-3 flex size-9 items-center justify-center rounded-lg">
                <Icon className="text-primary size-4.5" />
              </div>
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {stat.label}
              </p>
              <p className="font-heading mt-0.5 truncate text-lg font-semibold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">Quick links</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                className="group bg-card hover:border-primary/40 rounded-xl border p-5 shadow-sm transition-all hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="bg-primary/10 flex size-9 items-center justify-center rounded-lg">
                    <Icon className="text-primary size-4.5" />
                  </div>
                  <ArrowRightIcon className="text-muted-foreground group-hover:text-primary size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
                <h3 className="font-medium">{link.title}</h3>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {link.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
