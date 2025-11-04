import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Plus,
  Coffee,
  CreditCard,
  Droplet,
  Activity,
  CloudSun,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Small helper progress circle (SVG)
function WaterProgress({ glasses = 4 }: { glasses?: number }) {
  const total = 8;
  const radius = 28;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(Math.max(glasses / total, 0), 1);
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="block mx-auto">
      <circle
        stroke="rgba(148,163,184,0.16)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="url(#waterGradient)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      <defs>
        <linearGradient id="waterGradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="6"
        className="text-xs font-medium fill-foreground"
      >
        {glasses}/{total}
      </text>
    </svg>
  );
}

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard() {
  const [taskChecked, setTaskChecked] = useState(false);
  const [water, setWater] = useState(3);
  const [steps, setSteps] = useState<number | null>(5123);

  return (
    <div className="p-6">
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeIn}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Today's Task */}
          <motion.div variants={fadeIn}>
            <Card className="glass-card">
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-accent" />
                      <span>Today's Task</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          id="task-check"
                          checked={taskChecked}
                          onCheckedChange={(checked) => setTaskChecked(checked as boolean)}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            taskChecked && "line-through text-muted-foreground"
                          )}
                        >
                          Finish the monthly report
                        </span>
                      </label>
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">1 pending</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Last Meal */}
          <motion.div variants={fadeIn}>
            <Card className="glass-card">
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="w-5 h-5 text-accent" />
                      <span>Last Meal</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Grilled chicken salad • 420 kcal
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">2h ago</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Spending */}
          <motion.div variants={fadeIn}>
            <Card className="glass-card">
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-accent" />
                      <span>Today's Spending</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      $12.75 • Coffee
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Water Intake */}
          <motion.div variants={fadeIn}>
            <Card className="glass-card text-center">
              <CardContent>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Droplet className="w-5 h-5 text-accent" />
                  <span>Water Intake</span>
                </CardTitle>
                <div className="mt-4">
                  <WaterProgress glasses={water} />
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setWater((w) => Math.max(0, w - 1))}
                    >
                      -
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setWater((w) => Math.min(8, w + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Steps */}
          <motion.div variants={fadeIn}>
            <Card className="glass-card text-center">
              <CardContent>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  <span>Steps</span>
                </CardTitle>
                <div className="mt-4 text-2xl font-semibold">
                  {steps ? (
                    steps.toLocaleString()
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing...
                    </span>
                  )}
                </div>
                <CardDescription className="mt-2">Goal: 10,000</CardDescription>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setSteps(Math.floor(Math.random() * 8000) + 1000)
                    }
                  >
                    Sync
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weather */}
          <motion.div variants={fadeIn}>
            <Card className="glass-card">
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CloudSun className="w-5 h-5 text-accent" />
                      <span>Weather</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      22°C • Mostly Sunny
                    </CardDescription>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Suggestion: Light jacket
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">22°</div>
                    <div className="text-sm text-muted-foreground">Sunny</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivational Quote */}
          <motion.div variants={fadeIn}>
            <Card className="glass-card">
              <CardContent>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span>Motivation</span>
                </CardTitle>
                <CardDescription className="mt-2 italic">
                  “Small steps every day lead to big changes.”
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* FABs */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-50">
        <Button
          asChild
          size="icon"
          className="bg-primary text-primary-foreground shadow-lg"
        >
          <a href="#" aria-label="Add task">
            <Plus className="w-4 h-4" />
          </a>
        </Button>
        <Button asChild size="icon" variant="secondary" className="shadow-lg">
          <a href="#" aria-label="Add meal">
            <Coffee className="w-4 h-4" />
          </a>
        </Button>
        <Button asChild size="icon" variant="ghost" className="shadow-lg">
          <a href="#" aria-label="Add expense">
            <CreditCard className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
