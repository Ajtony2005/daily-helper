// Example: How to use Jotai in your components

import { useTasks, useTaskCategories } from "@/store/hooks";

export function TaskExample() {
const [tasks, setTasks] = useTasks();
const [categories] = useTaskCategories();

const addTask = () => {
const newTask = {
id: Date.now().toString(),
title: "New Task",
completed: false,
category: categories[0] || "Personal",
priority: "medium" as const,
};
setTasks([...tasks, newTask]);
};

const toggleTask = (id: string) => {
setTasks(
tasks.map((task) =>
task.id === id ? { ...task, completed: !task.completed } : task
)
);
};

const deleteTask = (id: string) => {
setTasks(tasks.filter((task) => task.id !== id));
};

return (
<div>
<button onClick={addTask}>Add Task</button>
<ul>
{tasks.map((task) => (
<li key={task.id}>
<input
type="checkbox"
checked={task.completed}
onChange={() => toggleTask(task.id)}
/>
<span>{task.title}</span>
<button onClick={() => deleteTask(task.id)}>Delete</button>
</li>
))}
</ul>
</div>
);
}

// With Firebase integration:
import { useEffect } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { Task } from "@/store/atoms";

export function TaskWithFirebase() {
const [localTasks, setLocalTasks] = useTasks();
const { documents: firestoreTasks, addDocument, updateDocument, deleteDocument } =
useFirestore<Task>("tasks");

// Sync Firestore -> Local state
useEffect(() => {
if (firestoreTasks.length > 0) {
setLocalTasks(firestoreTasks);
}
}, [firestoreTasks, setLocalTasks]);

const addTask = async (title: string) => {
const newTask = {
title,
completed: false,
category: "Personal",
priority: "medium" as const,
};
await addDocument(newTask);
};

const toggleTask = async (id: string) => {
const task = localTasks.find((t) => t.id === id);
if (task) {
await updateDocument(id, { completed: !task.completed });
}
};

const removeTask = async (id: string) => {
await deleteDocument(id);
};

return (
<div>
{/_ Your UI here _/}
</div>
);
}
