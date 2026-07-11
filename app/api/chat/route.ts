import { NextResponse } from "next/server"

// Base URL of YOUR backend. Set BACKEND_API_URL in Project Settings > Vars.
// Falls back to the local FastAPI address you shared.
const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000"

export const runtime = "nodejs"

/**
 * Proxies a question to your backend's POST /chat endpoint.
 * Your backend expects JSON { question } and responds with
 * { question, answer }.
 */
export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    if (typeof question !== "string" || question.trim() === "") {
      return NextResponse.json(
        { error: "A non-empty 'question' string is required." },
        { status: 400 },
      )
    }

    const res = await fetch(`${BACKEND_API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail ?? "The backend failed to answer." },
        { status: res.status },
      )
    }

    // Pass the backend's { question, answer } straight through.
    return NextResponse.json(data)
  } catch (err) {
    console.log("[v0] /api/chat error:", (err as Error).message)
    return NextResponse.json(
      { error: "Could not reach the backend. Is it running?" },
      { status: 502 },
    )
  }
}
