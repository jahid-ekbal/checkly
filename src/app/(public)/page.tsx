import Footer from "@/components/Landing/Footer";
import { buttonVariants } from "@/components/shadcnui/button";
import { getSession } from "@/lib/auth/session";
import { brand } from "@/lib/brand";
import {
  ArrowRightIcon,
  FingerprintIcon,
  Settings2Icon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `${brand.name} - ${brand.tagline}`,
  description: brand.description,
};

const featureIcons = [
  UsersIcon,
  ShieldCheckIcon,
  Settings2Icon,
  FingerprintIcon,
];

const LandingPage = async () => {
  const session = await getSession();

  return (
    <>
      <main>
        <section className="relative overflow-hidden">
          <div className="bg-primary/15 pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full blur-3xl" />
          <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
            <div className="space-y-6">
              <span className="bg-muted/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border border-dashed px-4 py-1.5 text-sm">
                <ShieldCheckIcon className="text-primary size-4" />
                {brand.tagline}
              </span>
              <h1 className="font-heading mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {brand.hero.headline}
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
                {brand.hero.subheadline}
              </p>
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
            </div>
          </div>
        </section>

        <section
          id="features"
          className="bg-muted/40 border-t py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
              <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
                Everything you need to run your workspace
              </h2>
              <p className="text-muted-foreground">
                From member management to role-based access, Checkly has your
                team covered.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {brand.features.map((feature, index) => {
                const Icon = featureIcons[index % featureIcons.length];
                return (
                  <div
                    key={feature.title}
                    className="bg-background rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="bg-primary/10 mb-4 flex size-10 items-center justify-center rounded-lg">
                      <Icon className="text-primary size-5" />
                    </div>
                    <h3 className="font-heading mb-1.5 font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;
