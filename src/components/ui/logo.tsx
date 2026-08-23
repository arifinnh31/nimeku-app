import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  isAdmin?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function Logo({
  href = "/",
  isAdmin = false,
  size = "default",
  className,
}: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7 rounded-lg",
    default: "w-8 h-8 rounded-lg",
    lg: "w-10 h-10 rounded-xl",
  };

  const playSizes = {
    sm: "w-3.5 h-3.5 ml-0.5",
    default: "w-4 h-4 ml-0.5",
    lg: "w-5 h-5 ml-0.5",
  };

  const textSizes = {
    sm: "text-base",
    default: "text-lg",
    lg: "text-2xl",
  };

  const content = (
    <div className={cn("flex items-center gap-2.5 select-none group", className)}>
      {/* Play Icon Badge */}
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-blue-500 via-primary to-indigo-600 shadow-md shadow-primary/25 text-white transition-transform duration-300 group-hover:scale-105",
          iconSizes[size]
        )}
      >
        <Play className={cn("fill-white text-white", playSizes[size])} />
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-2">
        <span className={cn("font-heading font-extrabold tracking-tight", textSizes[size])}>
          <span className="font-heading font-extrabold text-foreground">Nime</span>
          <span className="font-heading font-extrabold text-primary">Ku</span>
        </span>

        {isAdmin && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
            Admin
          </span>
        )}
      </div>

    </div>
  );


  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
