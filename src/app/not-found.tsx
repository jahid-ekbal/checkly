import Link from "next/link";
import type { Metadata } from "next";
import CatCluster, { CatSilhouette } from "@/components/not-found/CatCluster";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "404 - Page not found",
};

const NotFound = () => {
  return (
    <main className="bg-background text-foreground relative flex min-h-dvh flex-col overflow-hidden">
      <div className="absolute top-8 left-6 max-w-sm sm:left-8">
        <p className="text-sm sm:text-base">
          We&apos;re not sure what happened there&mdash;sorry! Check for typos,
          try again?
        </p>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mt-2 inline-block text-sm underline underline-offset-4 transition-colors">
          Back to home
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <CatCluster />
      </div>

      <div className="absolute bottom-6 left-6 flex items-center gap-2 sm:left-8">
        <CatSilhouette
          width={24}
          height={24}
          className="text-foreground"
        />
        <span className="text-sm font-medium">Error</span>
      </div>

      <span
        className="text-foreground/30 absolute right-6 bottom-4 text-3xl font-light sm:right-8"
        aria-hidden="true">
        +
      </span>

      <p className="text-muted-foreground absolute right-6 bottom-6 hidden text-xs sm:block">
        © {new Date().getFullYear()} {brand.name}
      </p>
    </main>
  );
};

export default NotFound;
