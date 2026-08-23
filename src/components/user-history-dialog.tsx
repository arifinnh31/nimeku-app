"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History, Play, Trash2, X } from "lucide-react";
import {
  getWatchHistory,
  removeWatchHistory,
  clearWatchHistory,
  STORAGE_EVENT,
  WatchHistoryItem,
} from "@/lib/storage";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

interface UserHistoryDialogProps {
  children?: React.ReactNode;
}

export function UserHistoryDialog({ children }: UserHistoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const loadHistory = () => {
    setHistory(getWatchHistory());
  };

  useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener(STORAGE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleClear = () => {
    clearWatchHistory();
    toast.success("Riwayat tonton berhasil dibersihkan.");
    setConfirmClearOpen(false);
  };

  const handleRemoveItem = (slug: string, title: string) => {
    removeWatchHistory(slug);
    toast.success(`"${title}" dihapus dari riwayat.`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            children ? (
              (children as React.ReactElement)
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                title="Riwayat Tonton"
              >
                <History className="w-5 h-5" />
                {history.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>
            )
          }
        />
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-border/50 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base">
              <History className="w-4 h-4 text-primary" />
              Riwayat Tonton ({history.length})
            </DialogTitle>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmClearOpen(true)}
                className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-7"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Bersihkan
              </Button>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground space-y-2">
                <History className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-sm font-medium">Belum ada riwayat tonton</p>
                <p className="text-xs text-muted-foreground">
                  Anime yang Anda tonton akan otomatis tercatat di sini.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.animeSlug}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border/50 bg-card/60 hover:bg-accent/40 transition-colors group"
                >
                  <Link
                    href={`/anime/${item.animeSlug}/watch/${item.episodeNumber}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="relative w-12 h-16 rounded-md overflow-hidden shrink-0 bg-muted">
                      <Image
                        src={item.coverImage}
                        alt={item.animeTitle}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {item.animeTitle}
                      </p>
                      <p className="text-xs font-medium text-primary mt-0.5">
                        Episode {item.episodeNumber}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(item.timestamp).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => handleRemoveItem(item.animeSlug, item.animeTitle)}
                    title="Hapus dari riwayat"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        title="Bersihkan Riwayat Tonton"
        description="Apakah Anda yakin ingin menghapus seluruh catatan riwayat tontonan di perangkat ini?"
        confirmText="Bersihkan Semua"
        variant="destructive"
        onConfirm={handleClear}
      />
    </>
  );
}

