"use client";

import Logo from "@/components/Brand/Logo";
import ThemeToggleButton from "@/components/Layout/ThemeToggleButton";
import { buttonVariants } from "@/components/shadcnui/button";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";

const PublicHeader = () => {
  const { data: session } = authClient.useSession();

  return (
    <header className="bg-background/70 fixed top-0 right-0 left-0 z-50 border-b border-white/10 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Checkly home">
          <Logo />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {session ?
            <Link
              href="/dashboard"
              className={buttonVariants({ size: "sm" })}>
              Dashboard
            </Link>
          : <Link
              href="/sign-in"
              className={buttonVariants({ variant: "outline", size: "sm" })}>
              Sign in
            </Link>
          }
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;
