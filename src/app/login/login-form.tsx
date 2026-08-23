"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(initialMessage || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    const toastId = toast.loading("Memverifikasi kredensial admin...");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });


      if (error) {
        toast.error("Gagal login: " + error.message, { id: toastId });
        setErrorMsg("Kredensial tidak valid. Pastikan email & password benar.");
        setLoading(false);
        return;
      }

      toast.success("Login berhasil! Mengalihkan ke Dashboard...", { id: toastId });
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + (err?.message || "Gagal masuk"), { id: toastId });
      setErrorMsg("Terjadi kendala saat login. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 overflow-hidden bg-background">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      {/* Center Box */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto my-auto py-4">
        <Card className="bg-card/80 backdrop-blur-xl border-border/60 shadow-xl shadow-primary/5 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-2 text-center px-6 pt-6 pb-2">
            <div className="flex justify-center mb-1">
              <Logo size="default" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">
                Masuk ke Panel Admin
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                Masukkan email dan kata sandi admin untuk mengelola katalog NimeKu
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2 space-y-3.5">
            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Email Administrator
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@nimeku.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 bg-secondary/30 border-border/60 focus:bg-background transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 pr-10 bg-secondary/30 border-border/60 focus:bg-background transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message if any */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full gap-2 shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/25 h-10 mt-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Panel Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-1 text-center">
              <Button variant="ghost" size="sm" asChild className="h-8 text-xs text-muted-foreground hover:text-foreground">
                <Link href="/">
                  Batal & Kembali ke Website
                </Link>
              </Button>
            </div>
          </CardContent>

        </Card>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-2 text-xs text-muted-foreground">
        <p>© 2026 NimeKu • Khusus Pengelolaan Administrator</p>
      </div>
    </div>
  );
}
