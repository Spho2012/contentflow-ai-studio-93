import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronDown,
  Download,
  Image as ImageIcon,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
} from "lucide-react";
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
import { saveHistory } from "@/lib/history";
import { streamImage } from "@/lib/streamImage";

export const Route = createFileRoute("/image-generator")({
  head: () => ({
    meta: [
      { title: "Image Generator | ContentFlow AI" },
      {
        name: "description",
        content:
          "Generate real, downloadable AI images for events, artists, careers, products and social graphics from a single description.",
      },
      { property: "og:title", content: "AI Image Generator | ContentFlow AI" },
      {
        property: "og:description",
        content: "Describe any idea and get a real, downloadable AI-generated image in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImageGeneratorPage,
});

type FieldKey =
  | "eventName"
  | "eventDate"
  | "venue"
  | "lineup"
  | "theme"
  | "tagline"
  | "artistName"
  | "genre"
  | "setting"
  | "career"
  | "careerSetting"
  | "productName"
  | "productSetting"
  | "brandMood"
  | "platform"
  | "headline";

const IMAGE_TYPES = [
  "General / Custom",
  "Event / Poster",
  "Artist / Performer",
  "Career / Profession",
  "Product",
  "Social Media Graphic",
] as const;

type ImageType = (typeof IMAGE_TYPES)[number];

const SUB_FIELDS: Record<ImageType, { key: FieldKey; label: string; placeholder: string }[]> = {
  "General / Custom": [],
  "Event / Poster": [
    { key: "eventName", label: "Event name", placeholder: "Maskandi Festival 2026" },
    { key: "eventDate", label: "Date", placeholder: "12 September 2026" },
    { key: "venue", label: "Venue / location", placeholder: "Cape Town Stadium" },
    { key: "lineup", label: "Artists / lineup", placeholder: "Mzukulu, Skweletu" },
    { key: "theme", label: "Theme / genre", placeholder: "Maskandi, traditional" },
    { key: "tagline", label: "Tagline text", placeholder: "One night. One rhythm." },
  ],
  "Artist / Performer": [
    { key: "artistName", label: "Artist / stage name", placeholder: "DJ Nomvula" },
    { key: "genre", label: "Genre", placeholder: "Amapiano" },
    { key: "setting", label: "Setting / scene", placeholder: "Live on a packed festival stage" },
  ],
  "Career / Profession": [
    { key: "career", label: "Career / role", placeholder: "Marine biologist" },
    { key: "careerSetting", label: "Setting", placeholder: "Research lab by the coast" },
  ],
  Product: [
    { key: "productName", label: "Product name", placeholder: "Aurora headphones" },
    { key: "productSetting", label: "Setting / background", placeholder: "Studio desk, soft light" },
    { key: "brandMood", label: "Brand mood", placeholder: "Premium and minimal" },
  ],
  "Social Media Graphic": [
    { key: "platform", label: "Platform", placeholder: "Instagram" },
    { key: "headline", label: "Message / headline text", placeholder: "Applications open now" },
  ],
};

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
const RATIOS = ["Square (1:1)", "Portrait (4:5)", "Landscape (16:9)"];
const MOODS = ["Energetic", "Professional", "Calm", "Dramatic", "Fun", "Inspirational"];

function buildPrompt(
  description: string,
  imageType: ImageType,
  fields: Partial<Record<FieldKey, string>>,
  style: string,
  ratio: string,
  mood: string,
) {
  const details = SUB_FIELDS[imageType]
    .map((f) => (fields[f.key]?.trim() ? `${f.label}: ${fields[f.key]!.trim()}` : null))
    .filter(Boolean)
    .join(". ");

  const typography =
    imageType === "Event / Poster" || imageType === "Social Media Graphic"
      ? " Include bold, legible typography and clear text hierarchy for any on-image text."
      : " Do not include any text or lettering in the image.";

  return [
    `A ${style.toLowerCase()} ${imageType === "General / Custom" ? "image" : imageType.toLowerCase()} of ${description.trim()}.`,
    details ? `${details}.` : "",
    `Mood: ${mood.toLowerCase()}. Aspect ratio: ${ratio}.`,
    "Carefully composed with a clear focal subject, balanced framing, believable environment and professional lighting with rich depth and colour.",
    typography.trim(),
    "High quality, sharp detail, production-ready.",
  ]
    .filter(Boolean)
    .join(" ");
}

function ImageGeneratorPage() {
  const [description, setDescription] = useState("");
  const [imageType, setImageType] = useState<ImageType>("General / Custom");
  const [fields, setFields] = useState<Partial<Record<FieldKey, string>>>({});
  const [style, setStyle] = useState("Photorealistic");
  const [ratio, setRatio] = useState("Square (1:1)");
  const [mood, setMood] = useState("Energetic");

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isFinal, setIsFinal] = useState(false);
  const [usedPrompt, setUsedPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState("");

  async function run(prompt: string) {
    setLoading(true);
    setError(null);
    setImage(null);
    setIsFinal(false);
    setUsedPrompt(prompt);
    try {
      await streamImage("/api/generate-image", prompt, (dataUrl, final) => {
        setImage(dataUrl);
        if (final) setIsFinal(true);
      });
      toast.success("Image generated");
    } catch (e) {
      setImage(null);
      const message = e instanceof Error ? e.message : "Image generation failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function generate() {
    if (!description.trim()) {
      toast.error("Please describe the image you want.");
      return;
    }
    void run(buildPrompt(description, imageType, fields, style, ratio, mood));
  }

  function download() {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `contentflow-${Date.now()}.png`;
    a.click();
    toast.success("Image downloaded");
  }

  return (
    <AppShell
      title="Image Generator"
      description="Describe anything — an event poster, an artist, a career, a product — and get a real, downloadable AI image."
    >
      <div className="surface-card p-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="image-description"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Image description
            </Label>
            <Textarea
              id="image-description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Big Maskandi festival with a large crowd, South African outdoor stage, colourful lights, energetic atmosphere"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Image type
            </Label>
            <Select
              value={imageType}
              onValueChange={(v) => {
                setImageType(v as ImageType);
                setFields({});
              }}
            >
              <SelectTrigger aria-label="Image type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {SUB_FIELDS[imageType].length > 0 && (
            <div className="grid gap-4 rounded-xl bg-ai-soft p-4 sm:grid-cols-2">
              {SUB_FIELDS[imageType].map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label
                    htmlFor={f.key}
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {f.label} <span className="normal-case font-normal">(optional)</span>
                  </Label>
                  <Input
                    id={f.key}
                    value={fields[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setFields((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          )}

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

          <Button size="lg" disabled={loading} onClick={generate}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
            {loading ? "Generating your image…" : "Generate Image"}
          </Button>
        </div>
      </div>

      {loading && !image && (
        <div className="surface-card mt-6 flex flex-col items-center gap-3 p-10 text-center">
          <Loader2 className="size-6 animate-spin text-ai" />
          <p className="text-sm font-medium">Generating your image…</p>
          <p className="text-xs text-muted-foreground">This can take up to a minute.</p>
        </div>
      )}

      {error && (
        <section className="surface-card mt-6 border-destructive/30 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 text-destructive" />
            <div className="min-w-0">
              <p className="font-semibold">Image generation failed</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              {usedPrompt && (
                <>
                  <p className="mt-3 text-xs text-muted-foreground">
                    No image was created. You can copy the optimised prompt below and paste it into
                    an external image tool.
                  </p>
                  <div className="mt-3 whitespace-pre-wrap rounded-xl bg-secondary/60 p-4 text-sm">
                    {usedPrompt}
                  </div>
                  <div className="mt-3">
                    <CopyButton value={usedPrompt} label="Copy Prompt" />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {image && (
        <section className="surface-card mt-6 p-6">
          <h2 className="text-lg font-bold">Your generated image</h2>
          <div className="mt-4 overflow-hidden rounded-2xl bg-secondary/40">
            <img
              src={image}
              alt={description || "AI generated image"}
              className={
                isFinal
                  ? "w-full transition-[filter] duration-500"
                  : "w-full blur-xl transition-[filter] duration-500"
              }
            />
          </div>
          {!isFinal && (
            <p className="mt-2 text-xs text-muted-foreground">Rendering final detail…</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" disabled={!isFinal} onClick={download}>
              <Download className="size-4" /> Download Image
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={() => void run(usedPrompt)}
            >
              <RefreshCw className="size-4" /> Regenerate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDraftPrompt(usedPrompt);
                setEditing((v) => !v);
              }}
            >
              <Pencil className="size-4" /> Edit Prompt & Regenerate
            </Button>
            <CopyButton value={usedPrompt} label="Copy Prompt" />
            <Button
              size="sm"
              variant="secondary"
              disabled={!isFinal}
              onClick={() => {
                try {
                  saveHistory({
                    kind: "image",
                    type: `Image · ${imageType}`,
                    imageType,
                    imageUrl: image,
                    content: description.trim(),
                    prompt: usedPrompt,
                  });
                  toast.success("Saved to History");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Could not save this image");
                }
              }}
            >
              <Save className="size-4" /> Save to History
            </Button>
          </div>

          {editing && (
            <div className="mt-4 space-y-3 rounded-xl border border-border p-4">
              <Label
                htmlFor="edit-prompt"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Edit the optimised prompt
              </Label>
              <Textarea
                id="edit-prompt"
                rows={6}
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
              />
              <Button
                size="sm"
                disabled={loading || !draftPrompt.trim()}
                onClick={() => {
                  setEditing(false);
                  void run(draftPrompt.trim());
                }}
              >
                <RefreshCw className="size-4" /> Regenerate with this prompt
              </Button>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setShowPrompt((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold"
              aria-expanded={showPrompt}
            >
              Prompt Used
              <ChevronDown
                className={showPrompt ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"}
              />
            </button>
            {showPrompt && (
              <p className="whitespace-pre-wrap border-t border-border px-4 py-3 text-xs text-muted-foreground">
                {usedPrompt}
              </p>
            )}
          </div>
        </section>
      )}
    </AppShell>
  );
}
