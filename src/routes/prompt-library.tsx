import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, FlaskConical, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  BASIC_PROMPT,
  OPTIMISATION_REASONS,
  OPTIMISED_PROMPT,
  PROMPT_CATEGORIES,
  PROMPT_LIBRARY,
} from "@/lib/prompts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prompt-library")({
  head: () => ({
    meta: [
      { title: "Prompt Library & Prompt Lab | ContentFlow AI" },
      {
        name: "description",
        content:
          "A reusable library of tested prompts plus a Prompt Lab case study showing how prompt optimisation improves AI output.",
      },
      { property: "og:title", content: "Prompt Library & Prompt Lab | ContentFlow AI" },
      {
        property: "og:description",
        content: "Reusable prompt templates with variables, plus a basic vs optimised prompt case study.",
      },
    ],
  }),
  component: PromptLibraryPage,
});

function PromptLibraryPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("All");

  const prompts =
    category === "All" ? PROMPT_LIBRARY : PROMPT_LIBRARY.filter((p) => p.category === category);

  return (
    <AppShell
      title="Prompt Library"
      description="Reusable, tested prompts with clear variables — the building blocks behind every ContentFlow AI generation."
    >
      <div className="flex flex-wrap gap-2">
        {["All", ...PROMPT_CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              category === c
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-secondary",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {prompts.map((p) => (
          <article key={p.id} className="surface-card flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-bold">{p.name}</h2>
              <span className="rounded-full bg-ai-soft px-3 py-1 text-xs font-semibold text-ai">
                {p.category}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.purpose}</p>
            <p className="mt-3 rounded-xl bg-secondary/60 p-4 text-sm leading-relaxed">{p.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.variables.map((v) => (
                <code
                  key={v}
                  className="rounded-md bg-highlight-soft px-2 py-1 text-xs font-semibold text-highlight"
                >
                  {`{${v}}`}
                </code>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton value={p.text} label="Copy Prompt" />
              <Button
                size="sm"
                onClick={() => {
                  const target =
                    p.category === "Image Generation"
                      ? "/image-creator"
                      : p.category === "Repurposing"
                        ? "/repurpose"
                        : "/generate";
                  toast.success(`Using "${p.name}"`);
                  void navigate({ to: target });
                }}
              >
                Use Prompt <ArrowRight className="size-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-ai-soft text-ai">
            <FlaskConical className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold">Prompt Lab</h2>
            <p className="text-sm text-muted-foreground">
              A prompt optimisation case study: same goal, very different results.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <X className="size-4" /> Basic Prompt
            </div>
            <p className="mt-3 rounded-xl bg-secondary/60 p-4 text-sm">{BASIC_PROMPT}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Vague, no role, no audience, no tone and no constraints — the AI has to guess everything.
            </p>
          </div>
          <div className="surface-card border-primary/30 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-success">
              <Check className="size-4" /> Optimised Prompt
            </div>
            <p className="mt-3 rounded-xl bg-accent p-4 text-sm">{OPTIMISED_PROMPT}</p>
            <div className="mt-3">
              <CopyButton value={OPTIMISED_PROMPT} label="Copy optimised prompt" />
            </div>
          </div>
        </div>

        <div className="surface-card mt-4 p-5">
          <h3 className="font-bold">Why the second prompt is better</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {OPTIMISATION_REASONS.map((r) => (
              <li key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-success" /> {r}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
