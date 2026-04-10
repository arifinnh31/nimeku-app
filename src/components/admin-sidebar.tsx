"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, Tv, LogOut, Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";


const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/anime", label: "Kelola Anime", icon: Film },
  { href: "/admin/episodes", label: "Kelola Episode", icon: Tv },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border/50 bg-card/50 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-5">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-bold text-lg">
            Nime<span className="text-primary">Ku</span>
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">
            Admin
          </span>
        </Link>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {ADMIN_LINKS.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Kembali ke Website
        </Link>
      </div>
    </aside>
  );
}
