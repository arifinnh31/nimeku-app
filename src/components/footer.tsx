import Link from "next/link";
import { Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
                <Play className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-bold text-lg">
                Nime<span className="text-primary">Ku</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Platform streaming anime subtitle Indonesia terlengkap. Nonton
              anime favoritmu dengan kualitas terbaik.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
              Menu
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/catalog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Katalog Anime
              </Link>
              <Link
                href="/schedule"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Jadwal Rilis
              </Link>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
              Informasi
            </h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                Kontak: arifinnh311@gmail.com
              </span>
              <span className="text-sm text-muted-foreground">
                DMCA / Takedown Request
              </span>
            </nav>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © 2026 NimeKu. Semua konten anime adalah hak cipta pemiliknya
            masing-masing.
          </p>
          <p className="text-xs text-muted-foreground">
            Dibuat dengan ❤️ untuk pecinta anime Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
