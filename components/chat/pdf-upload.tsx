import { useRef, useState } from "react"
import { FileText, Loader2, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function PdfUpload({
  activeSource,
  onUpload,
  onClear,
}: {
  activeSource?: string
  onUpload: (file: File) => Promise<void>
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const MAX_FILE_SIZE_MB = 10
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files (.pdf) can be uploaded.")
      return
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    setError(null)
    setUploading(true)
    try {
      await onUpload(file)
    } catch (err) {
      setError((err as Error).message || "Upload failed. Is your backend running?")
    } finally {
      setUploading(false)
    }
  }

  if (activeSource) {
    return (
      <div className="flex items-center justify-between gap-2.5 rounded-xl border border-sidebar-primary/20 bg-sidebar-accent/30 p-2.5 shadow-2xs">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              {activeSource}
            </p>
            <p className="text-[9px] text-muted-foreground/80 font-medium">
              Grounded Source
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring"
          aria-label="Remove document"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider px-1">
        Custom Grounding Source
      </h3>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!uploading) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (!uploading) handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 py-4 text-center transition-colors shadow-2xs",
          dragOver ? "border-sidebar-primary bg-sidebar-accent/50" : "border-sidebar-border/50 bg-sidebar-accent/10",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary/10 text-sidebar-primary">
          {uploading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="size-4" aria-hidden="true" />
          )}
        </div>

        {uploading ? (
          <p className="text-[10px] font-semibold text-sidebar-foreground">
            Uploading &amp; indexing...
          </p>
        ) : (
          <div className="text-[10px]">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-semibold text-sidebar-primary underline underline-offset-2 hover:opacity-80 focus-visible:outline-none"
            >
              Upload PDF
            </button>{" "}
            <span className="text-muted-foreground">
              or drag &amp; drop (Max 10MB)
            </span>
          </div>
        )}

        {error && (
          <p className="text-[10px] font-medium text-destructive px-1" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
