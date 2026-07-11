import { useEffect, useRef, useState } from "react"
import { ArrowUp, FileText, X } from "lucide-react"
import type { Book, Message } from "@/lib/chat-data"
import { MessageBubble } from "./message-bubble"
import { SuggestedQuestions } from "./suggested-questions"
import { TypingIndicator } from "./typing-indicator"
import { PdfUpload } from "./pdf-upload"
import { BookSelector } from "./book-selector"

export function ChatWindow({
  messages,
  isTyping,
  activeSource,
  onSend,
  onSelectBook,
  onUploadPdf,
  onClearSource,
}: {
  messages: Message[]
  isTyping: boolean
  activeSource?: string
  onSend: (text: string) => void
  onSelectBook?: (book: Book) => Promise<void>
  onUploadPdf?: (file: File) => Promise<void>
  onClearSource?: () => void
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
        <div className="mx-auto w-full max-w-3xl px-4 py-4">
          {/* Empty state / conversation */}
          {isEmpty ? (
            <div className="flex flex-col items-center text-center">
              {/* No source yet: show the pickers. Mobile gets upload + demo book side by side. */}
              {!activeSource && onSelectBook && onUploadPdf && onClearSource && (
                <div className="mb-4 grid w-full max-w-md grid-cols-2 gap-3 text-left md:hidden">
                  <div className="rounded-xl border border-border bg-card/50 p-3 shadow-xs">
                    <PdfUpload
                      activeSource={activeSource}
                      onUpload={onUploadPdf}
                      onClear={onClearSource}
                    />
                  </div>
                  <div className="rounded-xl border border-border bg-card/50 p-3 shadow-xs">
                    <BookSelector
                      variant="compact"
                      activeSource={activeSource}
                      onSelect={onSelectBook}
                    />
                  </div>
                </div>
              )}

              {/* No source yet, desktop: demo books get a showcase instead of the thin sidebar */}
              {!activeSource && onSelectBook && (
                <div className="mb-4 hidden w-full max-w-2xl text-left md:block">
                  <BookSelector
                    variant="featured"
                    activeSource={activeSource}
                    onSelect={onSelectBook}
                  />
                </div>
              )}

              {/* Source active: a single compact chip instead of the full picker */}
              {activeSource && onClearSource && (
                <div className="mb-4 w-full max-w-md">
                  <div className="flex items-center justify-between gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 shadow-2xs text-left">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {activeSource}
                        </p>
                        <p className="text-[10px] text-muted-foreground/80 font-medium">
                          Grounded — ask away below
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onClearSource}
                      className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none"
                      aria-label="Remove document"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              {/* Suggested Questions */}
              {activeSource && (
                <div className="w-full text-left">
                  <SuggestedQuestions
                    variant="compact"
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
            <div className="mb-2.5">
              <SuggestedQuestions
                variant="compact"
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
