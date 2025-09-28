import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Save, Edit2, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, addDays, parseISO } from "date-fns";
import Loading from "@/pages/Loading";

const initialCategories = ["University", "Association", "Personal", "Other"];

const priorities = [
  { value: "low", label: "Low", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-red-500" },
];

type SubTask = {
  id: string;
  name: string;
  completed: boolean;
};

type Task = {
  id: string;
  name: string;
  deadline?: string;
  category: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  subtasks: SubTask[];
  notes: string;
  attachment?: File | null;
};

const ToDo = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState({
    name: "",
    deadline: "",
    category: categories[0],
    newCategory: "",
    priority: "medium" as "low" | "medium" | "high",
    subtasks: "" as string,
    notes: "",
    attachment: null as File | null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const buttonControls = useAnimation();

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { name: string; value: any }
  ) => {
    if ("target" in e) {
      setForm({ ...form, [e.target.name]: e.target.value });
    } else {
      setForm({ ...form, [e.name]: e.value });
    }
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, attachment: e.target.files[0] });
    }
  };

  const handleAddTask = async () => {
    if (!form.name.trim()) {
      setError("Task name is required.");
      return;
    }
    let taskCategory = form.category;
    if (form.newCategory.trim() && form.category === "Add New") {
      if (categories.includes(form.newCategory.trim())) {
        setError("Category already exists.");
        return;
      }
      taskCategory = form.newCategory.trim();
      setCategories([...categories, taskCategory]);
    }
    const subtaskList = form.subtasks
      .split("\n")
      .filter((st) => st.trim())
      .map((st) => ({
        id: Date.now().toString() + Math.random(),
        name: st.trim(),
        completed: false,
      }));
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    const newTask: Task = {
      id: Date.now().toString(),
      name: form.name.trim(),
      deadline: form.deadline,
      category: taskCategory,
      completed: false,
      priority: form.priority,
      subtasks: subtaskList,
      notes: form.notes.trim(),
      attachment: form.attachment,
    };
    setTasks([...tasks, newTask]);
    setForm({
      name: "",
      deadline: "",
      category: categories[0],
      newCategory: "",
      priority: "medium",
      subtasks: "",
      notes: "",
      attachment: null,
    });
    setShowAddTask(false);
    setError("");
    setIsLoading(false);
  };

  const handleEditTask = async () => {
    if (!editTask || !form.name.trim()) {
      setError("Task name is required.");
      return;
    }
    let taskCategory = form.category;
    if (form.newCategory.trim() && form.category === "Add New") {
      if (categories.includes(form.newCategory.trim())) {
        setError("Category already exists.");
        return;
      }
      taskCategory = form.newCategory.trim();
      setCategories([...categories, taskCategory]);
    }
    const subtaskList = form.subtasks
      .split("\n")
      .filter((st) => st.trim())
      .map((st) => ({
        id: Date.now().toString() + Math.random(),
        name: st.trim(),
        completed: false,
      }));
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    const updatedTask = {
      ...editTask,
      name: form.name.trim(),
      deadline: form.deadline,
      category: taskCategory,
      priority: form.priority,
      subtasks: subtaskList,
      notes: form.notes.trim(),
      attachment: form.attachment,
    };
    setTasks(
      tasks.map((task) => (task.id === editTask.id ? updatedTask : task))
    );
    setForm({
      name: "",
      deadline: "",
      category: categories[0],
      newCategory: "",
      priority: "medium",
      subtasks: "",
      notes: "",
      attachment: null,
    });
    setEditTask(null);
    setShowEditTask(false);
    setError("");
    setIsLoading(false);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditTask(task);
    setForm({
      name: task.name,
      deadline: task.deadline || "",
      category: task.category,
      newCategory: "",
      priority: task.priority,
      subtasks: task.subtasks.map((st) => st.name).join("\n"),
      notes: task.notes,
      attachment: null,
    });
    setShowEditTask(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleToggleCompleted = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : task
      )
    );
  };

  const getFilteredTasks = () => {
    const search = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        (selectedCategory === "All" ||
          selectedCategory === "All Tasks" ||
          task.category === selectedCategory) &&
        (task.name.toLowerCase().includes(search) ||
          task.notes.toLowerCase().includes(search))
    );
  };

  const getTasksForDate = (date: Date) => {
    return getFilteredTasks().filter(
      (task) => task.deadline === format(date, "yyyy-MM-dd")
    );
  };

  const getTaskStatus = (task: Task) => {
    if (task.completed) return "green";
    if (task.deadline) {
      const deadlineDate = parseISO(task.deadline);
      if (isBefore(deadlineDate, new Date())) return "red";
      if (isBefore(deadlineDate, addDays(new Date(), 3))) return "yellow";
    }
    return "gray";
  };

  const handleSortTasks = (sortBy: "priority" | "deadline") => {
    const sorted = [...getFilteredTasks()].sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "deadline") {
        return (
          (a.deadline ? new Date(a.deadline).getTime() : Infinity) -
          (b.deadline ? new Date(b.deadline).getTime() : Infinity)
        );
      }
      return 0;
    });
    setTasks(sorted);
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)",
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      boxShadow: "none",
      transition: { duration: 0.2 },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardContent className="p-10 relative z-10">
            <CardTitle className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              To-Do List
            </CardTitle>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-6"
            >
              <Button
                type="button"
                disabled={isLoading}
                onClick={() => setShowAddTask(true)}
                className={`w-full bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  <Plus className="w-5 h-5" />
                  Add Task
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
            </motion.div>
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 placeholder-gray-400/50 fade-in"
              />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48 glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="dropdown fade-in-down">
                  <SelectItem value="All" className="dropdown-item">
                    All
                  </SelectItem>
                  <SelectItem value="All Tasks" className="dropdown-item">
                    All Tasks
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="dropdown-item">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={viewMode}
                onValueChange={(value: "list" | "calendar") =>
                  setViewMode(value)
                }
              >
                <SelectTrigger className="w-48 glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in">
                  <SelectValue placeholder="View mode" />
                </SelectTrigger>
                <SelectContent className="dropdown fade-in-down">
                  <SelectItem value="list" className="dropdown-item">
                    List View
                  </SelectItem>
                  <SelectItem value="calendar" className="dropdown-item">
                    Calendar View
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 mb-6">
              <Button
                onClick={() => handleSortTasks("priority")}
                className="bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  Sort by Priority
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
              <Button
                onClick={() => handleSortTasks("deadline")}
                className="bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  Sort by Deadline
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
              <Button
                onClick={() => setSelectedCategory("All Tasks")}
                className="bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  All Tasks
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
            </div>
            {viewMode === "list" ? (
              <div className="space-y-8">
                {getFilteredTasks().map((task) => {
                  const statusColor = {
                    green: "bg-green-500/10 border-green-400 text-green-400",
                    yellow:
                      "bg-yellow-500/10 border-yellow-400 text-yellow-400",
                    red: "bg-red-500/10 border-red-400 text-red-400",
                    gray: "bg-gray-500/10 border-gray-400 text-gray-400",
                  }[getTaskStatus(task)];
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`glass p-4 rounded-xl border border-blue-600/40 shadow-inner ${statusColor}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() =>
                              handleToggleCompleted(task.id)
                            }
                            className="text-green-500"
                          />
                          <div className="font-bold text-lg text-white">
                            {task.name}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={() => handleOpenEditTask(task)}
                            className="bg-blue-600 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                              <Edit2 className="w-4 h-4" />
                            </span>
                            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="bg-red-500 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                              <Trash2 className="w-4 h-4" />
                            </span>
                            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 mb-2">
                        Deadline: {task.deadline || "No deadline"}
                      </div>
                      <div className="text-sm text-gray-300 mb-2">
                        Category: {task.category}
                      </div>
                      <div className="text-sm text-gray-300 mb-2">
                        Priority: {task.priority}
                      </div>
                      <div className="text-sm text-gray-300 mb-2">
                        Notes: {task.notes || "No notes"}
                      </div>
                      {task.attachment && (
                        <div className="text-sm text-gray-300 mb-2">
                          Attachment: {task.attachment.name}
                        </div>
                      )}
                      <div className="mt-4">
                        <h4 className="text-md font-semibold text-blue-300 mb-2">
                          Subtasks
                        </h4>
                        <div className="space-y-2">
                          {task.subtasks.map((subtask) => (
                            <div
                              key={subtask.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                checked={subtask.completed}
                                onCheckedChange={() =>
                                  handleToggleSubtask(task.id, subtask.id)
                                }
                                className="text-green-500"
                              />
                              <span className="text-white">{subtask.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-center mb-8">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-3xl glass border-4 border-blue-600/60 p-16 text-3xl shadow-2xl w-full max-w-4xl fade-in"
                    style={{ fontSize: "2.5rem", minHeight: "600px" }}
                  />
                </div>
                <div className="space-y-6">
                  {getTasksForDate(selectedDate).map((task) => {
                    const statusColor = {
                      green: "bg-green-500/10 border-green-400 text-green-400",
                      yellow:
                        "bg-yellow-500/10 border-yellow-400 text-yellow-400",
                      red: "bg-red-500/10 border-red-400 text-red-400",
                      gray: "bg-gray-500/10 border-gray-400 text-gray-400",
                    }[getTaskStatus(task)];
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`glass p-8 rounded-2xl border-2 border-blue-600/40 shadow-inner text-lg ${statusColor} fade-in`}
                        style={{ fontSize: "1.125rem" }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() =>
                                handleToggleCompleted(task.id)
                              }
                              className="text-green-500 scale-125"
                            />
                            <div className="font-bold text-2xl text-white">
                              {task.name}
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <Button
                              type="button"
                              onClick={() => handleOpenEditTask(task)}
                              className="bg-blue-600 text-white p-2 rounded-2xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group text-xl"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                <Edit2 className="w-6 h-6" />
                              </span>
                              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleDeleteTask(task.id)}
                              className="bg-red-500 text-white p-2 rounded-2xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group text-xl"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                                <Trash2 className="w-6 h-6" />
                              </span>
                              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                            </Button>
                          </div>
                        </div>
                        <div className="text-lg text-gray-300 mb-2">
                          Deadline: {task.deadline || "No deadline"}
                        </div>
                        <div className="text-lg text-gray-300 mb-2">
                          Category: {task.category}
                        </div>
                        <div className="text-lg text-gray-300 mb-2">
                          Priority: {task.priority}
                        </div>
                        <div className="text-lg text-gray-300 mb-2">
                          Notes: {task.notes || "No notes"}
                        </div>
                        {task.attachment && (
                          <div className="text-lg text-gray-300 mb-2">
                            Attachment: {task.attachment.name}
                          </div>
                        )}
                        <div className="mt-6">
                          <h4 className="text-xl font-semibold text-blue-300 mb-4">
                            Subtasks
                          </h4>
                          <div className="space-y-4">
                            {task.subtasks.map((subtask) => (
                              <div
                                key={subtask.id}
                                className="flex items-center gap-4"
                              >
                                <Checkbox
                                  checked={subtask.completed}
                                  onCheckedChange={() =>
                                    handleToggleSubtask(task.id, subtask.id)
                                  }
                                  className="text-green-500 scale-125"
                                />
                                <span className="text-white text-lg">
                                  {subtask.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Task Modal */}
      {showAddTask && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowAddTask(false)}
        >
          <motion.div
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-[90vw] sm:max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Add Task
              </CardTitle>
              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTask();
                }}
                className="space-y-6"
              >
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="name"
                    animate={
                      form.name ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Task Name
                  </motion.label>
                  <motion.input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter task name"
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 placeholder-gray-400/50 fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="deadline"
                    animate={
                      form.deadline
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Deadline (Optional)
                  </motion.label>
                  <motion.input
                    id="deadline"
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="category"
                    animate={
                      form.category
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Category
                  </motion.label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm({ ...form, category: value, newCategory: "" })
                    }
                  >
                    <SelectTrigger className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="dropdown fade-in-down">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="dropdown-item"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="Add New" className="dropdown-item">
                        Add New
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.category === "Add New" && (
                    <motion.input
                      id="newCategory"
                      type="text"
                      name="newCategory"
                      value={form.newCategory}
                      onChange={handleChange}
                      placeholder="New category name"
                      className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 placeholder-gray-400/50 mt-2 fade-in"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  )}
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="priority"
                    animate={
                      form.priority
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Priority
                  </motion.label>
                  <Select
                    value={form.priority}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        priority: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <SelectTrigger className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="dropdown fade-in-down">
                      {priorities.map((p) => (
                        <SelectItem
                          key={p.value}
                          value={p.value}
                          className="dropdown-item"
                        >
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="subtasks"
                    animate={
                      form.subtasks
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Subtasks (one per line)
                  </motion.label>
                  <motion.textarea
                    id="subtasks"
                    name="subtasks"
                    value={form.subtasks}
                    onChange={handleChange}
                    placeholder="Enter subtasks, one per line"
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 placeholder-gray-400/50 min-h-[100px] fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="notes"
                    animate={
                      form.notes ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Notes
                  </motion.label>
                  <motion.textarea
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Enter notes"
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 placeholder-gray-400/50 min-h-[100px] fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="attachment"
                    animate={
                      form.attachment
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Attachment (Optional)
                  </motion.label>
                  <motion.input
                    id="attachment"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                {error && (
                  <motion.p
                    id="form-error"
                    aria-live="assertive"
                    className="text-red-400 mb-6 text-center font-medium drop-shadow animate-pulse"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {error}
                  </motion.p>
                )}
                <motion.div animate={buttonControls}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                        <Save className="w-5 h-5" />
                        Add Task
                      </span>
                    )}
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                  </Button>
                </motion.div>
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowAddTask(false)}
                  className={`w-full bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </Button>
              </motion.form>
            </CardContent>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Task Modal */}
      {showEditTask && editTask && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowEditTask(false)}
        >
          <motion.div
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-[90vw] sm:max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Edit Task
              </CardTitle>
              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditTask();
                }}
                className="space-y-6"
              >
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="name"
                    animate={
                      form.name ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Task Name
                  </motion.label>
                  <motion.input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter task name"
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 placeholder-gray-400/50 fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="deadline"
                    animate={
                      form.deadline
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Deadline (Optional)
                  </motion.label>
                  <motion.input
                    id="deadline"
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="category"
                    animate={
                      form.category
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Category
                  </motion.label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm({ ...form, category: value, newCategory: "" })
                    }
                  >
                    <SelectTrigger className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="dropdown fade-in-down">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="dropdown-item"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="Add New" className="dropdown-item">
                        Add New
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.category === "Add New" && (
                    <motion.input
                      id="newCategory"
                      type="text"
                      name="newCategory"
                      value={form.newCategory}
                      onChange={handleChange}
                      placeholder="New category name"
                      className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 placeholder-gray-400/50 mt-2 fade-in"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  )}
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="priority"
                    animate={
                      form.priority
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Priority
                  </motion.label>
                  <Select
                    value={form.priority}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        priority: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <SelectTrigger className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="dropdown fade-in-down">
                      {priorities.map((p) => (
                        <SelectItem
                          key={p.value}
                          value={p.value}
                          className="dropdown-item"
                        >
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="subtasks"
                    animate={
                      form.subtasks
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Subtasks (one per line)
                  </motion.label>
                  <motion.textarea
                    id="subtasks"
                    name="subtasks"
                    value={form.subtasks}
                    onChange={handleChange}
                    placeholder="Enter subtasks, one per line"
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 placeholder-gray-400/50 min-h-[100px] fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="notes"
                    animate={
                      form.notes ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Notes
                  </motion.label>
                  <motion.textarea
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Enter notes"
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 placeholder-gray-400/50 min-h-[100px] fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="attachment"
                    animate={
                      form.attachment
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Attachment (Optional)
                  </motion.label>
                  <motion.input
                    id="attachment"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full glass px-4 py-3 text-(--color-card-darkForeground) border-(--color-border) focus:outline-none transition-all duration-300 fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                {error && (
                  <motion.p
                    id="form-error"
                    aria-live="assertive"
                    className="text-red-400 mb-6 text-center font-medium drop-shadow animate-pulse"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {error}
                  </motion.p>
                )}
                <motion.div animate={buttonControls}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-linear-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                        <Save className="w-5 h-5" />
                        Save Task
                      </span>
                    )}
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                  </Button>
                </motion.div>
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowEditTask(false)}
                  className={`w-full bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </Button>
              </motion.form>
            </CardContent>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ToDo;
