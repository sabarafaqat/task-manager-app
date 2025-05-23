export interface Task {
  id: string
  title: string
  description: string
  status: "To Do" | "In Progress" | "Done"
  dueDate: string | null
  createdAt: string
  updatedAt: string
  category: string
  categoryColor: string
  assignees: User[]
  subtasks?: Subtask[]
  customFields?: CustomField[]
}

export interface Column {
  id: string
  title: string
  status: "To Do" | "In Progress" | "Done"
  tasks: Task[]
  color?: string
}

export interface User {
  id: string
  name: string
  avatar: string
  initials: string
  color: string
}

export interface Rule {
  id: string
  name: string
  condition: Condition
  action: Action
  enabled: boolean
}

export interface Condition {
  type: "due-date" | "subtasks-completed" | "custom-field"
  operator: "is-overdue" | "all-completed" | "equals" | "not-equals" | "contains"
  field?: string
  value?: string
}

export interface Action {
  type: "move-to-column"
  targetColumnId: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface CustomField {
  id: string
  name: string
  value: string
}
