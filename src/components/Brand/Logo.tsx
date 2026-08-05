import { ShieldCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/brand";

const Logo = ({
  className,
  iconClassName,
  textClassName,
}: {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}) => {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <ShieldCheckIcon className={cn("text-primary", iconClassName)} />
      <span className={cn("font-heading text-xl font-semibold", textClassName)}>
        {brand.name}
      </span>
    </span>
  );
};

export default Logo;
