"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboardIcon,
  ListChecksIcon,
  UsersIcon,
  Settings2Icon,
  UserCircle2Icon,
  LogOutIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/shadcnui/sidebar";
import Logo from "@/components/Brand/Logo";

const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  if (!session) return null;

  const user = session.user;
  const canManage = user.role === "admin";

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Tasks", href: "/tasks", icon: ListChecksIcon },
    { title: "Profile", href: "/profile", icon: UserCircle2Icon },
    { title: "Members", href: "/members", icon: UsersIcon, adminOnly: true },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings2Icon,
      adminOnly: true,
    },
  ] as const;

  const visibleItems = navItems.filter(
    (item) => !("adminOnly" in item) || canManage,
  );

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <Link href="/">
            <Logo
              iconClassName="size-5"
              textClassName="text-lg"
            />
          </Link>
          <SidebarTrigger className="lg:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      render={<Link href={item.href} />}>
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="flex items-center gap-3 px-2 py-1">
          <Link
            href="/profile"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-md transition-colors hover:opacity-80">
            <Avatar className="size-8">
              {user.image && (
                <AvatarImage
                  src={user.image}
                  alt={user.name}
                />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {user.email}
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="text-muted-foreground hover:text-destructive rounded-md p-1.5 transition-colors"
            aria-label="Sign out">
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
