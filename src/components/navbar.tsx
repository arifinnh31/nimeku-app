"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Menu,
  Home,
  BookOpen,
  Calendar,
  User,
  LayoutDashboard,
  Star,
  History,
  Bookmark,
  X,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { searchAnime } from "@/actions/anime";
import { UserHistoryDialog } from "@/components/user-history-dialog";
import { UserBookmarkDialog } from "@/components/user-bookmark-dialog";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";


const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/catalog", label: "Katalog", icon: BookOpen },
  { href: "/schedule", label: "Jadwal", icon: Calendar },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
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

  // Live search debounce
  useEffect(() => {
    if (!navSearchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchAnime(navSearchQuery);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [navSearchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(navSearchQuery.trim())}`);
      setShowDropdown(false);
      setNavSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center gap-3 md:gap-4 px-4">
        {/* Logo */}
        <Logo href="/" />


        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
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
        <div
          ref={searchContainerRef}
          className="flex-1 flex justify-end md:justify-center max-w-md mx-auto relative"
        >
          <form
            className="hidden md:flex relative w-full"
            onSubmit={handleSearchSubmit}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari anime..."
              className="pl-9 pr-8 bg-secondary/50 border-border/50 focus:bg-secondary transition-all"
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
            />
            {searching ? (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
            ) : navSearchQuery ? (
              <button
                type="button"
                onClick={() => setNavSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </form>

          {/* Search Dropdown Results (Desktop) */}
          {showDropdown && navSearchQuery.trim() && (
            <div className="hidden md:block absolute top-full left-0 right-0 mt-2 bg-popover/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="p-2 divide-y divide-border/40">
                {searchResults.length === 0 && !searching ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    Tidak ada anime yang ditemukan untuk &ldquo;{navSearchQuery}&rdquo;
                  </div>
                ) : (
                  searchResults.map((anime) => (
                    <Link
                      key={anime.id}
                      href={`/anime/${anime.slug}`}
                      onClick={() => {
                        setShowDropdown(false);
                        setNavSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/60 transition-colors group"
                    >
                      <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 bg-muted">
                        <Image
                          src={anime.coverImage}
                          alt={anime.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                          {anime.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0 font-normal"
                          >
                            {anime.type}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            Ep {anime.currentEpisode}
                          </span>
                          <div className="flex items-center gap-0.5 text-xs text-yellow-500 ml-auto">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-[11px] text-foreground">
                              {anime.rating?.toFixed(1) || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              {searchResults.length > 0 && (
                <div className="p-2 border-t border-border/40 bg-muted/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-primary justify-center h-8 font-medium"
                    onClick={handleSearchSubmit}
                  >
                    Lihat semua hasil untuk &ldquo;{navSearchQuery}&rdquo; →
                  </Button>
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* User Watch History & Bookmarks buttons */}
        <div className="hidden sm:flex items-center gap-1">
          <UserHistoryDialog />
          <UserBookmarkDialog />
        </div>

        {/* Theme toggle */}
        <ThemeToggle className="hidden sm:flex" />        {/* Auth / Admin */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/admin">
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            </Button>
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
        <div className="flex sm:hidden items-center gap-1">
          <ThemeToggle size="icon" />
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0"
              />
            }
          >
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-6 flex flex-col justify-between">
            <div>
              <SheetTitle className="p-0 pb-5 mb-5 border-b border-border/50">
                <Logo href="/" />
              </SheetTitle>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
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

                <Separator className="my-3" />

                <div className="flex flex-col gap-1">
                  <UserHistoryDialog>
                    <button className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 w-full text-left transition-colors">
                      <History className="w-5 h-5 text-primary" />
                      Riwayat Tonton
                    </button>
                  </UserHistoryDialog>
                  <UserBookmarkDialog>
                    <button className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 w-full text-left transition-colors">
                      <Bookmark className="w-5 h-5 text-primary" />
                      Favorit Saya
                    </button>
                  </UserBookmarkDialog>
                </div>
              </nav>
            </div>

            <div className="pt-4 border-t border-border/50 space-y-1">
              <ThemeToggle
                variant="ghost"
                showLabel
                className="w-full justify-start px-3.5 py-2.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl"
              />

              {user ? (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Admin Panel
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform active:scale-95"
                >
                  <User className="w-4 h-4" />
                  Login Admin
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>




      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-border/40 p-3 bg-background/95 backdrop-blur-xl">
          <form className="relative" onSubmit={handleSearchSubmit}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari anime..."
              className="pl-9 pr-8 bg-secondary/50"
              autoFocus
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
            />
            {searching ? (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
            ) : navSearchQuery ? (
              <button
                type="button"
                onClick={() => setNavSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </form>

          {/* Mobile search dropdown */}
          {showDropdown && navSearchQuery.trim() && searchResults.length > 0 && (
            <div className="mt-2 divide-y divide-border/40 rounded-lg border border-border/50 bg-card/90 overflow-hidden">
              {searchResults.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.slug}`}
                  onClick={() => {
                    setShowDropdown(false);
                    setNavSearchQuery("");
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-3 p-2.5 hover:bg-accent/60 transition-colors"
                >
                  <div className="relative w-9 h-12 rounded overflow-hidden shrink-0 bg-muted">
                    <Image
                      src={anime.coverImage}
                      alt={anime.title}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">
                      {anime.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                      <span>{anime.type}</span>
                      <span>•</span>
                      <span>Ep {anime.currentEpisode}</span>
                      <span>•</span>
                      <span className="text-yellow-500 font-medium">
                        ⭐ {anime.rating?.toFixed(1) || "-"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

