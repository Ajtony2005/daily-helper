import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Minimal, dependency-light journal / notes feature
// Saves entries to localStorage under key 'dh-journal-entries'

type Entry = {
  id: string;
  date: string; // ISO day yyyy-mm-dd
  content: string;
  mood: number; // 0-4
  tags: string[];
  createdAt: string;
};

const STORAGE_KEY = "dh-journal-entries";
const MOODS = ["😞", "😕", "😐", "🙂", "😄"];

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch (e) {
    console.error("Failed to parse journal entries", e);
    return [];
  }
}

function saveEntries(entries: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function todayKey(date?: Date) {
  const d = date ?? new Date();
  return d.toISOString().slice(0, 10);
}

function uid() {
  return String(Date.now()) + Math.random().toString(36).slice(2, 8);
}

function monthDays(year: number, month: number) {
  // month 0-indexed
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0 Sun .. 6 Sat
  const days: (Date | null)[] = [];
  // prepend empty slots (use Monday-start? keep Sun-start to match JS getDay)
  for (let i = 0; i < startDay; i++) days.push(null);
  const last = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= last; d++) days.push(new Date(year, month, d));
  return days;
}

export default function Journal() {
  const [entries, setEntries] = useState<Entry[]>(() => loadEntries());

  const [selectedDate, setSelectedDate] = useState<string>(() => todayKey());
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<number>(2);
  const [tagsInput, setTagsInput] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"editor" | "list">("editor");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const listener = () => setEntries(loadEntries());
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  useEffect(() => {
    // load active entry for selectedDate
    const e = entries.find((x) => x.date === selectedDate);
    if (e) {
      setContent(e.content);
      setMood(e.mood);
      setTagsInput(e.tags.join(", "));
    } else {
      setContent("");
      setMood(2);
      setTagsInput("");
    }
  }, [selectedDate, entries]);

  const markedDates = useMemo(
    () => new Set(entries.map((e) => e.date)),
    [entries]
  );

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 700);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setEntries((prev) => {
      const existingIndex = prev.findIndex((p) => p.date === selectedDate);
      const now = new Date().toISOString();
      let next: Entry[];
      if (existingIndex >= 0) {
        next = [...prev];
        next[existingIndex] = { ...next[existingIndex], content, mood, tags };
      } else {
        const entry: Entry = {
          id: uid(),
          date: selectedDate,
          content,
          mood,
          tags,
          createdAt: now,
        };
        next = [entry, ...prev];
      }
      saveEntries(next);
      return next;
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveEntries(next);
  }

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return entries;
    return entries.filter(
      (e) =>
        e.content.toLowerCase().includes(s) ||
        e.tags.join(" ").toLowerCase().includes(s)
    );
  }, [search, entries]);

  // calendar month state
  const now = new Date(selectedDate);
  const [calYear, calMonth] = [now.getFullYear(), now.getMonth()];
  const calDays = useMemo(
    () => monthDays(calYear, calMonth),
    [calYear, calMonth]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Journal</h1>
          <p className="text-sm text-muted-foreground">
            Write daily notes, tag them and track mood.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setView((v) => (v === "editor" ? "list" : "editor"));
            }}
          >
            {view === "editor" ? "Show list" : "Write"}
          </Button>
          <Button
            onClick={() => {
              setSelectedDate(todayKey());
              setView("editor");
            }}
          >
            New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{selectedDate}</CardTitle>
                  <CardDescription>
                    Journal entry for the selected day
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">Mood</div>
                  <div className="flex gap-2">
                    {MOODS.map((m, i) => (
                      <button
                        key={i}
                        className={`text-2xl p-1 rounded-md ${mood === i ? "ring-2 ring-accent/40" : ""}`}
                        onClick={() => setMood(i)}
                        aria-label={`Mood ${i}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-sm text-muted-foreground">
                    Tags (comma separated)
                  </div>
                  <Input
                    className="w-full"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. gratitude, health"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setContent("");
                      setTagsInput("");
                      setMood(2);
                    }}
                  >
                    Clear
                  </Button>
                  <motion.div
                    animate={{ scale: saving ? 0.98 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Textarea
                    className="w-full h-56 font-mono resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Notes (markdown supported)\n- Point one"
                  />
                </div>
                <div className="glass-card p-4 h-56 overflow-auto">
                  <div className="text-sm text-muted-foreground mb-2">
                    Preview
                  </div>
                  <div className="prose max-w-none dark:prose-invert">
                    <ReactMarkdown>
                      {content || "_(Nothing yet)_ "}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {view === "list" && (
            <Card className="glass-card mt-6">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle>All entries</CardTitle>
                    <CardDescription className="text-sm">
                      Search and browse your notes
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-48"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        setSearch("");
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {filtered.map((e) => (
                    <div
                      key={e.id}
                      className="p-3 rounded-md border border-border/10 bg-background/40 flex items-start gap-3"
                    >
                      <div className="w-12 text-center text-2xl">
                        {MOODS[e.mood]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{e.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(e.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-sm mt-2 line-clamp-3 prose max-w-none">
                          <ReactMarkdown>{e.content}</ReactMarkdown>
                        </div>
                        <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                          {e.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-1 rounded-full bg-border/20"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDate(e.date);
                              setView("editor");
                            }}
                          >
                            Open
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(e.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filtered.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      No entries match your search.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <aside>
          <Card className="glass-card">
            <CardContent>
              <CardTitle>Calendar</CardTitle>
              <CardDescription className="mb-4">
                Days with entries are highlighted
              </CardDescription>

              <div className="mb-3 text-center font-medium">
                {new Date(selectedDate).toLocaleString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-xs text-muted-foreground">
                    {d}
                  </div>
                ))}

                {calDays.map((d, idx) => {
                  if (!d) return <div key={idx} className="h-8" />;
                  const key = d.toISOString().slice(0, 10);
                  const isMarked = markedDates.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDate(key)}
                      className={`h-10 rounded-md ${isMarked ? "bg-accent/20" : "hover:bg-background/20"} ${key === selectedDate ? "ring-2 ring-accent/40" : ""}`}
                    >
                      <div className="text-sm">{d.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mt-4">
            <CardContent>
              <CardTitle>Quick stats</CardTitle>
              <div className="mt-2 text-sm text-muted-foreground">
                Total entries: {entries.length}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Tags:{" "}
                {Array.from(new Set(entries.flatMap((e) => e.tags))).join(
                  ", "
                ) || "-"}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
