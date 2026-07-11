"use client"

import { useEffect, useMemo, useState } from "react"
import { ChatNavbar } from "@/components/chat/chat-navbar"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWindow } from "@/components/chat/chat-window"
import { type Book, type Conversation, createId } from "@/lib/chat-data"

function newConversation(): Conversation {
  return {
    id: createId(),
    title: "New chat",
    messages: [],
    updatedAt: Date.now(),
  }
}

export default function Page() {
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    newConversation(),
  ])
  const [activeId, setActiveId] = useState<string | null>(
    () => conversations[0]?.id ?? null,
  )
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", isDark)
    root.classList.toggle("light", !isDark)
  }, [isDark])

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  )

  function updateActive(updater: (c: Conversation) => Conversation) {
    if (!activeId) return
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? updater(c) : c)),
    )
  }

  function handleNewChat() {
    const conv = newConversation()
    setConversations((prev) => [conv, ...prev])
    setActiveId(conv.id)
    setSidebarOpen(false)
  }

  function handleDelete(id: string) {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (next.length === 0) {
        const fresh = newConversation()
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  function setSource(source: string) {
    updateActive((c) => ({ ...c, source, updatedAt: Date.now() }))
  }

  async function handleSelectBook(book: Book) {
    // Simply set the active source to the book's filename.
    // The book's content has already been pre-computed and stored in the vector database on the backend.
    setSource(book.filename)
  }

  async function handleUploadPdf(file: File) {
    // Send the real PDF to your backend's POST /upload (via the proxy route).
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data?.error ?? "Upload failed.")
    }

    // Backend returns { message, pages, chunks }. Ground this chat on the file.
    setSource(file.name)
  }

  function handleClearSource() {
    updateActive((c) => ({ ...c, source: undefined, updatedAt: Date.now() }))
  }

  async function handleSend(text: string) {
    if (!activeId) return
    const conversationId = activeId

    const userMsg = {
      id: createId(),
      role: "user" as const,
      content: text,
      createdAt: Date.now(),
    }

    updateActive((c) => ({
      ...c,
      title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
      messages: [...c.messages, userMsg],
      updatedAt: Date.now(),
    }))

    setIsTyping(true)

    let answer: string
    try {
      // Calls your backend's POST /chat (via the proxy route).
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.error ?? "The backend failed to answer.")
      }
      // Backend responds with { question, answer }.
      answer = data.answer ?? "No answer was returned."
    } catch (err) {
      answer = `⚠️ ${(err as Error).message}`
    }

    const assistantMsg = {
      id: createId(),
      role: "assistant" as const,
      content: answer,
      createdAt: Date.now(),
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() }
          : c,
      ),
    )
    setIsTyping(false)
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        open={sidebarOpen}
        activeSource={active?.source}
        onSelect={(id) => {
          setActiveId(id)
          setSidebarOpen(false)
        }}
        onNew={handleNewChat}
        onDelete={handleDelete}
        onClose={() => setSidebarOpen(false)}
        onUploadPdf={handleUploadPdf}
        onClearSource={handleClearSource}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatNavbar
          title={active?.title ?? "New chat"}
          source={active?.source}
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onClearSource={handleClearSource}
        />

        {active && (
          <ChatWindow
            messages={active.messages}
            isTyping={isTyping}
            activeSource={active.source}
            onSend={handleSend}
            onSelectBook={handleSelectBook}
            onUploadPdf={handleUploadPdf}
            onClearSource={handleClearSource}
          />
        )}
      </div>
    </div>
  )
}
