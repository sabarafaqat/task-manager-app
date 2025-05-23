// "use client";

// import { useState, useEffect } from "react";
// import { Calendar } from "lucide-react";
// import { Button } from "./ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { formatDate } from "@/lib/utils";
// import type { Task, User } from "@/types/kanban";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { AlertTriangle } from "lucide-react";

// interface TaskModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   task: Task | null;
//   onSave: (task: Task) => Promise<boolean>;
//   users: User[];
//   currentUser?: User | null;
// }

// // Category options with colors
// const categoryOptions = [
//   { name: "DESIGN SYSTEM", color: "bg-green-500" },
//   { name: "TYPOGRAPHY", color: "bg-blue-500" },
//   { name: "DEVELOPMENT", color: "bg-pink-500" },
//   { name: "RESEARCH", color: "bg-purple-500" },
//   { name: "UX", color: "bg-yellow-500" },
// ];
// const userColors = [
//   "bg-red-500",
//   "bg-blue-500",
//   "bg-green-500",
//   "bg-yellow-500",
//   "bg-pink-500",
//   "bg-purple-500",
//   "bg-teal-500",
//   "bg-orange-500",
//   "bg-indigo-500",
//   "bg-cyan-500",
// ];
// export default function TaskModal({
//   isOpen,
//   currentUser,
//   onClose,
//   task,
//   onSave,
//   users,
// }: TaskModalProps) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState<"To Do" | "In Progress" | "Done">(
//     "To Do"
//   );
//   const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
//   const [category, setCategory] = useState("");
//   const [categoryColor, setCategoryColor] = useState("bg-gray-500");
//   const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
//   const [titleError, setTitleError] = useState("");
//   const [descriptionError, setDescriptionError] = useState("");
//   const [isOverdue, setIsOverdue] = useState(false);

//   // Reset form when task changes
//   useEffect(() => {
//     if (task) {
//       setTitle(task.title);
//       setDescription(task.description || "");
//       setStatus(task.status);
//       setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
//       setCategory(task.category || "");
//       setCategoryColor(task.categoryColor || "bg-gray-500");
//       setSelectedUsers(task.assignees || []);

//       // Check if task is overdue
//       if (task.dueDate) {
//         const dueDate = new Date(task.dueDate);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         dueDate.setHours(0, 0, 0, 0);
//         setIsOverdue(dueDate < today && task.status !== "Done");
//       } else {
//         setIsOverdue(false);
//       }
//     } else {
//       setTitle("");
//       setDescription("");
//       setStatus("To Do");
//       setDueDate(undefined);
//       setCategory("");
//       setCategoryColor("bg-gray-500");
//       setSelectedUsers([]);
//       setIsOverdue(false);
//     }

//     // Clear errors
//     setTitleError("");
//     setDescriptionError("");
//   }, [task, isOpen]);

//   const validateForm = (): boolean => {
//     let isValid = true;

//     // Validate title
//     if (!title.trim()) {
//       setTitleError("Title is required");
//       isValid = false;
//     } else if (title.length > 100) {
//       setTitleError(`Title is too long (${title.length}/100)`);
//       isValid = false;
//     } else {
//       setTitleError("");
//     }

//     // Validate description
//     if (description.length > 500) {
//       setDescriptionError(
//         `Description is too long (${description.length}/500)`
//       );
//       isValid = false;
//     } else {
//       setDescriptionError("");
//     }

//     return isValid;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     const updatedTask: Task = {
//       id: task?.id || "",
//       title,
//       description,
//       status,
//       dueDate: dueDate ? dueDate.toISOString() : null,
//       createdAt: task?.createdAt || new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       category,
//       categoryColor,
//       assignees: selectedUsers,
//     };

//     const success = await onSave(updatedTask);
//     if (success) {
//       onClose();
//     }
//   };

//   const handleCategoryChange = (selectedCategory: string) => {
//     setCategory(selectedCategory);
//     const categoryOption = categoryOptions.find(
//       (cat) => cat.name === selectedCategory
//     );
//     if (categoryOption) {
//       setCategoryColor(categoryOption.color);
//     }
//   };

