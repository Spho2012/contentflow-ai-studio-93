import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project | ContentFlow AI" },
      {
        name: "description",
        content:
          "ContentFlow AI is an AI bootcamp project demonstrating prompt engineering, prompt optimisation and content repurposing.",
      },
      { property: "og:title", content: "About ContentFlow AI" },
      {
        property: "og:description",
        content: "Purpose, features and AI skills demonstrated by the ContentFlow AI studio project.",
      },
    ],
  }),
  component: AboutPage,
});

const FEATURES = [
  "AI content generation",
  "Real AI image generation (not prompt-only)",
  "Flexible image generation covering events, artists, careers, products and general concepts, with downloadable output",
  "Content repurposing",
  "Prompt library",
  "Prompt optimisation",
  "Multiple tones",
  "Multiple audiences",
  "Content history",
];

const SKILLS = [
  "Prompt engineering",
  "Prompt refinement",
  "Generative AI",
  "Multi-modal AI integration (text + image)",
  "Structured, template-driven prompt-to-image generation across multiple use cases",
  "Content structuring",
  "AI productivity workflows",
];

function AboutPage() {
  return (
    <AppShell
      title="About Project"
      description="An individual AI Content Generator project built for an AI bootcamp."
    >
      <section className="surface-card p-6">
        <h2 className="text-lg font-bold">Project name</h2>
        <p className="mt-2 text-gradient-ai text-2xl font-extrabold">ContentFlow AI</p>
        <p className="mt-1 text-sm text-muted-foreground">Create once. Generate everywhere.</p>
      </section>

      <section className="surface-card mt-4 p-6">
        <h2 className="text-lg font-bold">Purpose</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          An AI-powered content generation and repurposing tool designed to help users create multiple
          types of content from a single idea.
        </p>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-6">
          <h2 className="text-lg font-bold">Features</h2>
          <ul className="mt-3 space-y-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-success" /> {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card p-6">
          <h2 className="text-lg font-bold">AI skills demonstrated</h2>
          <ul className="mt-3 space-y-2">
            {SKILLS.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-ai" /> {s}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="surface-card mt-4 p-6">
        <h2 className="text-lg font-bold">How the AI works here</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Text generation, refinement and repurposing run through a secure server-side call to a real
          AI model — the API key never reaches the browser. The Image Generator builds an optimised
          prompt from your description and settings, then sends it to a real text-to-image model and
          streams the actual image back for download. Saved content and images are stored in your
          browser so the prototype stays fully functional without an account.
        </p>
      </section>
    </AppShell>
  );
}
