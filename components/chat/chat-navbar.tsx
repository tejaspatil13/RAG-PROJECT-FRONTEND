"use client"

import { Moon, PanelLeft, Sun } from "lucide-react"

export function ChatNavbar({
  title,
  source,
  isDark,
  onToggleTheme,
  onToggleSidebar,
}: {
  title: string
  source?: string
  isDark: boolean
  onToggleTheme: () => void
  onToggleSidebar: () => void
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-5" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-foreground">
            {title}
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            {source ? `Grounded on: ${source}` : "No document selected"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun className="size-5" aria-hidden="true" />
        ) : (
          <Moon className="size-5" aria-hidden="true" />
        )}
      </button>
    </header>
  )
}
