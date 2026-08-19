import { Link, useRouterState } from "@tanstack/react-router";
import {
  Image as ImageIcon,
  Info,
  LayoutDashboard,
  Library,
  Menu,
  History as HistoryIcon,
  Repeat2,
  Sparkles,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/generate", label: "Generate", icon: Sparkles },
  { to: "/image-creator", label: "Image Creator", icon: ImageIcon },
  { to: "/repurpose", label: "Repurpose", icon: Repeat2 },
  { to: "/prompt-library", label: "Prompt Library", icon: Library },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/about", label: "About Project", icon: Info },
] as const;

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-2 py-1">
      <span className="gradient-ai flex size-9 items-center justify-center rounded-xl text-primary-foreground">
        <Sparkles className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-extrabold">ContentFlow AI</span>
        <span className="block text-xs text-muted-foreground">Create once. Generate everywhere.</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-sidebar p-4 lg:flex lg:flex-col lg:gap-6">
        <Brand />
        <NavLinks />
        <div className="mt-auto rounded-xl bg-ai-soft p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">AI Bootcamp Project</p>
          <p className="mt-1">
            Prompt engineering, optimisation and content repurposing in one studio.
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-border p-2 text-foreground"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open && (
        <div className="border-b border-border bg-card p-4 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
