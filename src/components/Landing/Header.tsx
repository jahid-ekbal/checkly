import Link from "next/link";
import Logo from "@/components/Brand/Logo";
import ThemeToggleButton from "@/components/Layout/ThemeToggleButton";
import { Button } from "@/components/shadcnui/button";
import { getSession } from "@/lib/auth/session";

const LandingHeader = async () => {
  const session = await getSession();

  return (
    <header className="bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Checkly home">
          <Logo />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/#features"
            className="text-muted-foreground hover:text-foreground hidden text-sm font-medium transition-colors sm:block">
            Features
          </Link>
          <ThemeToggleButton />
          {session ?
            <Button
              size="sm"
              render={<Link href="/dashboard" />}>
              Dashboard
            </Button>
          : <>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/sign-in" />}>
                Sign in
              </Button>
              <Button
                size="sm"
                render={<Link href="/sign-up" />}>
                Get started
              </Button>
            </>
          }
        </nav>
      </div>
    </header>
  );
};

export default LandingHeader;
