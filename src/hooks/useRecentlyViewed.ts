import { useState, useCallback } from 'react';

const STORAGE_KEY = 'snusfriend_recently_viewed';
const MAX_ITEMS = 12;

function loadFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Corrupted data — start fresh
  }
  return [];
}

function saveToStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // QuotaExceededError — silently ignore
  }
}

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(() => loadFromStorage());

  const add = useCallback((productId: string) => {
    setIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const next = [productId, ...filtered].slice(0, MAX_ITEMS);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    saveToStorage([]);
  }, []);

  return { ids, add, clear };
}
