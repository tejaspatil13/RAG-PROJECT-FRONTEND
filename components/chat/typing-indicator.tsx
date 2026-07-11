import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Bot className="size-4" aria-hidden="true" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
        <span className="sr-only">Assistant is typing</span>
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  )
}
