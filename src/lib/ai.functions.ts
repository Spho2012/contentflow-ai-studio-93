import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  prompt: z.string().min(1),
  system: z.string().optional(),
});

export const runPrompt = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) {
      return { ok: false as const, error: "AI is not configured yet (missing API key)." };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          ...(data.system ? [{ role: "system", content: data.system }] : []),
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const message =
        res.status === 429
          ? "Too many requests right now. Please wait a moment and try again."
          : res.status === 402
            ? "AI credits are exhausted for this workspace. Add credits to continue."
            : `AI request failed (${res.status}). ${detail.slice(0, 200)}`;
      return { ok: false as const, error: message };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) return { ok: false as const, error: "The AI returned an empty response." };
    return { ok: true as const, text };
  });
