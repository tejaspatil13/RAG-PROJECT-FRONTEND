import { useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { getSuggestedQuestions } from "@/lib/chat-data"

export function SuggestedQuestions({
  activeSource,
  onPick,
  disabled,
  variant = "welcome",
}: {
  activeSource?: string
  onPick: (question: string) => void
  disabled?: boolean
  /** "welcome": wrapped grid for the empty state. "compact": a collapsible
   * 3-row block (scrolls sideways if it overflows) so it never pushes the
   * input out of view once a conversation is underway. */
  variant?: "welcome" | "compact"
}) {
  const questions = getSuggestedQuestions(activeSource)
  const [open, setOpen] = useState(true)

  if (questions.length === 0) return null

  if (variant === "compact") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
          aria-expanded={open}
        >
          <Sparkles className="size-3" aria-hidden="true" />
          Suggested questions
          <ChevronDown
            className={`size-3 transition-transform ${open ? "" : "-rotate-90"}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className="relative">
            <div className="grid grid-flow-col grid-rows-3 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {questions.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPick(q)}
                  className="w-max shrink-0 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
            {/* Fade hint at the trailing edge so a scrollable block reads as scrollable. */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Sparkles className="size-3.5" aria-hidden="true" />
        Suggested questions
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => onPick(q)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
