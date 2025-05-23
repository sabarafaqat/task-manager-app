import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Task } from "@/types/kanban"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return ""

  // Check if the dateString is already in a simple format like "5 Oct"
  if (/^\d+ [A-Za-z]+$/.test(dateString)) {
    return dateString
  }

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    return dateString // Return the original string if parsing fails
  }
}

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate) return false

  try {
    const dueDate = new Date(task.dueDate)
    const today = new Date()

    // Reset time part for comparison
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)

    return dueDate < today && task.status !== "Done"
  } catch (error) {
    return false
  }
}

export function validateTask(task: Task, allTasks: Task[]): { valid: boolean; error?: string } {
  // Check for empty title
  if (!task.title.trim()) {
    return { valid: false, error: "Title cannot be empty" }
  }

  // Check title length
  if (task.title.length > 100) {
    return { valid: false, error: "Title cannot exceed 100 characters" }
  }

  // Check description length
  if (task.description && task.description.length > 500) {
    return { valid: false, error: "Description cannot exceed 500 characters" }
  }

  // Check for duplicate titles within the same status group
  const duplicateTask = allTasks.find(
    (t) => t.id !== task.id && t.title.toLowerCase() === task.title.toLowerCase() && t.status === task.status,
  )

  if (duplicateTask) {
    return { valid: false, error: "A task with this title already exists in this status group" }
  }

  return { valid: true }
}
