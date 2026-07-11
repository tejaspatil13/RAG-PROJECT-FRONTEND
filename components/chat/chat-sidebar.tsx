"use client"

import { MessageSquare, Plus, Sparkles, Trash2, X } from "lucide-react"
import type { Book, Conversation } from "@/lib/chat-data"
import { cn } from "@/lib/utils"
import { PdfUpload } from "./pdf-upload"
import { BookSelector } from "./book-selector"

export function ChatSidebar({
  conversations,
  activeId,
  open,
  activeSource,
  onSelect,
  onNew,
  onDelete,
  onClose,
  onSelectBook,
  onUploadPdf,
  onClearSource,
}: {
  conversations: Conversation[]
  activeId: string | null
  open: boolean
  activeSource?: string
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onClose: () => void
  onSelectBook: (book: Book) => Promise<void>
  onUploadPdf: (file: File) => Promise<void>
  onClearSource: () => void
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 md:static md:z-auto md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
            </div>
            <span className="text-base font-semibold">Context AI </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="px-3">
          <button
            type="button"
            onClick={onNew}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sidebar-primary px-3 py-2.5 text-sm font-medium text-sidebar-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <Plus className="size-4" aria-hidden="true" />
            New chat
          </button>
        </div>

        {/* Document grounding section */}
        <div className="mt-5 px-3 space-y-4">
          <PdfUpload
            activeSource={activeSource}
            onUpload={onUploadPdf}
            onClear={onClearSource}
          />
          <BookSelector
            activeSource={activeSource}
            onSelect={onSelectBook}
          />
        </div>


        <div className="mt-4 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Chat history
        </div>

        <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {conversations.length === 0 && (
            <p className="px-2 py-4 text-sm text-muted-foreground">
              No conversations yet.
            </p>
          )}
          {conversations.map((c) => {
            const active = c.id === activeId
            return (
              <div
                key={c.id}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none"
                >
                  <MessageSquare
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="truncate">{c.title}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                  aria-label={`Delete ${c.title}`}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
              JD
            </div>
            <div className="min-w-0">
              <button className="truncate text-sm font-medium"></button>
              <p className="truncate text-xs text-muted-foreground"></p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