//   const toggleUserSelection = (user: User) => {
//     if (selectedUsers.some((u) => u.id === user.id)) {
//       setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
//     } else {
//       setSelectedUsers([...selectedUsers, user]);
//     }
//   };

//   // Check if due date is overdue
//   const checkOverdue = (date: Date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     date.setHours(0, 0, 0, 0);
//     setIsOverdue(date < today && status !== "Done");
//   };

//   const handleDueDateChange = (date: Date | undefined) => {
//     setDueDate(date);
//     if (date) {
//       checkOverdue(date);
//     } else {
//       setIsOverdue(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>{task?.id ? "Edit Task" : "Create Task"}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 py-4 task-modal-content">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">
//               Title <span className="text-destructive">*</span>
//             </label>
//             <Input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter task title"
//               maxLength={100}
//             />
//             {titleError && (
//               <p className="text-xs text-destructive">{titleError}</p>
//             )}
//             <p className="text-xs text-muted-foreground">
//               {title.length}/100 characters
//             </p>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Description</label>
//             <Textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter task description"
//               rows={4}
//               maxLength={500}
//             />
//             {descriptionError && (
//               <p className="text-xs text-destructive">{descriptionError}</p>
//             )}
//             <p className="text-xs text-muted-foreground">
//               {description.length}/500 characters
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Status</label>
//               <Select
//                 value={status}
//                 onValueChange={(value) =>
//                   setStatus(value as "To Do" | "In Progress" | "Done")
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="To Do">To Do</SelectItem>
//                   <SelectItem value="In Progress">In Progress</SelectItem>
//                   <SelectItem value="Done">Done</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Category</label>
//               <Select value={category} onValueChange={handleCategoryChange}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categoryOptions.map((cat) => (
//                     <SelectItem key={cat.name} value={cat.name}>
//                       <div className="flex items-center">
//                         <div
//                           className={`h-2 w-2 rounded-full ${cat.color} mr-2`}
//                         ></div>
//                         {cat.name}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <label className="text-sm font-medium">Due Date (Optional)</label>
//               {isOverdue && (
//                 <Badge
//                   variant="destructive"
//                   className="flex items-center gap-1"
//                 >
//                   <AlertTriangle className="h-3 w-3" /> Overdue
//                 </Badge>
//               )}
//             </div>
// <Popover>
//   <PopoverTrigger asChild>
//     <Button
//       variant="outline"
//       className="w-full justify-start text-left font-normal"
//     >
//       <Calendar className="mr-2 h-4 w-4" />
//       {dueDate ? (
//         formatDate(dueDate.toISOString())
//       ) : (
//         <span>Pick a date</span>
//       )}
//     </Button>
//   </PopoverTrigger>
//   <PopoverContent className="w-auto p-0" align="start">
//     <CalendarComponent
//       mode="single"
//       selected={dueDate}
//       onSelect={handleDueDateChange}
//       initialFocus
//       disabled={(date) => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         date.setHours(0, 0, 0, 0);
//         return date < today;
//       }}
//     />
//   </PopoverContent>
// </Popover>
//             {dueDate && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setDueDate(undefined)}
//                 className="text-xs text-destructive hover:text-destructive/90"
//               >
//                 Clear date
//               </Button>
//             )}
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Assign To</label>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto border rounded-md p-2">
//               {users.map((user, idx) => {
//                 const isCurrent = currentUser && user.id === currentUser.id;
//                 // Use user.color if present, otherwise pick from palette
//                 const avatarColor =
//                   user.color || userColors[idx % userColors.length];
//                 return (
//                   <div key={user.id} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={`user-${user.id}`}
//                       checked={selectedUsers.some((u) => u.id === user.id)}
//                       onCheckedChange={() => toggleUserSelection(user)}
//                     />
//                     <Label
//                       htmlFor={`user-${user.id}`}
//                       className="flex items-center gap-2 cursor-pointer"
//                     >
//                       <Avatar
//                         className={`h-6 w-6 ${
//                           isCurrent ? "ring-2 ring-blue-500" : ""
//                         }`}
//                       >
//                         <AvatarImage src={user.avatar} alt={user.name} />
//                         <AvatarFallback
//                           className={`${avatarColor} text-white text-xs`}
//                         >
//                           {user.initials}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span
//                         className={`text-sm ${
//                           isCurrent ? "text-blue-600 font-bold" : ""
//                         }`}
//                       >
//                         {user.name}
//                         {isCurrent && " (You)"}
//                       </span>
//                     </Label>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {selectedUsers.length > 0 && (
//             <div className="flex flex-wrap gap-1 mt-2">
//               {selectedUsers.map((user) => (
//                 <div
//                   key={user.id}
//                   className="flex items-center gap-1 bg-muted rounded-full px-2 py-1"
//                 >
//                   <Avatar className="h-4 w-4">
//                     <AvatarImage
//                       src={user.avatar || "/placeholder.svg"}
//                       alt={user.name}
//                     />
//                     <AvatarFallback
//                       className={`${user.color} text-white text-[10px]`}
//                     >
//                       {user.initials}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-xs">{user.name}</span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-4 w-4 p-0 rounded-full hover:bg-muted-foreground/20"
//                     onClick={() => toggleUserSelection(user)}
//                   >
//                     ×
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit}>
//             {task?.id ? "Update" : "Create"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Calendar, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { formatDate } from "@/lib/utils";
import type { Task, User } from "@/types/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Task) => Promise<boolean>;
  users: User[];
  currentUser?: User | null;
}

