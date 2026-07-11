import { useState } from "react"
import Image from "next/image"
import { Check, Loader2 } from "lucide-react"
import { BOOKS, type Book } from "@/lib/chat-data"
import { cn } from "@/lib/utils"

export function BookSelector({
  activeSource,
  onSelect,
}: {
  activeSource?: string
  onSelect: (book: Book) => Promise<void>
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider px-1">
        Demo Books
      </h3>

      <div className="space-y-2">
        {BOOKS.map((book) => {
          const selected = activeSource === book.title || activeSource === book.filename
          const isLoading = loadingId === book.id
          return (
            <button
              key={book.id}
              type="button"
              disabled={loadingId !== null}
              onClick={async () => {
                if (loadingId) return
                setLoadingId(book.id)
                try {
                  await onSelect(book)
                } catch (err) {
                  console.error("Failed to select and index book:", err)
                } finally {
                  setLoadingId(null)
                }
              }}
              aria-pressed={selected}
              className={cn(
                "group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border bg-sidebar-accent/10 p-2 text-left transition-all hover:bg-sidebar-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring",
                selected
                  ? "border-sidebar-primary/50 bg-sidebar-accent/50 ring-1 ring-sidebar-primary/20 shadow-xs"
                  : "border-sidebar-border/30",
                loadingId !== null && !isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-muted/25 shadow-xs">
                <Image
                  src={book.cover || "/placeholder.svg"}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="36px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-xs z-10">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-sidebar-foreground">
                  {book.title}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {book.author}
                </p>
                <p className="text-[9px] text-muted-foreground/80 font-medium">
                  {book.pages} pages
                </p>
              </div>
              {selected && !isLoading && (
                <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-xs">
                  <Check className="size-2.5" aria-hidden="true" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
