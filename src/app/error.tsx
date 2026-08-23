"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 text-destructive mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-[var(--font-heading)] text-3xl font-bold">
            Terjadi Kesalahan
          </h1>
          <p className="text-sm text-muted-foreground">
            Terjadi kendala saat memuat halaman ini. Silakan coba muat ulang atau
            kembali ke halaman utama.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            size="lg"
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
