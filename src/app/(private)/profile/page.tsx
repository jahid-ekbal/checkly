"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDaysIcon, MailIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import InlineEditableText from "@/components/profile/InlineEditableText";
import ProfileImageEditor from "@/components/profile/ProfileImageEditor";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { priorityMeta } from "@/components/tasks/priority";
import { apiFetch } from "@/lib/api";

type ProfileData = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    banner: string | null;
    bio: string | null;
    createdAt: string;
  };
  workspace: { name: string };
  myTasks: {
    id: string;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate: string | null;
  }[];
};

const ProfilePage = () => {
  const [data, setData] = useState<ProfileData | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await apiFetch<ProfileData>("/api/me");
      setData(result);
    } catch {
      // leave data null
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      await load();
    };
    void fetchProfile();
  }, [load]);

  const saveField = async (field: "name" | "email" | "bio", value: string) => {
    try {
      await apiFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ [field]: value }),
      });
      await load();
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Something went wrong";
    }
  };

  if (!data) {
    return (
      <div className="text-muted-foreground rounded-lg border p-12 text-center">
        <p className="text-foreground font-medium">Loading profile...</p>
      </div>
    );
  }

  const { user, myTasks } = data;

  const details = [
    {
      label: "Member since",
      value: new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      icon: CalendarDaysIcon,
    },
  ];

  return (
    <section className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">
          Double-click any text to edit it. Hover images to change them.
        </p>
      </div>

      <Card className="overflow-hidden">
        <ProfileImageEditor
          field="banner"
          initial={user.banner}
          className="h-36 sm:h-44"
          imageClassName="h-36 sm:h-44"
          emptyClassName="h-36 sm:h-44"
        />
        <CardContent className="pt-0">
          <div className="-mt-10 flex items-end gap-4">
            <ProfileImageEditor
              field="image"
              initial={user.image}
              className="bg-muted/40 border-background size-20 shrink-0 overflow-hidden rounded-full border-4"
              imageClassName="size-20 rounded-full"
              emptyClassName="size-20 rounded-full"
            />
            <div className="min-w-0 flex-1 pb-1">
              <InlineEditableText
                value={user.name}
                onSave={(value) => saveField("name", value)}
                label="name"
                validate="name"
                displayClassName="font-heading text-xl font-semibold"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <InlineEditableText
              value={user.bio ?? ""}
              onSave={(value) => saveField("bio", value)}
              label="bio"
              multiline
              validate="bio"
              placeholder="Add a bio..."
              displayClassName="text-sm"
            />
            <div className="flex items-center gap-1.5 text-sm">
              <MailIcon className="text-muted-foreground size-4 shrink-0" />
              <InlineEditableText
                value={user.email}
                onSave={(value) => saveField("email", value)}
                label="email"
                validate="email"
                displayClassName="text-muted-foreground"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {details.map((detail) => {
              const Icon = detail.icon;
              return (
                <div
                  key={detail.label}
                  className="bg-muted/50 rounded-lg p-3">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                    <Icon className="size-3.5" />
                    {detail.label}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium capitalize">
                    {detail.value}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg">My tasks</CardTitle>
            <p className="text-muted-foreground text-sm">
              Open tasks assigned to you.
            </p>
          </div>
          <Link
            href="/tasks"
            className="text-primary text-sm font-medium hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {myTasks.length === 0 ?
            <p className="text-muted-foreground text-sm">
              No open tasks assigned to you.
            </p>
          : <ul className="divide-y">
              {myTasks.map((task) => {
                const priority = priorityMeta[task.priority];
                return (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.className}`}>
                      {priority.label}
                    </span>
                    <Link
                      href="/tasks"
                      className="min-w-0 flex-1 truncate text-sm font-medium hover:underline">
                      {task.title}
                    </Link>
                    {task.dueDate && (
                      <span className="text-muted-foreground shrink-0 text-xs">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          }
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Password</CardTitle>
          <p className="text-muted-foreground text-sm">
            Change your password. Other sessions will be signed out.
          </p>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default ProfilePage;
