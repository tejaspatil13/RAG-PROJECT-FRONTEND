import { NextResponse } from "next/server"

// Base URL of YOUR backend. Set BACKEND_API_URL in Project Settings > Vars.
// Falls back to the local FastAPI address you shared.
const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000"

export const runtime = "nodejs"

/**
 * Proxies a PDF upload to your backend's POST /upload endpoint.
 * Your backend expects multipart/form-data with a "file" field and
 * responds with { message, pages, chunks }.
 */
export async function POST(request: Request) {
  try {
    const incoming = await request.formData()
    const file = incoming.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Attach a PDF under the 'file' field." },
        { status: 400 },
      )
    }

    // Rebuild the form-data so we forward exactly what your backend expects.
    const forward = new FormData()
    forward.append("file", file, file.name)

    const res = await fetch(`${BACKEND_API_URL}/upload`, {
      method: "POST",
      body: forward,
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail ?? "Upload failed on the backend." },
        { status: res.status },
      )
    }

    // Pass the backend's { message, pages, chunks } straight through.
    return NextResponse.json(data)
  } catch (err) {
    console.log("[v0] /api/upload error:", (err as Error).message)
    return NextResponse.json(
      { error: "Could not reach the backend. Is it running?" },
      { status: 502 },
    )
  }
}
