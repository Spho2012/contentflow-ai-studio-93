import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Repeat2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runPrompt } from "@/lib/ai.functions";
import { saveHistory } from "@/lib/history";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/repurpose")({
  head: () => ({
    meta: [
      { title: "Repurpose Content | ContentFlow AI" },
      {
        name: "description",
        content:
          "Paste one piece of content and instantly adapt it into TikTok scripts, captions, posts, emails and summaries.",
      },
      { property: "og:title", content: "Repurpose Content | ContentFlow AI" },
      {
        property: "og:description",
        content: "One idea → multiple pieces of content, adapted per platform by AI.",
      },
    ],
  }),
  component: RepurposePage,
});

const FORMATS = [
  "TikTok Script",
  "Instagram Caption",
  "Facebook Post",
  "LinkedIn Post",
  "WhatsApp Message",
  "Email",
  "Blog Summary",
  "Short Video Script",
];

type Output = { format: string; content: string; prompt: string };

function RepurposePage() {
  const run = useServerFn(runPrompt);
  const [source, setSource] = useState("");
  const [selected, setSelected] = useState<string[]>(["Instagram Caption", "LinkedIn Post"]);
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs] = useState<Output[]>([]);

  function toggle(format: string) {
    setSelected((s) => (s.includes(format) ? s.filter((f) => f !== format) : [...s, format]));
  }

  async function repurpose() {
    if (source.trim().length < 20) {
      toast.error("Paste at least a short paragraph of content to repurpose.");
      return;
    }
    if (selected.length === 0) {
      toast.error("Select at least one output format.");
      return;
    }
    setLoading(true);
    setOutputs([]);
    try {
      const results: Output[] = [];
      for (const format of selected) {
        const prompt = `You are an expert content repurposing specialist. Transform the following content into a ${format}. Preserve the key message while adapting the language, structure and tone for the platform's audience. Make the result engaging and platform appropriate. Return only the final content.\n\nCONTENT:\n${source.trim()}`;
        const res = await run({ data: { prompt } });
        if (!res.ok) {
          toast.error(`${format}: ${res.error}`);
          continue;
        }
        results.push({ format, content: res.text, prompt });
        setOutputs([...results]);
      }
      if (results.length) toast.success(`Created ${results.length} new pieces of content`);
    } catch {
      toast.error("Something went wrong while repurposing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Repurpose Content"
      description="One idea → multiple pieces of content, adapted for every platform."
    >
      <div className="surface-card p-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Original content
            </Label>
            <Textarea
              rows={8}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Paste a blog post, announcement, script or caption here…"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Output formats
            </Label>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={selected.includes(f)}
                  onClick={() => toggle(f)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    selected.includes(f)
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" disabled={loading} onClick={() => void repurpose()}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Repeat2 className="size-4" />}
            {loading ? "Repurposing…" : "Repurpose Content"}
          </Button>
        </div>
      </div>

      {outputs.length === 0 && !loading && (
        <p className="mt-6 text-sm text-muted-foreground">
          Your repurposed formats will appear here, each in its own card.
        </p>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {outputs.map((o) => (
          <article key={o.format} className="surface-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold">{o.format}</h2>
              <span className="rounded-full bg-highlight-soft px-3 py-1 text-xs font-semibold text-highlight">
                Repurposed
              </span>
            </div>
            <div className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-secondary/60 p-4 text-sm leading-relaxed">
              {o.content}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton value={o.content} />
              <Button
                size="sm"
                onClick={() => {
                  saveHistory({
                    kind: "repurpose",
                    type: o.format,
                    content: o.content,
                    prompt: o.prompt,
                  });
                  toast.success("Saved to History");
                }}
              >
                <Save className="size-4" /> Save
              </Button>
            </div>
          </article>
        ))}
        {loading && (
          <div className="surface-card space-y-3 p-5">
            <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-full animate-pulse rounded bg-secondary" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-secondary" />
          </div>
        )}
      </div>
    </AppShell>
  );
}
