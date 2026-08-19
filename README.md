# ContentFlow AI Studio

Build a modern AI Content Creation Studio called "ContentFlow AI"

Project Purpose

Create a polished, responsive web application called ContentFlow AI.

The application is an individual AI Content Generator project for an AI bootcamp.

The main purpose is to allow users to enter an idea or information and use AI to generate different types of content.

The application must demonstrate:

AI content generation

Prompt engineering

Prompt optimisation

Content repurposing

Multiple content formats

A reusable Prompt Library

A professional portfolio-ready interface

Tagline:

"Create once. Generate everywhere."

DESIGN SYSTEM

Use a modern SaaS/AI aesthetic.

Primary colours

Deep Indigo: #4F46E5

Purple: #7C3AED

Cyan: #06B6D4

Background: #F8FAFC

White: #FFFFFF

Main text: #0F172A

Secondary text: #64748B

Success: #10B981

Use Deep Indigo as the main primary colour.

Use Purple for AI/creative features and Cyan for small highlights.

Do NOT use too many colours.

Use white cards with subtle borders, rounded corners and soft shadows.

The application should feel professional, clean, modern and suitable for an AI technology portfolio.

Use smooth hover states and subtle animations, but avoid excessive animation.

Make the interface fully responsive for desktop, tablet and mobile.

APPLICATION STRUCTURE

Create the following main navigation:

Dashboard

Generate

Image Creator

Repurpose

Prompt Library

History

About Project

Use a clean sidebar navigation on desktop and a responsive navigation system on mobile.

Include the ContentFlow AI logo/name at the top of the sidebar.

1. DASHBOARD

Create a professional dashboard showing:

Welcome message

Short explanation of ContentFlow AI

"Start Creating" primary button

Quick action cards:

Generate Text

Create Image

Repurpose Content

Browse Prompts

Show small statistics such as:

Content Generated

Prompts Used

Content Repurposed

Images Created

If real database storage is not available yet, use realistic demo data and structure the application so real persistence can be added later.

2. GENERATE CONTENT

Create the main AI content generator.

The user should be able to enter:

Content Topic / Idea

Large textarea.

Content Type

Dropdown options:

Social Media Caption

Blog Post

Email

Advertisement

WhatsApp Message

Video Script

Product Description

General Text

Platform

Options:

TikTok

Instagram

Facebook

LinkedIn

WhatsApp

Email

Website

General

Target Audience

Options:

Students

Young Adults

Professionals

Customers

Parents

General Audience

Also allow custom audience input.

Tone

Options:

Professional

Friendly

Exciting

Funny

Educational

Emotional

Persuasive

Inspirational

Length

Options:

Short

Medium

Long

Language

Allow the user to select the language.

Include:

GENERATE CONTENT

button using the primary Deep Indigo colour.

GENERATED CONTENT RESULT

After generation, show a beautiful result card.

Include:

Generated content

Copy button

Regenerate button

Improve button

Shorten button

Make Professional button

Make More Engaging button

Save button

Include a small section showing:

Prompt Used

This allows the user to see which prompt produced the result.

3. IMAGE CREATOR

Create a separate Image Creator page.

Allow the user to enter:

Image Description

Large textarea.

Image Style

Options:

Photorealistic

Illustration

Minimalist

3D

Cinematic

Cartoon

Professional

Poster

Aspect Ratio

Options:

Square

Portrait

Landscape

Mood

Options:

Energetic

Professional

Calm

Dramatic

Fun

Inspirational

Include:

GENERATE IMAGE

button.

If direct image generation is not available through the current AI integration, generate a highly detailed image-generation prompt and clearly display it as:

Optimised Image Prompt

Include Copy Prompt and Regenerate Prompt buttons.

Do not pretend an image was generated if the connected AI service cannot actually generate images.

4. CONTENT REPURPOSING

Create a powerful feature called:

Repurpose Content

The user can paste existing content into a textarea.

Then allow them to select multiple output formats:

TikTok Script

Instagram Caption

Facebook Post

LinkedIn Post

WhatsApp Message

Email

Blog Summary

Short Video Script

The application should transform the original content into the selected formats.

Display each generated format in its own card.

Include Copy and Save buttons.

This feature should be presented as:

One idea → Multiple pieces of content

5. PROMPT LIBRARY

Create a dedicated Prompt Library.

This section is REQUIRED.

The Prompt Library should contain reusable and tested prompts.

Create categories:

Social Media

Email

Blog

Marketing

Image Generation

Repurposing

Productivity

Each prompt card should display:

Prompt name

Category

