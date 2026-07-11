import { Sparkles } from "lucide-react"
import { getSuggestedQuestions } from "@/lib/chat-data"

export function SuggestedQuestions({
  activeSource,
  onPick,
  disabled,
}: {
  activeSource?: string
  onPick: (question: string) => void
  disabled?: boolean
}) {
  const questions = getSuggestedQuestions(activeSource)

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

