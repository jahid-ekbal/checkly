"use client";

import { useEffect, useState } from "react";
import ThemeToggleButton from "@/components/Layout/ThemeToggleButton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnui/avatar";
import { Button } from "@/components/shadcnui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcnui/dropdown-menu";
import { SidebarTrigger } from "@/components/shadcnui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcnui/tooltip";
import { authClient } from "@/lib/auth/auth-client";
import { apiFetch } from "@/lib/api";
import { LogOutIcon, UserCircle2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const PrivateHeader = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [workspaceName, setWorkspaceName] = useState("Checkly");

  useEffect(() => {
    void apiFetch<{ workspace: { name: string } }>("/api/me")
      .then((data) => setWorkspaceName(data.workspace.name))
      .catch(() => {
        // keep default name
      });
  }, []);

  const signOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  if (!session) return null;

  const user = session.user;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="border-b">
      <div className="flex h-14 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger render={<SidebarTrigger className="lg:hidden" />} />
            <TooltipContent>Toggle sidebar</TooltipContent>
          </Tooltip>
          <span className="font-heading font-semibold">{workspaceName}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <Avatar className="size-6">
                {user.image && (
                  <AvatarImage
                    src={user.image}
                    alt={user.name}
                  />
                )}
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">{user.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push("/profile")}>
                <UserCircle2Icon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={signOut}>
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PrivateHeader;
