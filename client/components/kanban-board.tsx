"use client";

import { useState, useEffect } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Search, Bell, HelpCircle, Plus, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import type { Task, Column, User } from "../types/kanban";
import { generateId, validateTask } from "../lib/utils";
import KanbanColumn from "./kanban-column";
import TaskModal from "./task-modal";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import Sidebar from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ProfileModal from "./ProfileModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ThemeToggle } from "./theme-toggle";
import { useMediaQuery } from "../hooks/use-media-query";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/services/authService";
import {
  getTasks,
  deleteTask,
  updateTask,
  createTask,
  reset,
} from "../features/tasks/taskSlice";
import type { AppDispatch } from "../app/store";
import type { RootState } from "../app/store";
// Dummy users data
const dummyUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    avatar: "/avatars/avatar-1.png",
    initials: "AJ",
    color: "bg-blue-500",
  },
  {
    id: "user-2",
    name: "Maria Garcia",
    avatar: "/avatars/avatar-2.png",
    initials: "MG",
    color: "bg-pink-500",
  },
  {
    id: "user-3",
    name: "David Kim",
    avatar: "/avatars/avatar-3.png",
    initials: "DK",
    color: "bg-green-500",
  },
  {
    id: "user-4",
    name: "Sarah Chen",
    avatar: "/avatars/avatar-4.png",
    initials: "SC",
    color: "bg-purple-500",
  },
  {
    id: "user-5",
    name: "James Wilson",
    avatar: "/avatars/avatar-5.png",
    initials: "JW",
    color: "bg-yellow-500",
  },
  {
    id: "user-6",
    name: "Emily Brown",
    avatar: "/avatars/avatar-6.png",
    initials: "EB",
    color: "bg-teal-500",
  },
  {
    id: "user-7",
    name: "Michael Lee",
    avatar: "/avatars/avatar-7.png",
    initials: "ML",
    color: "bg-orange-500",
  },
];

// Create a date 2 days ago for overdue task
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

// Create a date 2 days in the future
const twoDaysLater = new Date();
twoDaysLater.setDate(twoDaysLater.getDate() + 2);

// Mock data for initial tasks
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Hero section",
    description:
      "Create a design system for a hero section in 2 different variants. Create a simple presentation with these components.",
    status: "To Do",
    dueDate: twoDaysLater.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: "DESIGN SYSTEM",
    categoryColor: "bg-green-500",
    assignees: [dummyUsers[0], dummyUsers[1]],
  },
  {
    id: "task-2",
    title: "Typography change",
    description:
      "Modify typography and styling of text placed on 8 screens of the website design. Prepare a documentation.",
    status: "To Do",
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: "TYPOGRAPHY",
    categoryColor: "bg-blue-500",
    assignees: [dummyUsers[2]],
  },
  {
    id: "task-3",
    title: "Implement design screens",
    description:
      "Our designers created 5 screens for a website that needs to be implemented by our dev team.",
    status: "In Progress",
    dueDate: twoDaysLater.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: "DEVELOPMENT",
    categoryColor: "bg-pink-500",
    assignees: [dummyUsers[3], dummyUsers[4]],
  },
  {
    id: "task-4",
    title: "Fix bugs in the CSS code",
    description:
      "Fix small bugs that are essential to prepare for the next release that will happen this quarter.",
    status: "Done",
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: "DEVELOPMENT",
    categoryColor: "bg-pink-500",
    assignees: [dummyUsers[5], dummyUsers[6]],
  },
  {
    id: "task-5",
    title: "Proofread final text",
    description:
      "The text provided by marketing department needs to be proofread so that we make sure that it fits into our design.",
    status: "Done",
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: "TYPOGRAPHY",
    categoryColor: "bg-blue-500",
    assignees: [dummyUsers[1]],
  },
  {
    id: "task-6",
    title: "Responsive design",
    description:
      "All designs need to be responsive. The requirement is that it fits all web and mobile screens.",
    status: "Done",
    dueDate: twoDaysAgo.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: "DESIGN SYSTEM",
    categoryColor: "bg-green-500",
    assignees: [dummyUsers[3], dummyUsers[6]],
  },
];

