"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Grid3x3,
  List,
  Calendar,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  name: string;
  deadline: Date | null;
  category: string;
  priority: "low" | "medium" | "high";
  subtasks: string;
  notes: string;
  attachment: File | null;
  completed: boolean;
  createdAt: Date;
}

interface TodoManagerProps {
  initialTasks?: Task[];
}

const priorityColors = {
  low: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  medium:
    "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  high: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

const priorityIcons = {
  low: "border-blue-500 bg-blue-50 dark:bg-blue-950",
  medium: "border-amber-500 bg-amber-50 dark:bg-amber-950",
  high: "border-red-500 bg-red-50 dark:bg-red-950",
};

export default function TodoManager({ initialTasks = [] }: TodoManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    deadline: null as Date | null,
    category: "",
    newCategory: "",
    priority: "medium" as const,
    subtasks: "",
    notes: "",
    attachment: null as File | null,
  });

  const categories = useMemo(() => {
    const unique = new Set(tasks.map((t) => t.category).filter(Boolean));
    return Array.from(unique);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || task.category === filterCategory;
      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;

      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [tasks, searchTerm, filterCategory, filterPriority]);

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        name: task.name,
        deadline: task.deadline,
        category: task.category,
        newCategory: "",
        priority: task.priority,
        subtasks: task.subtasks,
        notes: task.notes,
        attachment: task.attachment,
      });
    } else {
      setEditingTask(null);
      setFormData({
        name: "",
        deadline: null,
        category: "",
        newCategory: "",
        priority: "medium",
        subtasks: "",
        notes: "",
        attachment: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Task name is required",
        variant: "destructive",
      });
      return;
    }

    const category = formData.newCategory || formData.category || "General";

    if (editingTask) {
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                name: formData.name,
                deadline: formData.deadline,
                category,
                priority: formData.priority,
                subtasks: formData.subtasks,
                notes: formData.notes,
                attachment: formData.attachment,
              }
            : t
        )
      );
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        name: formData.name,
        deadline: formData.deadline,
        category,
        priority: formData.priority,
        subtasks: formData.subtasks,
        notes: formData.notes,
        attachment: formData.attachment,
        completed: false,
        createdAt: new Date(),
      };
      setTasks([...tasks, newTask]);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card
        className={cn(
          "p-4 border-l-4 transition-all duration-200 hover:shadow-md",
          task.priority === "high" && "border-l-red-500",
          task.priority === "medium" && "border-l-amber-500",
          task.priority === "low" && "border-l-blue-500",
          task.completed && "opacity-60 bg-muted"
        )}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => handleToggleComplete(task.id)}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3
                className={cn(
                  "font-medium text-foreground truncate",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.name}
              </h3>
              <div
                className={cn(
                  "inline-block px-2 py-0.5 rounded text-xs font-medium border",
                  priorityColors[task.priority]
                )}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </div>
            </div>

            {task.category && (
              <p className="text-xs text-muted-foreground mb-2">
                📁 {task.category}
              </p>
            )}

            {task.deadline && (
              <p className="text-xs text-muted-foreground mb-2">
                📅 {task.deadline.toLocaleDateString()}
              </p>
            )}

            {task.notes && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {task.notes}
              </p>
            )}

            {task.subtasks && (
              <p className="text-xs text-muted-foreground mb-2">
                ✓ {task.subtasks.split("\n").length} subtasks
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenModal(task)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTask(task.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <Button
            onClick={() => handleOpenModal()}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* View Toggle and Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={showCalendar ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCalendar(!showCalendar)}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Calendar View */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 bg-card"
          >
            <div className="space-y-4">
              {/* Date Navigation */}
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevDay}
                  className="gap-2 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToday}
                  className="gap-2 bg-transparent"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextDay}
                  className="gap-2 bg-transparent"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="font-medium text-sm">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Calendar Component */}
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks Display */}
      <div>
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              {searchTerm ||
              filterCategory !== "all" ||
              filterPriority !== "all"
                ? "No tasks match your filters"
                : "No tasks yet. Create one to get started!"}
            </p>
          </motion.div>
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            )}
          >
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add/Edit Task Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Update your task details below"
                : "Add a new task with all the details you need"}
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Task Name */}
            <div className="space-y-2">
              <Label htmlFor="task-name">Task Name *</Label>
              <Input
                id="task-name"
                placeholder="Enter task name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={
                  formData.deadline
                    ? formData.deadline.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deadline: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="space-y-2">
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select or create category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Or create new category..."
                  value={formData.newCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, newCategory: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    priority: value as "low" | "medium" | "high",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">🔵 Low</span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">🟡 Medium</span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">🔴 High</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subtasks */}
            <div className="space-y-2">
              <Label htmlFor="subtasks">Subtasks</Label>
              <Textarea
                id="subtasks"
                placeholder="Enter subtasks, one per line"
                value={formData.subtasks}
                onChange={(e) =>
                  setFormData({ ...formData, subtasks: e.target.value })
                }
                className="min-h-20"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="min-h-20"
              />
            </div>

            {/* File Attachment */}
            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment</Label>
              <div className="border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">
                      {formData.attachment?.name || "Click to upload a file"}
                    </span>
                  </div>
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attachment: e.target.files?.[0] || null,
                    })
                  }
                  className="hidden"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveTask}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
