import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Image as ImageIcon, Loader2, RefreshCw, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/image-creator")({
  head: () => ({
    meta: [
      { title: "Image Creator | ContentFlow AI" },
      {
        name: "description",
        content:
          "Turn a simple idea into a detailed, optimised image-generation prompt with style, aspect ratio and mood controls.",
      },
      { property: "og:title", content: "Image Creator | ContentFlow AI" },
      {
        property: "og:description",
        content: "Engineer professional image-generation prompts for any AI image model.",
      },
    ],
  }),
  component: ImageCreatorPage,
});

const STYLES = [
  "Photorealistic",
  "Illustration",
  "Minimalist",
  "3D",
  "Cinematic",
  "Cartoon",
  "Professional",
  "Poster",
];
const RATIOS = ["Square", "Portrait", "Landscape"];
const MOODS = ["Energetic", "Professional", "Calm", "Dramatic", "Fun", "Inspirational"];

function ImageCreatorPage() {
  const run = useServerFn(runPrompt);
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [ratio, setRatio] = useState("Square");
  const [mood, setMood] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [usedPrompt, setUsedPrompt] = useState("");

  async function generate() {
    if (!description.trim()) {
      toast.error("Please describe the image you want.");
      return;
    }
    const prompt = `You are an expert AI image prompt engineer. Create a detailed image-generation prompt for "${description.trim()}". The desired style is ${style}, the mood is ${mood}, and the aspect ratio is ${ratio}. Include details about composition, lighting, subject, environment and visual style. Return only the final prompt as one rich paragraph.`;
    setLoading(true);
    try {
      const res = await run({ data: { prompt } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setResult(res.text);
      setUsedPrompt(prompt);
      toast.success("Optimised image prompt ready");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Image Creator"
      description="ContentFlow AI's connected model generates text, not images — so it engineers a production-ready prompt you can paste into any image model."
    >
      <div className="surface-card p-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Image description
            </Label>
            <Textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A student coding on a laptop in a sunlit co-working space"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { label: "Image style", value: style, set: setStyle, options: STYLES },
              { label: "Aspect ratio", value: ratio, set: setRatio, options: RATIOS },
              { label: "Mood", value: mood, set: setMood, options: MOODS },
            ].map((f) => (
              <div key={f.label} className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </Label>
                <Select value={f.value} onValueChange={f.set}>
                  <SelectTrigger aria-label={f.label}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <Button size="lg" disabled={loading} onClick={() => void generate()}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
            {loading ? "Generating…" : "Generate Image Prompt"}
          </Button>
        </div>
      </div>

      {result && (
        <section className="surface-card mt-6 p-6">
          <h2 className="text-lg font-bold">Optimised Image Prompt</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            No image was rendered here — this is a real AI-written prompt for an image model.
          </p>
          <div className="mt-4 whitespace-pre-wrap rounded-xl bg-ai-soft p-4 text-sm leading-relaxed">
            {result}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton value={result} label="Copy Prompt" />
            <Button size="sm" variant="outline" disabled={loading} onClick={() => void generate()}>
              <RefreshCw className="size-4" /> Regenerate Prompt
            </Button>
            <Button
              size="sm"
              onClick={() => {
                saveHistory({
                  kind: "image",
                  type: `Image Prompt · ${style}`,
                  content: result,
                  prompt: usedPrompt,
                });
                toast.success("Saved to History");
              }}
            >
              <Save className="size-4" /> Save
            </Button>
          </div>
        </section>
      )}
    </AppShell>
  );
}
