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
import { requireUser } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";

const DashboardPage = async () => {
  const session = await requireUser();

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));

  const [user, memberCount, workspace, openTasks, completedThisWeek, overdue] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id } }),
      prisma.user.count(),
      prisma.workspace.findFirst(),
      prisma.task.count({ where: { done: false } }),
      prisma.task.count({
        where: { done: true, completedAt: { gte: startOfWeek } },
      }),
      prisma.task.count({
        where: { done: false, dueDate: { lt: now } },
      }),
    ]);

  const name = user?.name ?? session.user.name;

  const stats = [
    {
      label: "Workspace",
      value: workspace?.name ?? "—",
      icon: Building2Icon,
    },
    {
      label: "Your role",
      value: user?.role ?? "member",
      icon: ShieldCheckIcon,
    },
    {
      label: "Members",
      value: String(memberCount),
      icon: UsersIcon,
    },
    {
      label: "Member since",
      value: new Date(
        user?.createdAt ?? session.user.createdAt,
      ).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      icon: CalendarDaysIcon,
    },
  ];

  const taskStats = [
    {
      label: "Open tasks",
      value: String(openTasks),
      icon: ListChecksIcon,
    },
    {
      label: "Completed this week",
      value: String(completedThisWeek),
      icon: CheckCircle2Icon,
    },
    {
      label: "Overdue",
      value: String(overdue),
      icon: AlertCircleIcon,
    },
  ];

  const links = [
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
    {
      title: "Members",
      description: "Create accounts and manage roles.",
      href: "/members",
      icon: UsersIcon,
    },
    {
      title: "Settings",
      description: "Manage workspace name and description.",
      href: "/settings",
      icon: Settings2Icon,
    },
  ] as const;

  return (
    <section className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-semibold">
          Welcome back, {name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in your workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
        {taskStats.map((stat) => {
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
