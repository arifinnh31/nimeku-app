"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "ghost" | "outline" | "secondary" | "default";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function ThemeToggle({
  className,
  variant = "ghost",
  size = "icon",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={showLabel ? "default" : size}
      onClick={() => toggleTheme()}
      className={cn(
        "shrink-0 transition-transform active:scale-95 flex items-center gap-3",
        showLabel && "justify-start font-normal text-sm",
        className
      )}
      title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45 shrink-0" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-500 transition-transform duration-300 hover:-rotate-12 shrink-0" />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
        </span>
      )}
    </Button>
  );
}