function getInitials(name: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function KanbanBoard() {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, isLoading, isError, message } = useSelector(
    (state: RootState) => state.task
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const [columns, setColumns] = useState<Column[]>([
    { id: "column-1", title: "To do", status: "To Do", tasks: [] },
    { id: "column-2", title: "In progress", status: "In Progress", tasks: [] },
    { id: "column-3", title: "Done", status: "Done", tasks: [] },
  ]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  // Fetch tasks when the component mounts and user is logged in
  useEffect(() => {
    if (user && user.token) {
      dispatch(getTasks());
    }
  }, [user, dispatch]);

  useEffect(() => {
    // Hydrate Redux user from localStorage if available
    const user =
      typeof window !== "undefined" && localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;
    if (user) {
      dispatch({ type: "auth/login/fulfilled", payload: user });
    }
  }, [dispatch]);
  useEffect(() => {
    const fetchUsers = async () => {
      if (user && user.token) {
        try {
          const allUsers = await getAllUsers(user.token);
          setUsers(allUsers);
        } catch (err) {
          console.error("Failed to fetch users", err);
        }
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (user && user.token && tasks) {
      console.log("Redux tasks:", tasks);
      setAllTasks(tasks);
    } else if (!user) {
      setAllTasks(initialTasks);
    }
  }, [user, tasks]);

  useEffect(() => {
    const filteredTasks = filterTasks(allTasks, searchQuery, statusFilter);

    const updatedColumns = columns.map((column) => {
      const columnTasks = filteredTasks.filter(
        (task) => task.status === column.status
      );
      return {
        ...column,
        tasks: sortTasksByUpdated(columnTasks),
      };
    });

    setColumns(updatedColumns);
  }, [allTasks, searchQuery, statusFilter]);

  const filterTasks = (
    tasks: Task[],
    query: string,
    statusFilter: string
  ): Task[] => {
    return tasks.filter((task) => {
      if (statusFilter !== "All" && task.status !== statusFilter) {
        return false;
      }
      if (query) {
        const searchLower = query.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          (task.description &&
            task.description.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  };



  const sortTasksByUpdated = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA; // Most recently updated first
  });
};


  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );
    if (!sourceColumn || !destColumn) return;
    const task = allTasks.find((t) => t.id === draggableId);
    if (!task) return;
    const updatedTask = {
      ...task,
      status: destColumn.status,
      updatedAt: new Date().toISOString(),
    };
    const validation = validateTask(updatedTask, allTasks);
    if (!validation.valid) {
      toast({
        title: "Cannot move task",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    const updatedAllTasks = allTasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    setAllTasks(updatedAllTasks);
    saveTasksToJson(updatedAllTasks);
    toast({
      title: "Task moved",
      description: `"${task.title}" moved to ${destColumn.title}`,
    });
  };

  const handleCreateTask = () => {
    setCurrentTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      if (user && user.token) {
        await dispatch(deleteTask(taskToDelete.id)).unwrap();
      } else {
        const updatedTasks = allTasks.filter(
          (task) => task.id !== taskToDelete.id
        );
        setAllTasks(updatedTasks);
      }

      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been deleted`,
      });
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error || "Failed to delete task",
        variant: "destructive",
      });
    }

    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleSaveTask = async (task: Task): Promise<boolean> => {
    const now = new Date().toISOString();
    let updatedTask: Task;
    // let updatedTasks: Task[]
    if (task.id) {
      updatedTask = { ...task, updatedAt: now };
      // updatedTasks = allTasks.map((t) => (t.id === task.id ? updatedTask : t))
    } else {
      updatedTask = {
        ...task,
        id: `task-${generateId()}`,
        createdAt: now,
        updatedAt: now,
      };
      // updatedTasks = [...allTasks, updatedTask]
    }
    const validation = validateTask(
      updatedTask,
      allTasks.filter((t) => t.id !== updatedTask.id)
    );
    if (!validation.valid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      });
      return false;
    }

    try {
      // If user is logged in, save to DB via Redux
      if (user && user.token) {
        console.log("Saving task to DB:", task);
        if (task.id) {
          const result = await dispatch(
            updateTask({
              id: task.id,
              taskData: updatedTask,
              token: user.token,
            })
          ).unwrap();
          console.log("Update result:", result);
        } else {
          const result = await dispatch(createTask(updatedTask)).unwrap();
          console.log("Create result:", result);
        }
      } else {
        // If not logged in, use local state only
        const updatedTasks = task.id
          ? allTasks.map((t) => (t.id === task.id ? updatedTask : t))
          : [...allTasks, updatedTask];

        setAllTasks(updatedTasks);
      }

      toast({
        title: task.id ? "Task updated" : "Task created",
        description: `"${task.title}" has been ${
          task.id ? "updated" : "created"
        }`,
      });

      return true;
    } catch (error: any) {
      console.error("Save task error:", error);
      toast({
        title: "Error",
        description: error || `Failed to ${task.id ? "update" : "create"} task`,
        variant: "destructive",
      });

      return false;
    }
  };
  const saveTasksToJson = (tasks: Task[]) => {
    console.log("Saving tasks to JSON:", tasks);
  };

  const initials = user?.name ? getInitials(user.name) : "U";

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(reset());

    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar onCreateTask={handleCreateTask} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b p-4 bg-background">
          <div className="flex justify-between items-center">
            {isMobile && (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <Sidebar onCreateTask={handleCreateTask} />
                </SheetContent>
              </Sheet>
            )}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10 bg-muted/50 border-none w-full"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {isMobile && (
                <Button variant="outline" size="sm" onClick={handleCreateTask}>
                  <Plus className="h-4 w-4 mr-1" /> New
                </Button>
              )}
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <div className="relative ">
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="focus:outline-none"
                >
                  <Avatar>
                    <AvatarImage
                      src={user?.avatar || "/avatars/avatar-1.png"}
                      alt="User"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
                
                 <ProfileModal isOpen={showUserMenu} onClose={() => setShowUserMenu(false)} user={user} />
              </div>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Board</h1>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="overflow-auto content-scrollable">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-w-[768px]">
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onAddTask={() => {
                      setCurrentTask({
                        id: "",
                        title: "",
                        description: "",
                        status: column.status,
                        dueDate: null,
                        createdAt: "",
                        updatedAt: "",
                        category: "",
                        categoryColor: "bg-gray-500",
                        assignees: [],
                      });
                      setIsTaskModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={currentTask}
        onSave={handleSaveTask}
        users={user && user.token ? users : dummyUsers}
        currentUser={user}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTask}
        taskTitle={taskToDelete?.title || ""}
      />
    </div>
  );
}
