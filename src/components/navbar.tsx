"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import {
  Search,
  Menu,
  Moon,
  Sun,
  Home,
  BookOpen,
  Calendar,
  Play,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/actions/auth";

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/catalog", label: "Katalog", icon: BookOpen },
  { href: "/schedule", label: "Jadwal", icon: Calendar },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight">
            Nime<span className="text-primary">Ku</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div className="flex-1 flex justify-end md:justify-center max-w-md mx-auto">
          <form 
            className="hidden md:flex relative w-full"
            onSubmit={(e) => {
              e.preventDefault();
              if (navSearchQuery.trim()) {
                router.push(`/catalog?q=${encodeURIComponent(navSearchQuery.trim())}`);
                setNavSearchQuery("");
              }
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari anime..."
              className="pl-9 bg-secondary/50 border-border/50 focus:bg-secondary"
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
            />
          </form>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="shrink-0"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* Auth / Admin */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link href="/admin">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild className="gap-2">
              <Link href="/login">
                <User className="w-4 h-4" />
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden shrink-0" />}
          >
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-bold text-lg">
                Nime<span className="text-primary">Ku</span>
              </span>
            </SheetTitle>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              <Separator className="my-4" />
              
              {user ? (
                <>
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Admin Panel
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
                >
                  <User className="w-5 h-5" />
                  Login Admin
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-border/40 p-3">
          <form 
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              if (navSearchQuery.trim()) {
                router.push(`/catalog?q=${encodeURIComponent(navSearchQuery.trim())}`);
                setNavSearchQuery("");
                setSearchOpen(false);
              }
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari anime..."
              className="pl-9 bg-secondary/50"
              autoFocus
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </header>
  );
}
