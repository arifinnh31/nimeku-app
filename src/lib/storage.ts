"use client";

export interface WatchHistoryItem {
  animeSlug: string;
  animeTitle: string;
  coverImage: string;
  episodeNumber: number;
  episodeTitle?: string;
  timestamp: number;
}

export interface BookmarkItem {
  animeSlug: string;
  animeTitle: string;
  coverImage: string;
  rating: number;
  type: string;
  status: string;
  totalEpisodes?: number | null;
  currentEpisode: number;
  addedAt: number;
}

const HISTORY_KEY = "nimeku_watch_history";
const BOOKMARKS_KEY = "nimeku_bookmarks";
const STORAGE_EVENT = "nimeku-storage-update";

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  }
}

export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWatchHistory(item: Omit<WatchHistoryItem, "timestamp">) {
  if (typeof window === "undefined") return;
  try {
    const list = getWatchHistory().filter((i) => i.animeSlug !== item.animeSlug);
    const updated: WatchHistoryItem[] = [
      { ...item, timestamp: Date.now() },
      ...list,
    ].slice(0, 30); // keep max 30 items
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    notifyChange();
  } catch (e) {
    console.error("Failed to save watch history", e);
  }
}

export function removeWatchHistory(animeSlug: string) {
  if (typeof window === "undefined") return;
  try {
    const updated = getWatchHistory().filter((i) => i.animeSlug !== animeSlug);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    notifyChange();
  } catch (e) {
    console.error("Failed to remove watch history", e);
  }
}

export function clearWatchHistory() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    notifyChange();
  } catch (e) {
    console.error("Failed to clear watch history", e);
  }
}

export function getBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(animeSlug: string): boolean {
  if (typeof window === "undefined") return false;
  return getBookmarks().some((b) => b.animeSlug === animeSlug);
}

export function toggleBookmark(item: Omit<BookmarkItem, "addedAt">): boolean {
  if (typeof window === "undefined") return false;
  try {
    const list = getBookmarks();
    const exists = list.some((b) => b.animeSlug === item.animeSlug);
    let updated: BookmarkItem[];

    if (exists) {
      updated = list.filter((b) => b.animeSlug !== item.animeSlug);
    } else {
      updated = [{ ...item, addedAt: Date.now() }, ...list];
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    notifyChange();
    return !exists;
  } catch (e) {
    console.error("Failed to toggle bookmark", e);
    return false;
  }
}

export function removeBookmark(animeSlug: string) {
  if (typeof window === "undefined") return;
  try {
    const updated = getBookmarks().filter((b) => b.animeSlug !== animeSlug);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    notifyChange();
  } catch (e) {
    console.error("Failed to remove bookmark", e);
  }
}

export function clearBookmarks() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(BOOKMARKS_KEY);
    notifyChange();
  } catch (e) {
    console.error("Failed to clear bookmarks", e);
  }
}

export { STORAGE_EVENT };
