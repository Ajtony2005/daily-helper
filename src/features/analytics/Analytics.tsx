import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ArrowUp, ArrowDown } from "lucide-react";

const weeklyData = [
  { day: "Mon", spending: 45, calories: 2200, tasks: 5 },
  { day: "Tue", spending: 38, calories: 2100, tasks: 6 },
  { day: "Wed", spending: 62, calories: 2500, tasks: 7 },
  { day: "Thu", spending: 54, calories: 2300, tasks: 4 },
  { day: "Fri", spending: 72, calories: 2700, tasks: 8 },
  { day: "Sat", spending: 88, calories: 3200, tasks: 3 },
  { day: "Sun", spending: 30, calories: 1900, tasks: 2 },
];

const categoryData = [
  { name: "Food", value: 420 },
  { name: "Transport", value: 120 },
  { name: "Shopping", value: 260 },
  { name: "Health", value: 80 },
  { name: "Utilities", value: 150 },
];

const thisMonth = {
  spending: 1240,
  caloriesAvg: 2450,
  tasksCompleted: 112,
};

const lastMonth = {
  spending: 980,
  caloriesAvg: 2330,
  tasksCompleted: 98,
};

function delta(current: number, previous: number) {
  const diff = current - previous;
  const pct = previous ? Math.round((diff / previous) * 100) : 0;
  return { diff, pct, up: diff >= 0 };
}

export default function Analytics() {
  const spendingDelta = delta(thisMonth.spending, lastMonth.spending);
  const caloriesDelta = delta(thisMonth.caloriesAvg, lastMonth.caloriesAvg);
  const tasksDelta = delta(thisMonth.tasksCompleted, lastMonth.tasksCompleted);

  const chartConfig = {
    spending: { label: "Spending", color: "#60a5fa" },
    calories: { label: "Calories", color: "#34d399" },
    tasks: { label: "Tasks", color: "#f97316" },
    categories: {
      label: "Categories",
      theme: {
        light: "#60a5fa",
        dark: "#60a5fa",
      },
    },
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Weekly trends and category breakdown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Export</Button>
          <Button>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent>
            <CardTitle>Spending (weekly)</CardTitle>
            <CardDescription className="mb-4">
              Line chart with smooth animation and tooltips
            </CardDescription>
            <ChartContainer
              id="spending"
              config={chartConfig}
              className="h-44 !aspect-auto"
            >
              <div style={{ height: "100%" }}>
                <LineChart
                  data={weeklyData}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ReTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="spending"
                    stroke="var(--color-spending)"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    animationDuration={800}
                  />
                </LineChart>
              </div>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent>
            <CardTitle>Calories (weekly)</CardTitle>
            <CardDescription className="mb-4">
              Average daily calories
            </CardDescription>
            <ChartContainer
              id="calories"
              config={chartConfig}
              className="h-44 !aspect-auto"
            >
              <div style={{ height: "100%" }}>
                <LineChart
                  data={weeklyData}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ReTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="var(--color-calories)"
                    strokeWidth={3}
                    dot={false}
                    animationDuration={900}
                  />
                </LineChart>
              </div>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent>
            <CardTitle>Tasks Completed (weekly)</CardTitle>
            <CardDescription className="mb-4">
              Completed tasks per day
            </CardDescription>
            <ChartContainer
              id="tasks"
              config={chartConfig}
              className="h-44 !aspect-auto"
            >
              <div style={{ height: "100%" }}>
                <LineChart
                  data={weeklyData}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ReTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="var(--color-tasks)"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    animationDuration={700}
                  />
                </LineChart>
              </div>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardContent>
              <CardTitle>Category breakdown</CardTitle>
              <CardDescription className="mb-4">
                Spending by category
              </CardDescription>
              <ChartContainer
                id="categories"
                config={chartConfig}
                className="h-80 !aspect-auto"
              >
                <div style={{ height: "100%" }}>
                  <BarChart
                    data={categoryData}
                    margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ReTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="value"
                      fill="var(--color-categories)"
                      animationDuration={1000}
                    />
                    <Legend content={ChartLegendContent as any} />
                  </BarChart>
                </div>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-card">
            <CardContent>
              <CardTitle>This month vs last month</CardTitle>
              <CardDescription className="mb-4">
                Quick comparison of key metrics
              </CardDescription>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Spending
                    </div>
                    <div className="text-lg font-semibold">
                      ${thisMonth.spending.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {spendingDelta.up ? (
                      <ArrowUp className="text-green-400" />
                    ) : (
                      <ArrowDown className="text-rose-400" />
                    )}
                    <div
                      className={`text-sm ${spendingDelta.up ? "text-green-400" : "text-rose-400"}`}
                    >
                      {spendingDelta.pct}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Calories (avg)
                    </div>
                    <div className="text-lg font-semibold">
                      {thisMonth.caloriesAvg.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {caloriesDelta.up ? (
                      <ArrowUp className="text-green-400" />
                    ) : (
                      <ArrowDown className="text-rose-400" />
                    )}
                    <div
                      className={`text-sm ${caloriesDelta.up ? "text-green-400" : "text-rose-400"}`}
                    >
                      {caloriesDelta.pct}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Tasks completed
                    </div>
                    <div className="text-lg font-semibold">
                      {thisMonth.tasksCompleted}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {tasksDelta.up ? (
                      <ArrowUp className="text-green-400" />
                    ) : (
                      <ArrowDown className="text-rose-400" />
                    )}
                    <div
                      className={`text-sm ${tasksDelta.up ? "text-green-400" : "text-rose-400"}`}
                    >
                      {tasksDelta.pct}%
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <Button>View detailed report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
