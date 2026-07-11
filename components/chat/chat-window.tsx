import { useEffect, useRef, useState } from "react"
import { ArrowUp, Bot } from "lucide-react"
import type { Message } from "@/lib/chat-data"
import { MessageBubble } from "./message-bubble"
import { SuggestedQuestions } from "./suggested-questions"
import { TypingIndicator } from "./typing-indicator"

export function ChatWindow({
  messages,
  isTyping,
  activeSource,
  onSend,
}: {
  messages: Message[]
  isTyping: boolean
  activeSource?: string
  onSend: (text: string) => void
}) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const isEmpty = messages.length === 0

  useEffect(() => {
    // Only follow the conversation to the bottom once it has started.
    if (messages.length === 0 && !isTyping) return
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isTyping])

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      submit(input)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Scrollable content */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          {/* Empty state / conversation */}
          {isEmpty ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center py-12">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xs">
                <Bot className="size-7" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-xl font-bold tracking-tight text-foreground text-balance">
                {activeSource
                  ? `Grounding on ${activeSource}`
                  : "Welcome to DocuMind"}
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground/90 leading-relaxed text-pretty">
                {activeSource
                  ? "Ask any question below. The chatbot will retrieve context and answer grounded strictly in the book."
                  : "To begin, select a demo book or upload a PDF from the sidebar. Once selected, suggested questions will appear here."}
              </p>
              {activeSource && (
                <div className="mt-8 w-full text-left">
                  <SuggestedQuestions
                    activeSource={activeSource}
                    onPick={(q) => submit(q)}
                    disabled={isTyping}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-background px-4 py-3">
        <div className="mx-auto w-full max-w-3xl">
          {!isEmpty && (
            <div className="mb-3">
              <SuggestedQuestions
                activeSource={activeSource}
                onPick={(q) => submit(q)}
                disabled={isTyping}
              />
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
            className="flex items-end gap-2 rounded-2xl border-2 border-border bg-card p-2 shadow-sm transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={
                activeSource
                  ? `Ask a question about ${activeSource}...`
                  : "Ask a question (select a document for grounded answers)..."
              }
              className="max-h-40 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="size-5" aria-hidden="true" />
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Answers come from your RAG backend, grounded in the uploaded
            document.
          </p>
        </div>
      </div>
    </div>
  )
}