const categoryOptions = [
  { name: "DESIGN SYSTEM", color: "bg-green-500" },
  { name: "TYPOGRAPHY", color: "bg-blue-500" },
  { name: "DEVELOPMENT", color: "bg-pink-500" },
  { name: "RESEARCH", color: "bg-purple-500" },
  { name: "UX", color: "bg-yellow-500" },
];

export default function TaskModal({
  isOpen,
  currentUser,
  onClose,
  task,
  onSave,
  users,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"To Do" | "In Progress" | "Done">("To Do");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("bg-gray-500");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setCategory(task.category || "");
      setCategoryColor(task.categoryColor || "bg-gray-500");
      setSelectedUsers(task.assignees || []);

      if (task.dueDate) {
        const due = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);
        setIsOverdue(due < today && task.status !== "Done");
      } else {
        setIsOverdue(false);
      }
    } else {
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setDueDate(undefined);
      setCategory("");
      setCategoryColor("bg-gray-500");
      setSelectedUsers([]);
      setIsOverdue(false);
    }

    setTitleError("");
    setDescriptionError("");
  }, [task, isOpen]);

  const validateForm = () => {
    let isValid = true;
    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (title.length > 100) {
      setTitleError(`Title is too long (${title.length}/100)`);
      isValid = false;
    } else {
      setTitleError("");
    }

    if (description.length > 500) {
      setDescriptionError(`Description is too long (${description.length}/500)`);
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const updatedTask: Task = {
      id: task?.id || "",
      title,
      description,
      status,
      dueDate: dueDate ? dueDate.toISOString() : null,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category,
      categoryColor,
      assignees: selectedUsers,
    };

    const success = await onSave(updatedTask);
    if (success) onClose();
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const cat = categoryOptions.find((c) => c.name === value);
    if (cat) setCategoryColor(cat.color);
  };

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const checkOverdue = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    setIsOverdue(date < today && status !== "Done");
  };

  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date);
    if (date) checkOverdue(date);
    else setIsOverdue(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task?.id ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              maxLength={100}
            />
            {titleError && <p className="text-xs text-red-500">{titleError}</p>}
            <p className="text-xs text-muted-foreground">{title.length}/100</p>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details"
              rows={4}
              maxLength={500}
            />
            {descriptionError && <p className="text-xs text-red-500">{descriptionError}</p>}
            <p className="text-xs text-muted-foreground">{description.length}/500</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as Task["status"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${cat.color} mr-2`} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Due Date (optional)</Label>
              {isOverdue && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Overdue
                </Badge>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <Calendar className="h-4 w-4 mr-2" />
                  {dueDate ? formatDate(dueDate.toISOString()) : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={handleDueDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Assignees</Label>
            <div className="grid grid-cols-2 gap-2">
              {users.map((user) => (
                <Label key={user.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedUsers.some((u) => u.id === user.id)}
                    onCheckedChange={() => toggleUserSelection(user)}
                  />
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar || ""} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </Label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{task ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
