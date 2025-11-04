import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Bell, Plus, Edit2, Trash2 } from "lucide-react";

type Reminder = {
  id: string;
  label: string;
  time: string; // "HH:MM"
  enabled: boolean;
};

const STORAGE_KEY = "dh-notifications";

function loadReminders(): { enabled: boolean; reminders: Reminder[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { enabled: true, reminders: [] };
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load notifications", e);
    return { enabled: true, reminders: [] };
  }
}

function saveReminders(payload: { enabled: boolean; reminders: Reminder[] }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    try {
      // notify other parts of the app in the same tab
      window.dispatchEvent(new Event("dh-notifications-updated"));
    } catch {
      /* noop */
    }
  } catch (e) {
    console.error("Failed to save notifications", e);
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function Notifications() {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [timeInput, setTimeInput] = useState("08:00");
  const [modalEnabled, setModalEnabled] = useState(true);

  useEffect(() => {
    const stored = loadReminders();
    if (stored.reminders.length === 0) {
      // Default reminders
      const defaults: Reminder[] = [
        { id: uid(), label: "Water", time: "10:00", enabled: true },
        { id: uid(), label: "Vitamins", time: "08:00", enabled: true },
      ];
      setEnabled(stored.enabled);
      setReminders(defaults);
      saveReminders({ enabled: stored.enabled, reminders: defaults });
    } else {
      setEnabled(stored.enabled);
      setReminders(stored.reminders);
    }
  }, []);

  useEffect(() => {
    saveReminders({ enabled, reminders });
  }, [enabled, reminders]);

  function openNew() {
    setEditing(null);
    setLabelInput("");
    setTimeInput("08:00");
    setModalEnabled(true);
    setShowModal(true);
  }

  function openEdit(r: Reminder) {
    setEditing(r);
    setLabelInput(r.label);
    setTimeInput(r.time);
    setModalEnabled(r.enabled);
    setShowModal(true);
  }

  function saveFromModal() {
    const label = labelInput.trim() || "Reminder";
    const time = timeInput;
    if (editing) {
      setReminders((s) =>
        s.map((r) =>
          r.id === editing.id ? { ...r, label, time, enabled: modalEnabled } : r
        )
      );
    } else {
      const r: Reminder = { id: uid(), label, time, enabled: modalEnabled };
      setReminders((s) => [...s, r]);
    }
    setShowModal(false);
  }

  function remove(id: string) {
    if (!confirm("Delete reminder?")) return;
    setReminders((s) => s.filter((r) => r.id !== id));
  }

  function toggleReminder(id: string) {
    setReminders((s) =>
      s.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }

  const upcoming = useMemo(
    () => reminders.slice().sort((a, b) => a.time.localeCompare(b.time)),
    [reminders]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Control browser notifications and reminders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: enabled ? [0, 10, -6, 0] : 0 }}
            transition={{ duration: 1.2 }}
          >
            <Bell
              className={cn(
                "w-7 h-7",
                enabled ? "text-accent" : "text-muted-foreground"
              )}
            />
          </motion.div>
          <Button variant="ghost" onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Reminder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>Browser Notifications</CardTitle>
                  <CardDescription className="text-sm">
                    Allow the app to send you reminders
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={enabled}
                      onCheckedChange={(checked) => setEnabled(checked as boolean)}
                    />
                    <span className="text-sm">Enabled</span>
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Upcoming reminders
                  </div>
                </div>

                {upcoming.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-md border border-border/10 bg-background/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={r.enabled}
                        onCheckedChange={() => toggleReminder(r.id)}
                      />
                      <div>
                        <div className="font-medium">{r.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {r.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(r)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => remove(r.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {upcoming.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No reminders set.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mt-6">
            <CardContent>
              <CardTitle>Test notification</CardTitle>
              <CardDescription className="text-sm">
                Send a test browser notification (if allowed)
              </CardDescription>
              <div className="mt-3">
                <Button
                  onClick={() => {
                    if (!("Notification" in window)) {
                      alert("Browser notifications are not supported");
                      return;
                    }
                    Notification.requestPermission().then((perm) => {
                      if (perm === "granted")
                        new Notification("DailyHelper", {
                          body: "This is a test notification.",
                        });
                      else alert("Permission denied");
                    });
                  }}
                >
                  Send test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card className="glass-card">
            <CardContent>
              <CardTitle>Summary</CardTitle>
              <CardDescription className="text-sm">
                Quick overview
              </CardDescription>
              <div className="mt-3 text-sm text-muted-foreground">
                Reminders: {reminders.length}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Enabled: {enabled ? "Yes" : "No"}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Modal - simple inline modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md"
          >
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">
                  {editing ? "Edit reminder" : "New reminder"}
                </h3>
                <div className="mb-2 text-sm text-muted-foreground">Label</div>
                <Input
                  className="w-full mb-3"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                />
                <div className="mb-2 text-sm text-muted-foreground">Time</div>
                <Input
                  type="time"
                  className="w-full mb-3"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                />
                <Label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <Checkbox
                    checked={modalEnabled}
                    onCheckedChange={(checked) => setModalEnabled(checked as boolean)}
                  />
                  Enabled
                </Label>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveFromModal}>
                    {editing ? "Save" : "Add"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
