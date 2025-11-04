import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Award, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Simple circular progress for goals
function CircularProgress({
  value,
  size = 64,
}: {
  value: number;
  size?: number;
}) {
  const radius = (size - 8) / 2;
  const stroke = 6;
  const normalizedRadius = radius;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * circumference;
  return (
    <svg height={size} width={size}>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <circle
        stroke="rgba(148,163,184,0.12)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="url(#g1)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={size / 2}
        cy={size / 2}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-xs font-semibold fill-foreground"
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}

function CalendarHeatmap({ days }: { days: Record<string, boolean> }) {
  // Render last 30 days in 5 rows of 7-ish columns (approx)
  const last30 = useMemo(() => {
    const arr: { d: string; done: boolean }[] = [];
    for (let i = 29; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      arr.push({ d: key, done: !!days[key] });
    }
    return arr;
  }, [days]);

  return (
    <div className="grid grid-cols-7 gap-1">
      {last30.map((x) => (
        <div
          key={x.d}
          title={x.d}
          className={cn(
            "w-6 h-6 rounded-sm",
            x.done ? "bg-accent" : "bg-border/40 dark:bg-border/20"
          )}
        />
      ))}
    </div>
  );
}

export default function GoalsHabits() {
  const [activeTab, setActiveTab] = useState<"habits" | "goals">("habits");
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const [habits, setHabits] = useState(
    () =>
      [
        {
          id: "h1",
          name: "Meditate",
          streak: 5,
          completedDays: {} as Record<string, boolean>,
        },
        {
          id: "h2",
          name: "Read",
          streak: 12,
          completedDays: {} as Record<string, boolean>,
        },
      ] as {
        id: string;
        name: string;
        streak: number;
        completedDays: Record<string, boolean>;
      }[]
  );

  const [goals, setGoals] = useState(
    () =>
      [
        { id: "g1", title: "Run 50km", progress: 32, target: 50 },
        { id: "g2", title: "Read 10 books", progress: 6, target: 10 },
      ] as { id: string; title: string; progress: number; target: number }[]
  );

  function addHabit(name: string) {
    setHabits((s) => [
      ...s,
      { id: `h${Date.now()}`, name, streak: 0, completedDays: {} },
    ]);
  }

  function addGoal(title: string, target: number) {
    setGoals((s) => [
      ...s,
      { id: `g${Date.now()}`, title, progress: 0, target },
    ]);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Goals & Habits</h2>
          <p className="text-sm text-muted-foreground">
            Track daily habits and longer-term goals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === "habits" ? "default" : "outline"}
            onClick={() => setActiveTab("habits")}
          >
            <Calendar className="w-4 h-4" /> Habits
          </Button>
          <Button
            size="sm"
            variant={activeTab === "goals" ? "default" : "outline"}
            onClick={() => setActiveTab("goals")}
          >
            <Award className="w-4 h-4" /> Goals
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          key="left"
          initial={{ x: activeTab === "habits" ? 0 : -20, opacity: 1 }}
          animate={{ x: 0, opacity: activeTab === "habits" ? 1 : 0.9 }}
          transition={{ duration: 0.35 }}
          className="md:col-span-2"
        >
          {activeTab === "habits" ? (
            <div className="space-y-4">
              {habits.map((h) => (
                <Card key={h.id} className="glass-card">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-accent" />
                          <CardTitle>{h.name}</CardTitle>
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-linear-to-r from-amber-100 to-amber-200 text-amber-700 dark:from-amber-700 dark:to-amber-600 dark:text-amber-100">
                            🔥 {h.streak}
                          </span>
                        </div>
                        <CardDescription className="mt-2">
                          Daily checkbox & recent heatmap
                        </CardDescription>
                        <div className="mt-3">
                          <CalendarHeatmap days={h.completedDays} />
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          Today
                        </div>
                        <Checkbox className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="pt-2">
                <Button onClick={() => setShowHabitModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Habit
                </Button>
              </div>
            </div>
          ) : (
            // Goals tab content
            <div className="space-y-4">
              {goals.map((g) => {
                const pct = Math.round((g.progress / g.target) * 100);
                return (
                  <Card key={g.id} className="glass-card">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{g.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {g.progress}/{g.target} completed
                          </CardDescription>
                          <div className="mt-3 w-full bg-border/40 h-2 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-2 bg-accent"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <CircularProgress value={pct} />
                          <div className="text-sm text-muted-foreground">
                            {pct}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="pt-2">
                <Button onClick={() => setShowGoalModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        <motion.aside
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          <Card className="glass-card">
            <CardContent>
              <CardTitle>Streak leaderboard</CardTitle>
              <CardDescription className="mt-2">
                Top streaks this week
              </CardDescription>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-accent/10 to-accent/5">
                      1
                    </span>
                    <span className="font-medium">You</span>
                  </div>
                  <div className="text-sm text-muted-foreground">12d</div>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-accent/10 to-accent/5">
                      2
                    </span>
                    <span className="font-medium">Alex</span>
                  </div>
                  <div className="text-sm text-muted-foreground">9d</div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent>
              <CardTitle>Quick tips</CardTitle>
              <CardDescription className="mt-2">
                Small habits compound. Try doing 10 minutes today.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.aside>
      </div>

      {/* Modals (very small inline modal implementations) */}
      {showHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setShowHabitModal(false)}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md"
          >
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">New Habit</h3>
                <Input
                  placeholder="Habit name"
                  className="w-full mb-3"
                  id="newHabitName"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowHabitModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const el = document.getElementById(
                        "newHabitName"
                      ) as HTMLInputElement | null;
                      if (el?.value) addHabit(el.value);
                      setShowHabitModal(false);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setShowGoalModal(false)}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md"
          >
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">New Goal</h3>
                <Input
                  placeholder="Goal title"
                  className="w-full mb-2"
                  id="newGoalTitle"
                />
                <Input
                  placeholder="Target (number)"
                  type="number"
                  className="w-full mb-3"
                  id="newGoalTarget"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowGoalModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const tEl = document.getElementById(
                        "newGoalTitle"
                      ) as HTMLInputElement | null;
                      const nEl = document.getElementById(
                        "newGoalTarget"
                      ) as HTMLInputElement | null;
                      const t = tEl?.value;
                      const n = Number(nEl?.value || 0);
                      if (t && n > 0) addGoal(t, n);
                      setShowGoalModal(false);
                    }}
                  >
                    Add
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
