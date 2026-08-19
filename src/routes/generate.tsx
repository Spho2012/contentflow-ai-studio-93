import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RefreshCw, Save, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { runPrompt } from "@/lib/ai.functions";
import { saveHistory } from "@/lib/history";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate Content | ContentFlow AI" },
      {
        name: "description",
        content:
          "Generate captions, blog posts, emails, ads, scripts and product descriptions with tone, audience and platform control.",
      },
      { property: "og:title", content: "Generate Content | ContentFlow AI" },
      {
        property: "og:description",
        content: "AI content generation with full control over type, platform, audience, tone and length.",
      },
    ],
  }),
  component: GeneratePage,
});

const CONTENT_TYPES = [
  "Social Media Caption",
  "Blog Post",
  "Email",
  "Advertisement",
  "WhatsApp Message",
  "Video Script",
  "Product Description",
  "General Text",
];
const PLATFORMS = [
  "TikTok",
  "Instagram",
  "Facebook",
  "LinkedIn",
  "WhatsApp",
  "Email",
  "Website",
  "General",
];
const AUDIENCES = [
  "Students",
  "Young Adults",
  "Professionals",
  "Customers",
  "Parents",
  "General Audience",
  "Custom",
];
const TONES = [
  "Professional",
  "Friendly",
  "Exciting",
  "Funny",
  "Educational",
  "Emotional",
  "Persuasive",
  "Inspirational",
];
const LENGTHS = ["Short", "Medium", "Long"];
const LANGUAGES = [
  "English",
  "isiXhosa",
  "isiZulu",
  "Afrikaans",
  "Sesotho",
  "French",
  "Spanish",
  "Portuguese",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Dropdown({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function GeneratePage() {
  const run = useServerFn(runPrompt);

  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("Social Media Caption");
  const [platform, setPlatform] = useState("Instagram");
  const [audience, setAudience] = useState("Young Adults");
  const [customAudience, setCustomAudience] = useState("");
  const [tone, setTone] = useState("Exciting");
  const [length, setLength] = useState("Short");
  const [language, setLanguage] = useState("English");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [usedPrompt, setUsedPrompt] = useState("");

  const resolvedAudience = audience === "Custom" ? customAudience.trim() : audience;

  function buildPrompt() {
    return [
      `You are a professional ${contentType.toLowerCase()} content creator.`,
      `Create a ${contentType} about "${topic.trim()}" for ${platform}.`,
      `Target audience: ${resolvedAudience || "General Audience"}.`,
      `Use a ${tone} tone. Length: ${length}. Write in ${language}.`,
      `Include a strong call-to-action, and where the platform expects it, relevant hashtags.`,
      `Return only the finished content, ready to publish.`,
    ].join(" ");
  }

  async function generate(prompt?: string, note?: string) {
    if (!topic.trim()) {
      toast.error("Please enter a content topic or idea first.");
      return;
    }
    if (audience === "Custom" && !customAudience.trim()) {
      toast.error("Please describe your custom audience.");
      return;
    }
    const finalPrompt = prompt ?? buildPrompt();
    setLoading(true);
    try {
      const res = await run({ data: { prompt: finalPrompt } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setResult(res.text);
      setUsedPrompt(finalPrompt);
      toast.success(note ?? "Content generated");
    } catch {
      toast.error("Something went wrong while generating. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function refine(instruction: string, label: string) {
    if (!result) return;
    void generate(
      `You are an expert content editor. ${instruction} Keep the original meaning and the ${language} language. Return only the improved version.\n\nCONTENT:\n${result}`,
      label,
    );
  }

  return (
    <AppShell
      title="Generate Content"
      description="Describe your idea and let ContentFlow AI write it for the right platform, audience and tone."
    >
      <div className="surface-card p-6">
        <div className="space-y-5">
          <Field label="Content topic / idea">
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={5}
              placeholder="e.g. Launching a free weekend coding bootcamp for students in Cape Town"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Content type">
              <Dropdown value={contentType} onChange={setContentType} options={CONTENT_TYPES} label="Content type" />
            </Field>
            <Field label="Platform">
              <Dropdown value={platform} onChange={setPlatform} options={PLATFORMS} label="Platform" />
            </Field>
            <Field label="Target audience">
              <Dropdown value={audience} onChange={setAudience} options={AUDIENCES} label="Target audience" />
            </Field>
            {audience === "Custom" ? (
              <Field label="Custom audience">
                <Input
                  value={customAudience}
                  onChange={(e) => setCustomAudience(e.target.value)}
                  placeholder="e.g. First-year design students"
                />
              </Field>
            ) : (
              <Field label="Tone">
                <Dropdown value={tone} onChange={setTone} options={TONES} label="Tone" />
              </Field>
            )}
            {audience === "Custom" && (
              <Field label="Tone">
                <Dropdown value={tone} onChange={setTone} options={TONES} label="Tone" />
              </Field>
            )}
            <Field label="Length">
              <Dropdown value={length} onChange={setLength} options={LENGTHS} label="Length" />
            </Field>
            <Field label="Language">
              <Dropdown value={language} onChange={setLanguage} options={LANGUAGES} label="Language" />
            </Field>
          </div>

          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
            disabled={loading}
            onClick={() => void generate()}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Generating…" : "Generate Content"}
          </Button>
        </div>
      </div>

      {loading && !result && (
        <div className="surface-card mt-6 space-y-3 p-6">
          <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-full animate-pulse rounded bg-secondary" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-secondary" />
        </div>
      )}

      {result && (
        <section className="surface-card mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Generated content</h2>
            <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
              {contentType} · {platform}
            </span>
          </div>

          <div className="mt-4 whitespace-pre-wrap rounded-xl bg-secondary/60 p-4 text-sm leading-relaxed">
            {result}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton value={result} />
            <Button size="sm" variant="outline" disabled={loading} onClick={() => void generate()}>
              <RefreshCw className="size-4" /> Regenerate
            </Button>
            <Button
              size="sm"
              variant="soft"
              disabled={loading}
              onClick={() => refine("Improve this content so it is clearer and stronger.", "Content improved")}
            >
              Improve
            </Button>
            <Button
              size="sm"
              variant="soft"
              disabled={loading}
              onClick={() => refine("Shorten this content significantly while keeping the key message.", "Content shortened")}
            >
              Shorten
            </Button>
            <Button
              size="sm"
              variant="soft"
              disabled={loading}
              onClick={() => refine("Rewrite this content in a polished, professional business tone.", "Made professional")}
            >
              Make Professional
            </Button>
            <Button
              size="sm"
              variant="ai"
              disabled={loading}
              onClick={() => refine("Rewrite this content so it is far more engaging and scroll-stopping.", "Made more engaging")}
            >
              Make More Engaging
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                saveHistory({
                  kind: "generate",
                  type: `${contentType} · ${platform}`,
                  content: result,
                  prompt: usedPrompt,
                });
                toast.success("Saved to History");
              }}
            >
              <Save className="size-4" /> Save
            </Button>
          </div>

          <details className="mt-5 rounded-xl border border-border p-4">
            <summary className="cursor-pointer text-sm font-semibold">Prompt used</summary>
            <p className="mt-3 whitespace-pre-wrap text-xs text-muted-foreground">{usedPrompt}</p>
            <div className="mt-3">
              <CopyButton value={usedPrompt} label="Copy prompt" variant="ghost" />
            </div>
          </details>
        </section>
      )}
    </AppShell>
  );
}
