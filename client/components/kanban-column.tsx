"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import { MoreHorizontal, Plus, Calendar, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Column, Task } from "@/types/kanban"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, isTaskOverdue } from "@/lib/utils"
const userColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-cyan-500",
];
interface KanbanColumnProps {
  column: Column
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
  onAddTask: () => void
}

export default function KanbanColumn({ column, onEditTask, onDeleteTask, onAddTask }: KanbanColumnProps) {
  return (
    <div className="w-full flex-1 min-w-[300px] max-w-[400px]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">{column.title}</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddTask}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-[200px] bg-muted/30 p-3 rounded-md overflow-y-auto max-h-[calc(100vh-200px)]"
          >
            {column.tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No tasks</div>
            ) : (
              column.tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-background rounded-md border p-3 shadow-sm cursor-pointer"
                      onClick={() => onEditTask(task)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`text-xs px-2 py-0.5 rounded-full text-white ${task.categoryColor}`}>
                          {task.category}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onEditTask(task)
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteTask(task)
                              }}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:text-red-700 dark:focus:text-red-300"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <h4 className="font-medium mb-1">{task.title}</h4>

                      {task.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{task.description}</p>
                      )}

                      <div className="flex justify-between items-center">
      {task.assignees && task.assignees.length > 0 && (
        <div className="flex -space-x-2 mb-2">
          {task.assignees.map((user, idx) => {
            const avatarColor = user.color || userColors[idx % userColors.length];
            return (
              <Avatar key={user.id} className="h-6 w-6 border-2 border-white">
                <AvatarImage src={user.avatar } alt={user.name} />
                <AvatarFallback className={`${avatarColor} text-white text-xs`}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            );
          })}
        </div>
      )}

                        {task.dueDate && (
                          <div className="flex items-center text-xs ml-auto">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className={isTaskOverdue(task) ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}>
                              {formatDate(task.dueDate)}
                            </span>
                            {isTaskOverdue(task) && <AlertTriangle className="h-4 w-4 ml-1 text-red-600 dark:text-red-400" />}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
