import { createFileRoute } from "@tanstack/react-router";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHistory, type HistoryItem } from "@/lib/history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History | ContentFlow AI" },
      {
        name: "description",
        content: "Review, copy and manage every piece of content you have generated and saved.",
      },
      { property: "og:title", content: "History | ContentFlow AI" },
      {
        property: "og:description",
        content: "Your saved AI generations, with the exact prompt used for each one.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { items, remove, clear } = useHistory();
  const [active, setActive] = useState<HistoryItem | null>(null);

  return (
    <AppShell
      title="History"
      description="Everything you save is stored locally in your browser, together with the prompt that produced it."
    >
      {items.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="font-semibold">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate content and press Save — it will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => { clear(); toast.success("History cleared"); }}>
              Clear all
            </Button>
          </div>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="surface-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {item.type}
                  </span>
                  <time className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </time>
                </div>
                <div className="mt-3 flex gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.content || "Saved AI image"}
                      className="size-20 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.content}</p>
                    <p className="mt-2 line-clamp-1 text-xs text-muted-foreground/80">
                      Prompt: {item.prompt}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setActive(item)}>
                    <Eye className="size-4" /> View
                  </Button>
                  {item.imageUrl ? (
                    <Button size="sm" variant="outline" onClick={() => downloadImage(item)}>
                      <Download className="size-4" /> Download
                    </Button>
                  ) : (
                    <CopyButton value={item.content} />
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      remove(item.id);
                      toast.success("Deleted");
                    }}
                  >
                    <Trash2 className="size-4" /> Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{active?.type}</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap rounded-xl bg-secondary/60 p-4 text-sm leading-relaxed">
            {active?.content}
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Prompt used
            </p>
            <p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{active?.prompt}</p>
          </div>
          <div className="flex gap-2">
            <CopyButton value={active?.content ?? ""} label="Copy content" />
            <CopyButton value={active?.prompt ?? ""} label="Copy prompt" variant="ghost" />
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
