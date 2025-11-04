import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  UtensilsCrossed,
  CreditCard,
  Heart,
  Book,
  Package,
  Star,
} from "lucide-react";

const STORAGE_KEY = "dh-onboarding";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [goal, setGoal] = useState<string | null>(null);
  const [diets, setDiets] = useState<string[]>([]);
  const [financeCategories, setFinanceCategories] = useState<string[]>(() => [
    "Food",
    "Transport",
  ]);
  const [financeFilter, setFinanceFilter] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === "object") {
        const p = parsed as Record<string, unknown>;
        if (typeof p.name === "string") setName(p.name);
        if (p.theme === "light" || p.theme === "dark")
          setTheme(p.theme as "light" | "dark");
        if (typeof p.goal === "string") setGoal(p.goal as string);
        if (Array.isArray(p.diets))
          setDiets(
            (p.diets as unknown[]).filter(
              (x): x is string => typeof x === "string"
            )
          );
        if (Array.isArray(p.financeCategories))
          setFinanceCategories(
            (p.financeCategories as unknown[]).filter(
              (x): x is string => typeof x === "string"
            )
          );
        if (Array.isArray((p as Record<string, unknown>).selectedFeatures)) {
          const sf = (p as Record<string, unknown>)
            .selectedFeatures as unknown[];
          setSelectedFeatures(
            sf.filter((x): x is string => typeof x === "string")
          );
        }
        if (typeof p.notifications === "boolean")
          setNotifications(p.notifications);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme === "dark" ? "dark" : "light");
  }, [theme]);

  function saveProgress(final = false) {
    const payload = {
      name: name.trim(),
      theme,
      notifications,
      goal,
      diets,
      financeCategories,
      selectedFeatures,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }

    if (final && notifications && "Notification" in window) {
      void Notification.requestPermission();
    }
  }

  const slides = useMemo(
    () => [
      {
        key: "welcome",
        title: "Welcome to DailyHelper",
        content: (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Tell us your name to personalize the app.
            </p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anna"
              aria-label="Your name"
              autoFocus
              className="input-field w-full text-lg py-3"
            />
          </div>
        ),
      },
      {
        key: "goal",
        title: "What do you want to focus on?",
        content: (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Pick one primary focus to tailor suggestions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setGoal("productive")}
                className={cn(
                  "p-6 rounded-lg border border-border/10 bg-background/40 flex flex-col items-start gap-3 transform transition-transform hover:scale-105",
                  goal === "productive" ? "ring-2 ring-accent" : ""
                )}
              >
                <CheckSquare className="w-6 h-6" />
                <div className="font-medium text-lg">Be productive</div>
                <div className="text-sm text-muted-foreground">
                  Tasks & focus tools
                </div>
              </button>

              <button
                onClick={() => setGoal("health")}
                className={cn(
                  "p-6 rounded-lg border border-border/10 bg-background/40 flex flex-col items-start gap-3 transform transition-transform hover:scale-105",
                  goal === "health" ? "ring-2 ring-accent" : ""
                )}
              >
                <UtensilsCrossed className="w-6 h-6" />
                <div className="font-medium text-lg">Eat healthier</div>
                <div className="text-sm text-muted-foreground">
                  Meals & nutrition
                </div>
              </button>

              <button
                onClick={() => setGoal("finance")}
                className={cn(
                  "p-6 rounded-lg border border-border/10 bg-background/40 flex flex-col items-start gap-3 transform transition-transform hover:scale-105",
                  goal === "finance" ? "ring-2 ring-accent" : ""
                )}
              >
                <CreditCard className="w-6 h-6" />
                <div className="font-medium text-lg">Save money</div>
                <div className="text-sm text-muted-foreground">
                  Spending & budgeting
                </div>
              </button>

              <button
                onClick={() => setGoal("wellness")}
                className={cn(
                  "p-6 rounded-lg border border-border/10 bg-background/40 flex flex-col items-start gap-3 transform transition-transform hover:scale-105",
                  goal === "wellness" ? "ring-2 ring-accent" : ""
                )}
              >
                <Heart className="w-6 h-6" />
                <div className="font-medium text-lg">Feel better</div>
                <div className="text-sm text-muted-foreground">
                  Sleep & habits
                </div>
              </button>
            </div>
          </div>
        ),
      },
      {
        key: "diet",
        title: "Diet preferences",
        content: (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Select any that apply (or choose No restrictions).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["vegetarian", "Vegetarian"],
                ["vegan", "Vegan"],
                ["keto", "Keto"],
                ["gluten_free", "Gluten-free"],
                ["no_restrictions", "No restrictions"],
              ].map(([value, label]) => {
                const selected = diets.includes(value as string);
                return (
                  <button
                    key={value as string}
                    onClick={() => {
                      const v = value as string;
                      if (v === "no_restrictions") {
                        setDiets(() => (selected ? [] : [v]));
                      } else {
                        setDiets((prev) => {
                          const base = prev.filter(
                            (d) => d !== "no_restrictions"
                          );
                          if (base.includes(v))
                            return base.filter((d) => d !== v);
                          return [...base, v];
                        });
                      }
                    }}
                    aria-pressed={selected}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border border-border/10 bg-background/40 transform transition-transform hover:scale-102",
                      selected ? "ring-2 ring-accent" : ""
                    )}
                  >
                    <div className="font-medium">{label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ),
      },
      {
        key: "finance",
        title: "Finance categories",
        content: (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Choose the expense categories you track most (search to filter).
            </p>
            <div className="mb-3">
              <Input
                value={financeFilter}
                onChange={(e) => setFinanceFilter(e.target.value)}
                placeholder="Search categories"
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Income",
                "Housing",
                "Food",
                "Transport",
                "Entertainment",
                "Health",
                "Savings",
                "Other",
              ]
                .filter((c) =>
                  c.toLowerCase().includes(financeFilter.trim().toLowerCase())
                )
                .map((cat) => {
                  const selected = financeCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        setFinanceCategories((prev) =>
                          prev.includes(cat)
                            ? prev.filter((p) => p !== cat)
                            : [...prev, cat]
                        )
                      }
                      className={cn(
                        "w-full text-left p-4 rounded-lg border border-border/10 bg-background/40 transform transition-transform hover:scale-105",
                        selected ? "ring-2 ring-accent" : ""
                      )}
                      aria-pressed={selected}
                    >
                      <div className="font-medium">{cat}</div>
                    </button>
                  );
                })}
            </div>
          </div>
        ),
      },
      {
        key: "features",
        title: "Pick up to 3",
        content: (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Choose up to three features you'd like to see first.
            </p>
            <div className="mb-3 text-sm text-muted-foreground">
              {selectedFeatures.length} / 3 selected
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                [
                  "todo",
                  "To-Do",
                  <CheckSquare className="w-6 h-6" />,
                  "Tasks & lists",
                ],
                [
                  "meals",
                  "Meals",
                  <UtensilsCrossed className="w-6 h-6" />,
                  "Track meals",
                ],
                [
                  "finance",
                  "Finance",
                  <CreditCard className="w-6 h-6" />,
                  "Spending & budgets",
                ],
                [
                  "wellness",
                  "Wellness",
                  <Heart className="w-6 h-6" />,
                  "Sleep & habits",
                ],
                [
                  "recipes",
                  "Recipes",
                  <Book className="w-6 h-6" />,
                  "Find & save recipes",
                ],
                [
                  "inventory",
                  "Inventory",
                  <Package className="w-6 h-6" />,
                  "Track items",
                ],
                [
                  "wishlist",
                  "Wishlist",
                  <Star className="w-6 h-6" />,
                  "Save items you want",
                ],
              ].map(([id, label, Icon, desc]) => {
                const sel = selectedFeatures.includes(id as string);
                const disabled = !sel && selectedFeatures.length >= 3;
                return (
                  <button
                    key={id as string}
                    onClick={() => {
                      const fid = id as string;
                      setSelectedFeatures((prev) => {
                        if (prev.includes(fid))
                          return prev.filter((p) => p !== fid);
                        if (prev.length >= 3) return prev;
                        return [...prev, fid];
                      });
                    }}
                    disabled={disabled}
                    aria-pressed={sel}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border border-border/10 bg-background/40 flex items-start gap-3 transform transition-transform",
                      sel ? "ring-2 ring-accent scale-105" : "hover:scale-102",
                      disabled ? "opacity-60 cursor-not-allowed" : ""
                    )}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-linear-to-br from-primary to-secondary text-white">
                      {Icon}
                    </div>
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className="text-sm text-muted-foreground">
                        {desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ),
      },
      {
        key: "notifications",
        title: "Enable notifications",
        content: (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Allow reminders and helpful nudges.
            </p>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm">Enable browser notifications</span>
            </label>
          </div>
        ),
      },
    ],
    [
      name,
      notifications,
      goal,
      diets,
      financeCategories,
      financeFilter,
      selectedFeatures,
    ]
  );

  function next() {
    if (step < slides.length - 1) {
      setStep((s) => s + 1);
      saveProgress(false);
    } else {
      saveProgress(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      setTimeout(() => navigate("/"), 1500);
    }
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function skip() {
    saveProgress(true);
    navigate("/");
  }

  return (
    <div className="min-h-screen w-full bg-background text-on-background">
      <div className="flex flex-col min-h-screen">
        <header className="w-full py-6 px-6 border-b border-border/10 bg-background/50">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{slides[step].title}</h2>
            <button
              className="text-sm text-muted-foreground hover:underline"
              onClick={skip}
            >
              Skip
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="max-w-[1400px] mx-auto h-full w-full grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
            {/* Left sidebar: vertical step list */}
            <aside className="md:col-span-1 sticky top-6 self-start">
              <nav className="space-y-3">
                {slides.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setStep(i)}
                    className={cn(
                      "flex items-center gap-3 w-full text-left p-3 rounded-md",
                      i === step
                        ? "bg-accent/10 ring-1 ring-accent"
                        : "hover:bg-border/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full text-sm",
                        i === step
                          ? "bg-accent text-white"
                          : "bg-border/10 text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium">{s.title}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <section className="md:col-span-3 overflow-auto p-4">
              <div className="w-full">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={slides[step].key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="space-y-6">{slides[step].content}</div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: slides.length }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setStep(i)}
                        aria-label={`Step ${i + 1}`}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          i === step ? "bg-accent" : "bg-border/40"
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={back}
                      disabled={step === 0}
                    >
                      Back
                    </Button>
                    {(() => {
                      const key = slides[step]?.key;
                      const isDisabled =
                        (key === "welcome" && name.trim() === "") ||
                        (key === "goal" && !goal);
                      return (
                        <Button onClick={next} disabled={isDisabled}>
                          {step === slides.length - 1 ? "Finish" : "Next"}
                        </Button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-50">
            {Array.from({ length: 60 }).map((_, i) => {
              const left = Math.random() * 100;
              const delay = Math.random() * 0.6;
              const bg = [
                "#ef4444",
                "#f59e0b",
                "#10b981",
                "#3b82f6",
                "#8b5cf6",
              ];
              const color = bg[i % bg.length];
              return (
                <motion.span
                  key={i}
                  initial={{ y: -50, opacity: 0, rotate: Math.random() * 360 }}
                  animate={{ y: 700, opacity: 1 }}
                  transition={{ delay, duration: 1.6, ease: "easeOut" }}
                  style={{ left: `${left}%`, background: color }}
                  className="absolute w-2 h-4 rounded-sm"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
