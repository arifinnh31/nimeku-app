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
import { Badge } from "@/components/ui/badge";
import { Bookmark, Star, Trash2, X } from "lucide-react";
import {
  getBookmarks,
  removeBookmark,
  clearBookmarks,
  STORAGE_EVENT,
  BookmarkItem,
} from "@/lib/storage";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

interface UserBookmarkDialogProps {
  children?: React.ReactNode;
}

export function UserBookmarkDialog({ children }: UserBookmarkDialogProps) {
  const [open, setOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const loadBookmarks = () => {
    setBookmarks(getBookmarks());
  };

  useEffect(() => {
    loadBookmarks();
    const handleUpdate = () => loadBookmarks();
    window.addEventListener(STORAGE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleClear = () => {
    clearBookmarks();
    toast.success("Daftar anime favorit berhasil dibersihkan.");
    setConfirmClearOpen(false);
  };

  const handleRemoveItem = (slug: string, title: string) => {
    removeBookmark(slug);
    toast.success(`"${title}" dihapus dari favorit.`);
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
                title="Anime Favorit"
              >
                <Bookmark className="w-5 h-5" />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>
            )
          }
        />
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-border/50 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Bookmark className="w-4 h-4 text-primary" />
              Favorit Saya ({bookmarks.length})
            </DialogTitle>
            {bookmarks.length > 0 && (
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
            {bookmarks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground space-y-2">
                <Bookmark className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-sm font-medium">Belum ada anime favorit</p>
                <p className="text-xs text-muted-foreground">
                  Klik tombol bookmark pada anime yang Anda sukai untuk menyimpannya di sini.
                </p>
              </div>
            ) : (
              bookmarks.map((item) => (
                <div
                  key={item.animeSlug}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border/50 bg-card/60 hover:bg-accent/40 transition-colors group"
                >
                  <Link
                    href={`/anime/${item.animeSlug}`}
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
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {item.animeTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] py-0">
                          {item.type}
                        </Badge>
                        <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span>{item.rating?.toFixed(1) || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => handleRemoveItem(item.animeSlug, item.animeTitle)}
                    title="Hapus dari favorit"
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
        title="Bersihkan Favorit"
        description="Apakah Anda yakin ingin menghapus semua daftar anime favorit di perangkat ini?"
        confirmText="Bersihkan Semua"
        variant="destructive"
        onConfirm={handleClear}
      />
    </>
  );
}

