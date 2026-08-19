export type PromptCategory =
  | "Social Media"
  | "Email"
  | "Blog"
  | "Marketing"
  | "Image Generation"
  | "Repurposing"
  | "Productivity";

export type LibraryPrompt = {
  id: string;
  name: string;
  category: PromptCategory;
  purpose: string;
  text: string;
  variables: string[];
};

export const PROMPT_LIBRARY: LibraryPrompt[] = [
  {
    id: "social-caption",
    name: "Social Media Caption",
    category: "Social Media",
    purpose: "Create engaging captions tailored to a platform and audience.",
    text: "You are a professional social media content creator. Create an engaging {platform} caption about {topic} for {audience}. Use a {tone} tone. Keep it {length}. Include a strong call-to-action and relevant hashtags.",
    variables: ["platform", "topic", "audience", "tone", "length"],
  },
  {
    id: "promo-email",
    name: "Promotional Email",
    category: "Email",
    purpose: "Write conversion-focused promotional emails.",
    text: "You are a professional marketing copywriter. Write a {tone} promotional email about {topic} for {audience}. Include an attention-grabbing subject line, clear benefits, a call-to-action and a professional closing.",
    variables: ["tone", "topic", "audience"],
  },
  {
    id: "blog-post",
    name: "Blog Post",
    category: "Blog",
    purpose: "Produce structured long-form articles.",
    text: "You are an experienced content writer. Write a {length} blog post about {topic} for {audience}. Use a clear structure with a title, introduction, headings, useful information and conclusion. Use a {tone} tone.",
    variables: ["length", "topic", "audience", "tone"],
  },
  {
    id: "video-script",
    name: "Video Script",
    category: "Marketing",
    purpose: "Short-form video scripts with hook and CTA.",
    text: "You are a professional short-form video scriptwriter. Create a {length} video script about {topic} for {platform}. Start with a strong hook, provide useful information and finish with a clear call-to-action. Use a {tone} tone.",
    variables: ["length", "topic", "platform", "tone"],
  },
  {
    id: "repurpose",
    name: "Content Repurposing",
    category: "Repurposing",
    purpose: "Turn one piece of content into another format.",
    text: "You are an expert content repurposing specialist. Transform the following content into {output_format}. Preserve the key message while adapting the language, structure and tone for {audience}. Make the result engaging and platform appropriate.",
    variables: ["output_format", "audience"],
  },
  {
    id: "image-prompt",
    name: "Image Generation",
    category: "Image Generation",
    purpose: "Engineer detailed prompts sent straight to a real image model.",
    text: "You are an expert AI image prompt engineer. Create a detailed image-generation prompt for {topic}, of type {image_type} (e.g. event/poster, artist/performer, career/profession, product, or general). The desired style is {style}, the mood is {mood}, and the aspect ratio is {aspect_ratio}. Include details about composition, lighting, subject, environment, and visual style, and include typography guidance only if the image type is a poster or graphic with text. This prompt will be sent directly to an image-generation model to produce a real image.",
    variables: ["topic", "image_type", "style", "mood", "aspect_ratio"],
  },
  {
    id: "improve-content",
    name: "Improve Content",
    category: "Productivity",
    purpose: "Refine existing content without changing its meaning.",
    text: "You are an expert content editor. Improve the following content while keeping its original meaning. Make it more {improvement_style}, clear and engaging for {audience}. Return only the improved version.",
    variables: ["improvement_style", "audience"],
  },
];

export const PROMPT_CATEGORIES: PromptCategory[] = [
  "Social Media",
  "Email",
  "Blog",
  "Marketing",
  "Image Generation",
  "Repurposing",
  "Productivity",
];

export const BASIC_PROMPT = "Write a social media post about our event.";

export const OPTIMISED_PROMPT =
  "You are a social media marketing expert. Create an exciting Instagram promotional post for {event} targeting {audience}. Mention {key_information}. Use an energetic tone, include a strong call-to-action and add 5 relevant hashtags. Keep the post under 120 words.";

export const OPTIMISATION_REASONS = [
  "Defines the AI's role",
  "Provides context",
  "Defines the audience",
  "Defines the tone",
  "Adds constraints",
  "Specifies the required output",
  "Gives the AI clear instructions",
];
