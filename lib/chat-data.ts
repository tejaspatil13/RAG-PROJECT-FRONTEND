export type Role = "user" | "assistant"

export type Message = {
  id: string
  role: Role
  content: string
  createdAt: number
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
  /** Name of the active document/source this conversation is grounded on. */
  source?: string
}

export type Book = {
  id: string
  title: string
  author: string
  cover: string
  /** approximate size shown in the upload chip */
  pages: number
  accent: string
  filename: string
}

/**
 * Demo "RAG projects" — a small library the user can pick from.
 * Selecting one behaves as if that document was uploaded.
 */
export const BOOKS: Book[] = [
  {
    id: "data-science-scratch",
    title: "Data Science from Scratch",
    author: "Joel Grus",
    cover: "/books/data-science-cover.png",
    pages: 388,
    accent: "oklch(0.68 0.15 258)",
    filename: "Data_Science_From_Scratch.pdf",
  },
]

export const DATA_SCIENCE_QUESTIONS: string[] = [
  "What is data science, and what three skills are at its core?",
  "Why does the author choose Python for this book instead of R or Java?",
  "Explain how the friends_of_friend_ids() function works in the DataSciencester example.",
  "Why is degree centrality not always a good measure of importance in a social network?",
  "According to the salary analysis example, how does experience affect a data scientist's salary?",
  "What is the difference between a list, tuple, and dictionary in Python? Give examples from the book.",
]

export function getSuggestedQuestions(activeSource?: string): string[] {
  if (activeSource === "Data_Science_From_Scratch.pdf") {
    return DATA_SCIENCE_QUESTIONS
  }
  return []
}

export function createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
