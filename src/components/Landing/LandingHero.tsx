"use client";

import { buttonVariants } from "@/components/shadcnui/button";
import { authClient } from "@/lib/auth/auth-client";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const LandingHero = () => {
  const { data: session } = authClient.useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
      {session ?
        <Link
          href="/dashboard"
          className={buttonVariants({
            size: "lg",
            className: "w-full sm:w-auto",
          })}>
          Go to dashboard
          <ArrowRightIcon />
        </Link>
      : <>
          <Link
            href="/sign-up"
            className={buttonVariants({
              size: "lg",
              className: "w-full sm:w-auto",
            })}>
            Get started
            <ArrowRightIcon />
          </Link>
          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto",
            })}>
            Sign in
          </Link>
        </>
      }
    </div>
  );
};

export default LandingHero;
