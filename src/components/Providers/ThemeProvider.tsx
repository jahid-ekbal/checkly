"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps } from "react";
import { Toaster } from "../shadcnui/toast";
import { TooltipProvider } from "../shadcnui/tooltip";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider delay={300}>{children}</TooltipProvider>

      <Toaster timeout={2000} />
    </NextThemesProvider>
  );
};

export default ThemeProvider;
