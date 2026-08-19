import { useCallback, useEffect, useState } from "react";

export type HistoryItem = {
  id: string;
  type: string;
  createdAt: string;
  content: string;
  prompt: string;
  kind: "generate" | "image" | "repurpose";
  imageUrl?: string;
  imageType?: string;
};

const KEY = "contentflow-history";

function read(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: HistoryItem[]) {
  let list = items;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("contentflow-history-change"));
      return;
    } catch {
      // Storage is full — drop the oldest image-heavy entries and retry.
      const lastImage = [...list].reverse().find((i) => i.imageUrl);
      list = lastImage
        ? list.map((i) => {
            if (i.id !== lastImage.id) return i;
            const { imageUrl: _drop, ...rest } = i;
            return rest;
          })
        : list.slice(0, Math.max(1, list.length - 10));
    }
  }
  throw new Error("Not enough browser storage to save this item");
}

export function saveHistory(item: Omit<HistoryItem, "id" | "createdAt">) {
  const next: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  write([next, ...read()].slice(0, 200));
  return next;
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener("contentflow-history-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("contentflow-history-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { items, remove, clear };
}
