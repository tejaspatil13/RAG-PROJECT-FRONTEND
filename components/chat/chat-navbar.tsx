"use client"

import { Moon, PanelLeft, Sun, X } from "lucide-react"

export function ChatNavbar({
  title,
  source,
  isDark,
  onToggleTheme,
  onToggleSidebar,
  onClearSource,
}: {
  title: string
  source?: string
  isDark: boolean
  onToggleTheme: () => void
  onToggleSidebar: () => void
  onClearSource?: () => void
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
          {/* Desktop view */}
          <p className="hidden md:block truncate text-xs text-muted-foreground">
            {source ? `Grounded on: ${source}` : "No document selected"}
          </p>
          {/* Mobile view */}
          {source ? (
            <div className="flex md:hidden items-center gap-1 mt-0.5">
              <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary max-w-[150px] truncate">
                {source}
              </span>
              {onClearSource && (
                <button
                  type="button"
                  onClick={onClearSource}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Clear document grounding"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              )}
            </div>
          ) : (
            <p className="block md:hidden truncate text-xs text-muted-foreground">
              No document selected
            </p>
          )}
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
