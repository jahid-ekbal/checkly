import Link from "next/link";
import { CheckCircle2Icon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/shadcnui/card";
import Logo from "@/components/Brand/Logo";
import ThemeToggleButton from "@/components/Layout/ThemeToggleButton";
import { brand } from "@/lib/brand";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="bg-muted/40 relative hidden flex-col justify-between overflow-hidden border-r p-10 lg:flex">
        <div className="bg-primary/20 pointer-events-none absolute -top-32 -left-32 size-96 rounded-full blur-3xl" />
        <div className="bg-primary/10 pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full blur-3xl" />

        <Link href="/">
          <Logo />
        </Link>

        <div className="relative space-y-8">
          <div className="space-y-3">
            <h2 className="font-heading text-4xl font-semibold">
              {brand.hero.headline}
            </h2>
            <p className="text-muted-foreground max-w-md">
              {brand.hero.subheadline}
            </p>
          </div>
          <ul className="space-y-4">
            {brand.features.slice(0, 3).map((feature) => (
              <li
                key={feature.title}
                className="flex items-start gap-3">
                <CheckCircle2Icon className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </p>
      </section>

      <section className="relative flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="absolute top-4 right-4 flex items-center gap-2 sm:top-6 sm:right-6">
          <span className="flex items-center gap-2 lg:hidden">
            <Link href="/">
              <Logo
                iconClassName="size-5"
                textClassName="text-lg"
              />
            </Link>
          </span>
          <ThemeToggleButton />
        </div>

        <Card className="border-muted/50 w-full max-w-md shadow-lg shadow-black/5">
          <CardHeader>
            <Link
              href="/"
              className="mx-auto lg:hidden">
              <Logo
                className="justify-center"
                iconClassName="size-6"
                textClassName="text-2xl"
              />
            </Link>
            <p className="text-muted-foreground text-sm">{brand.tagline}</p>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </section>
    </main>
  );
};

export default AuthLayout;
