import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { BOOKS, type Book } from "@/lib/chat-data"
import { cn } from "@/lib/utils"

export function BookSelector({
  activeSource,
  onSelect,
  variant,
}: {
  activeSource?: string
  onSelect: (book: Book) => Promise<void>
  /** "compact": stacked card for mobile, sits side-by-side with PDF upload.
   * "featured": large showcase card for desktop, where there's room to spare. */
  variant: "compact" | "featured"
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function select(book: Book) {
    if (loadingId) return
    setLoadingId(book.id)
    try {
      await onSelect(book)
    } catch (err) {
      console.error("Failed to select and index book:", err)
    } finally {
      setLoadingId(null)
    }
  }

  if (variant === "featured") {
    return (
      <div>
        <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
          Demo Books
        </h3>
        <div className="flex flex-wrap gap-3">
          {BOOKS.map((book) => {
            const selected = activeSource === book.title || activeSource === book.filename
            const isLoading = loadingId === book.id
            return (
              <button
                key={book.id}
                type="button"
                disabled={loadingId !== null}
                onClick={() => select(book)}
                aria-pressed={selected}
                className={cn(
                  "group relative flex w-full max-w-sm items-center gap-4 overflow-hidden rounded-2xl border bg-card p-3.5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border",
                  loadingId !== null && !isLoading && "cursor-not-allowed opacity-50",
                )}
              >
                <div className="relative h-24 w-[68px] shrink-0 overflow-hidden rounded-lg shadow-md ring-1 ring-black/5">
                  <Image
                    src={book.cover || "/placeholder.svg"}
                    alt={`Cover of ${book.title}`}
                    fill
                    priority
                    sizes="68px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-xs">
                      <Loader2 className="size-5 animate-spin text-primary" />
                    </div>
                  )}
                  {selected && !isLoading && (
                    <div className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                      <Check className="size-2.5" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground text-balance">
                    {book.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {book.author}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-muted-foreground/80">
                    {book.pages} pages
                  </p>
                  <span
                    className={cn(
                      "mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground",
                    )}
                  >
                    {selected ? (
                      <>
                        Selected <Check className="size-3" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        Use this book <ArrowRight className="size-3" aria-hidden="true" />
                      </>
                    )}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="truncate px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        Demo Book
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
              onClick={() => select(book)}
              aria-pressed={selected}
              className={cn(
                "group relative flex w-full flex-col items-center gap-2 overflow-hidden rounded-xl border bg-sidebar-accent/10 p-3 text-center transition-all hover:bg-sidebar-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring",
                selected
                  ? "border-sidebar-primary/50 bg-sidebar-accent/50 ring-1 ring-sidebar-primary/20 shadow-xs"
                  : "border-sidebar-border/30",
                loadingId !== null && !isLoading && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="relative h-24 w-[68px] shrink-0 overflow-hidden rounded-md bg-muted/25 shadow-xs">
                <Image
                  src={book.cover || "/placeholder.svg"}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="68px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-xs">
                    <Loader2 className="size-4 animate-spin text-primary" />
                  </div>
                )}
                {selected && !isLoading && (
                  <div className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-xs">
                    <Check className="size-2.5" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="w-full min-w-0">
                <p className="truncate text-xs font-semibold text-sidebar-foreground">
                  {book.title}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {book.author}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
