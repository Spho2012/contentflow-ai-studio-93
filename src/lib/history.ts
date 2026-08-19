import { useCallback, useEffect, useState } from "react";

export type HistoryItem = {
  id: string;
  type: string;
  createdAt: string;
  content: string;
  prompt: string;
  kind: "generate" | "image" | "repurpose";
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
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("contentflow-history-change"));
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