Purpose

Prompt text

Variables/placeholders

Copy Prompt button

Use Prompt button

Create the following initial prompts:

Prompt 1 — Social Media Caption

"You are a professional social media content creator. Create an engaging {platform} caption about {topic} for {audience}. Use a {tone} tone. Keep it {length}. Include a strong call-to-action and relevant hashtags."

Prompt 2 — Promotional Email

"You are a professional marketing copywriter. Write a {tone} promotional email about {topic} for {audience}. Include an attention-grabbing subject line, clear benefits, a call-to-action and a professional closing."

Prompt 3 — Blog Post

"You are an experienced content writer. Write a {length} blog post about {topic} for {audience}. Use a clear structure with a title, introduction, headings, useful information and conclusion. Use a {tone} tone."

Prompt 4 — Video Script

"You are a professional short-form video scriptwriter. Create a {length} video script about {topic} for {platform}. Start with a strong hook, provide useful information and finish with a clear call-to-action. Use a {tone} tone."

Prompt 5 — Content Repurposing

"You are an expert content repurposing specialist. Transform the following content into {output_format}. Preserve the key message while adapting the language, structure and tone for {audience}. Make the result engaging and platform appropriate."

Prompt 6 — Image Generation

"You are an expert AI image prompt engineer. Create a detailed image-generation prompt for {topic}. The desired style is {style}, the mood is {mood}, and the aspect ratio is {aspect_ratio}. Include details about composition, lighting, subject, environment and visual style."

Prompt 7 — Improve Content

"You are an expert content editor. Improve the following content while keeping its original meaning. Make it more {improvement_style}, clear and engaging for {audience}. Return only the improved version."

6. PROMPT OPTIMISATION / CASE STUDY

Create a section called:

Prompt Lab

This section demonstrates prompt engineering.

Show an example of:

Basic Prompt

"Write a social media post about our event."

Then show:

Optimised Prompt

"You are a social media marketing expert. Create an exciting Instagram promotional post for {event} targeting {audience}. Mention {key_information}. Use an energetic tone, include a strong call-to-action and add 5 relevant hashtags. Keep the post under 120 words."

Show the difference between the basic prompt and optimised prompt.

Add an explanation:

Why the second prompt is better:

Defines the AI's role

Provides context

Defines the audience

Defines the tone

Adds constraints

Specifies the required output

Gives the AI clear instructions

This section is important because the project must demonstrate prompt optimisation.

7. HISTORY

Create a History page showing previously generated content.

Each history item should show:

Content type

Date/time

Short preview

Prompt used

View button

Copy button

Delete button

If authentication/database functionality is not configured, use local storage or a simple frontend state solution so the prototype remains functional.

8. ABOUT PROJECT

Create an About Project page explaining:

Project Name

ContentFlow AI

Purpose

An AI-powered content generation and repurposing tool designed to help users create multiple types of content from a single idea.

Features

AI content generation

Image prompt generation

Content repurposing

Prompt library

Prompt optimisation

Multiple tones

Multiple audiences

Content history

AI Skills Demonstrated

Prompt engineering

Prompt refinement

Generative AI

Content structuring

AI productivity workflows

IMPORTANT FUNCTIONALITY

Do not create a purely visual mockup.

Build functional interactions wherever possible.

Buttons should work.

Forms should validate input.

Generated content should appear dynamically.

Copy buttons should copy text to the clipboard.

Save buttons should save generated content.

The Prompt Library should allow users to copy and use prompts.

The Repurpose feature should display separate generated outputs.

Use clean loading states while AI content is being generated.

Show friendly error messages when generation fails.

AI INTEGRATION

Use the safest and simplest supported AI integration available in the Lovable environment.

Keep API keys and secrets secure.

Never expose private API keys in frontend code.

If an AI API is not configured, create the application architecture so the integration can easily be connected later and provide a clearly labelled demo/fallback mode.

Do not falsely claim that AI content or images were generated by a real model when the application is only using mock data.

FINAL UI DETAILS

Use:

Rounded cards

Clear typography

Plenty of whitespace

Subtle shadows

Indigo primary buttons

Purple AI accents

Cyan highlights

Responsive design

Accessible contrast

Clear empty states

Loading animations

Toast notifications

The final application should look like a real modern AI SaaS product rather than a basic student HTML page.

Prioritise usability and simplicity over excessive visual effects.

Make the project polished enough to demonstrate in an AI bootcamp presentation and include in a professional portfolio.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://contentflow-ai-studio-93.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/577ad40f-8d43-4088-aeca-ba73ace81f78).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
