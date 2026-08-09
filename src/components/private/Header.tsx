"use client";

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
import { authClient } from "@/lib/auth/auth-client";
import { LogOutIcon, UserCircle2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

type PrivateHeaderProps = {
  user: {
    name: string;
    email: string;
    username: string | null;
    image: string | null;
    role: string;
  };
  workspaceName: string;
};

const PrivateHeader = ({ user, workspaceName }: PrivateHeaderProps) => {
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

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
          <SidebarTrigger className="lg:hidden" />
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
                    {user.username ? `@${user.username}` : user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="pointer-events-none">
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium capitalize">
                  {user.role}
                </span>
              </DropdownMenuItem>
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
