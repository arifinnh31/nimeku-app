"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, Tv, LogOut, Play, Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { logout } from "@/actions/auth";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";


const ADMIN_LINKS = [

  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/anime", label: "Kelola Anime", icon: Film },
  { href: "/admin/episodes", label: "Kelola Episode", icon: Tv },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <aside className="w-64 h-full shrink-0 border-r border-border/50 bg-card/50 hidden lg:flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="p-5">
          <Logo href="/admin" isAdmin />
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
          <ThemeToggle
            variant="ghost"
            showLabel
            className="w-full justify-start px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50"
          />
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <Play className="w-4 h-4" />
            Ke Website
          </Link>
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin mengakhiri sesi Admin?"
        confirmText="Keluar"
        variant="destructive"
        onConfirm={async () => {
          const toastId = toast.loading("Mengeluarkan akun...");
          try {
            const supabase = createClient();
            await logout();
            await supabase.auth.signOut();
            toast.success("Anda berhasil logout.", { id: toastId });
          } catch (err: any) {
            console.error("Logout info:", err);
            toast.success("Anda berhasil logout.", { id: toastId });
          } finally {
            setLogoutOpen(false);
            window.location.href = "/";
          }
        }}

      />

    </>
  );
}

export function AdminMobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <header className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <Logo href="/admin" isAdmin size="sm" />

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="shrink-0" />
              }
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-6 flex flex-col justify-between">
              <div>
                <SheetTitle className="p-0 pb-5 mb-5 border-b border-border/50">
                  <Logo href="/admin" isAdmin />
                </SheetTitle>
                <nav className="flex flex-col gap-1">
                  {ADMIN_LINKS.map((link) => {
                    const isActive =
                      link.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-1">
                <ThemeToggle
                  variant="ghost"
                  showLabel
                  className="w-full justify-start px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl"
                />
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  <Play className="w-5 h-5" />
                  Ke Website
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    setLogoutOpen(true);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 text-left w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin mengakhiri sesi Admin?"
        confirmText="Keluar"
        variant="destructive"
        onConfirm={async () => {
          const toastId = toast.loading("Mengeluarkan akun...");
          try {
            const supabase = createClient();
            await logout();
            await supabase.auth.signOut();
            toast.success("Anda berhasil logout.", { id: toastId });
          } catch (err: any) {
            console.error("Logout info:", err);
            toast.success("Anda berhasil logout.", { id: toastId });
          } finally {
            setLogoutOpen(false);
            window.location.href = "/";
          }
        }}

      />

    </>
  );
}



