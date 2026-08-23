import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Play } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto">
          <Play className="w-8 h-8 fill-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="font-[var(--font-heading)] text-6xl font-extrabold text-primary">
            404
          </h1>
          <h2 className="text-2xl font-bold">Halaman Tidak Ditemukan</h2>
          <p className="text-sm text-muted-foreground">
            Maaf, anime atau halaman yang Anda cari mungkin telah dipindahkan,
            dihapus, atau URL yang Anda masukkan salah.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild size="lg" className="w-full sm:w-auto gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2"
          >
            <Link href="/catalog">
              <Search className="w-4 h-4" />
              Jelajahi Katalog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
