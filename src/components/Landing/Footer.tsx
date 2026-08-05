import Link from "next/link";
import Logo from "@/components/Brand/Logo";
import { brand } from "@/lib/brand";

const Footer = () => {
  return (
    <footer className="bg-muted/40 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm">
              {brand.footer.description}
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold">Product</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/#features"
                  className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="hover:text-foreground transition-colors">
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="hover:text-foreground transition-colors">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold">Account</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-foreground transition-colors">
                  Workspace dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="hover:text-foreground transition-colors">
                  Manage members
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="hover:text-foreground transition-colors">
                  Workspace settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6">
          <p className="text-muted-foreground text-center text-xs">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
