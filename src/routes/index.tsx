import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Image as ImageIcon,
  Library,
  Repeat2,
  Sparkles,
  FileText,
  Repeat,
  Wand2,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/lib/history";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | ContentFlow AI" },
      {
        name: "description",
        content:
          "Your AI content studio dashboard: generate text, craft image prompts, repurpose content and reuse tested prompts.",
      },
      { property: "og:title", content: "ContentFlow AI Dashboard" },
      {
        property: "og:description",
        content: "Create once. Generate everywhere — an AI content generation and repurposing studio.",
      },
    ],
  }),
  component: Dashboard,
});

const QUICK_ACTIONS = [
  {
    to: "/generate",
    title: "Generate Text",
    description: "Captions, blogs, emails, scripts and more.",
    icon: Sparkles,
  },
  {
    to: "/image-generator",
    title: "Create Image",
    description: "Generate a real, downloadable AI image.",
    icon: ImageIcon,
  },
  {
    to: "/repurpose",
    title: "Repurpose Content",
    description: "One idea turned into many formats.",
    icon: Repeat2,
  },
  {
    to: "/prompt-library",
    title: "Browse Prompts",
    description: "Reusable, tested prompt templates.",
    icon: Library,
  },
] as const;

function Dashboard() {
  const { items } = useHistory();

  const generated = items.filter((i) => i.kind === "generate").length;
  const repurposed = items.filter((i) => i.kind === "repurpose").length;
  const images = items.filter((i) => i.kind === "image").length;

  const stats = [
    { label: "Content Generated", value: generated, icon: FileText },
    { label: "Prompts Used", value: items.length, icon: Wand2 },
    { label: "Content Repurposed", value: repurposed, icon: Repeat },
    { label: "Images Created", value: images, icon: ImageIcon },
  ];

  return (
    <AppShell
      title="Welcome to ContentFlow AI"
      description="Create once. Generate everywhere."
    >
      <section className="gradient-ai rounded-3xl p-8 text-primary-foreground shadow-[var(--shadow-lift)]">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
          AI Content Creation Studio
        </p>
        <h2 className="mt-3 max-w-2xl text-2xl font-extrabold sm:text-3xl">
          Turn a single idea into captions, blogs, emails, scripts and image prompts.
        </h2>
        <p className="mt-3 max-w-2xl text-sm opacity-90">
          ContentFlow AI combines prompt engineering, prompt optimisation and content repurposing so
          you can produce professional content for every platform in minutes.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-6">
          <Link to="/generate">
            Start Creating <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {QUICK_ACTIONS.map(({ to, title, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="surface-card group flex items-start gap-4 p-5 transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-ai-soft text-ai">
              <Icon className="size-5" />
            </span>
            <span>
              <span className="block font-semibold">{title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
            </span>
            <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <h3 className="mb-4 text-lg font-bold">Your activity</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="surface-card p-5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-highlight-soft text-highlight">
                <Icon className="size-4" />
              </span>
              <p className="mt-3 text-2xl font-extrabold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            No activity yet — everything you generate and save appears here and in History.
          </p>
        )}
      </section>
    </AppShell>
  );
}
