"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  Sun,
  Wind,
  Droplet,
  Dumbbell,
  Pill,
  Flame,
  Zap,
  Plus,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

interface Vitamin {
  id: string;
  name: string;
  time: string;
  frequency: "daily" | "weekly" | "monthly";
  taken: boolean;
}

interface WaterIntake {
  id: string;
  timestamp: string;
  amount: number;
}

const WellnessTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseTime, setExerciseTime] = useState("");
  const [exerciseLocation, setExerciseLocation] = useState("");
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const [vitamins, setVitamins] = useState<Vitamin[]>([
    {
      id: "1",
      name: "Vitamin D",
      time: "09:00",
      frequency: "daily",
      taken: false,
    },
    {
      id: "2",
      name: "Vitamin C",
      time: "12:00",
      frequency: "daily",
      taken: false,
    },
    {
      id: "3",
      name: "Multivitamin",
      time: "08:00",
      frequency: "daily",
      taken: true,
    },
  ]);

  const [vitaminFilter, setVitaminFilter] = useState<
    "all" | "daily" | "weekly" | "monthly"
  >("all");
  const [waterIntakes, setWaterIntakes] = useState<WaterIntake[]>([
    { id: "1", timestamp: "08:00", amount: 250 },
    { id: "2", timestamp: "12:00", amount: 250 },
  ]);

  const [mood, setMood] = useState("happy");
  const [energy, setEnergy] = useState("good");

  const [vitaminName, setVitaminName] = useState("");
  const [vitaminTime, setVitaminTime] = useState("");
  const [vitaminFrequency, setVitaminFrequency] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  const [showVitaminModal, setShowVitaminModal] = useState(false);

  const previousDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
  };

  const nextDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const filteredVitamins = vitamins.filter(
    (vitamin) => vitaminFilter === "all" || vitamin.frequency === vitaminFilter
  );

  const toggleVitamin = (id: string) => {
    setVitamins(
      vitamins.map((v) => (v.id === id ? { ...v, taken: !v.taken } : v))
    );
  };

  const addVitamin = () => {
    if (vitaminName && vitaminTime) {
      const newVitamin: Vitamin = {
        id: Date.now().toString(),
        name: vitaminName,
        time: vitaminTime,
        frequency: vitaminFrequency,
        taken: false,
      };
      setVitamins([...vitamins, newVitamin]);
      setVitaminName("");
      setVitaminTime("");
      setVitaminFrequency("daily");
      setShowVitaminModal(false);
    }
  };

  const addWater = () => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setWaterIntakes([
      ...waterIntakes,
      { id: Date.now().toString(), timestamp: timeString, amount: 250 },
    ]);
  };

  const waterProgress = (waterIntakes.length * 250) / 2000; // 2L goal
  const vitaminProgress =
    (vitamins.filter((v) => v.taken).length / vitamins.length) * 100;

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Wellness Tracker
        </h1>
        <p className="text-muted-foreground">
          Monitor your health and wellness daily
        </p>
      </motion.div>

      {/* Date Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={previousDay}
          className="hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {formattedDate}
          </p>
          <p className="text-sm text-muted-foreground">
            {selectedDate.toDateString() === new Date().toDateString()
              ? "Today"
              : ""}
          </p>
        </div>

        <div className="flex gap-2">
          {selectedDate.toDateString() !== new Date().toDateString() && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
            >
              Today
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={nextDay}
            className="hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto"
      >
        {/* Weather Card */}
        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-400" />
                Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cloud className="h-12 w-12 text-sky-400" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">24°C</p>
                      <p className="text-sm text-muted-foreground">
                        Partly Cloudy
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplet className="h-4 w-4 text-blue-400" />
                      <p className="text-xs text-muted-foreground">Humidity</p>
                    </div>
                    <p className="font-semibold text-foreground">65%</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Wind className="h-4 w-4 text-cyan-400" />
                      <p className="text-xs text-muted-foreground">Wind</p>
                    </div>
                    <p className="font-semibold text-foreground">12 km/h</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <p className="text-xs text-muted-foreground">UV Index</p>
                    </div>
                    <p className="font-semibold text-foreground">6</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercise Card */}
        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-red-400" />
                Exercise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Checkbox
                    checked={exerciseCompleted}
                    onCheckedChange={(checked) =>
                      setExerciseCompleted(checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <label className="text-sm font-medium text-foreground cursor-pointer flex-1">
                    Exercise Completed
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor="exercise-type"
                      className="text-sm font-medium mb-2 block"
                    >
                      Type
                    </Label>
                    <Select
                      value={exerciseType}
                      onValueChange={setExerciseType}
                    >
                      <SelectTrigger
                        id="exercise-type"
                        className="bg-secondary/50"
                      >
                        <SelectValue placeholder="Select exercise type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="running">Running</SelectItem>
                        <SelectItem value="cycling">Cycling</SelectItem>
                        <SelectItem value="gym">Gym</SelectItem>
                        <SelectItem value="yoga">Yoga</SelectItem>
                        <SelectItem value="swimming">Swimming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="exercise-time"
                      className="text-sm font-medium mb-2 block"
                    >
                      Duration
                    </Label>
                    <Select
                      value={exerciseTime}
                      onValueChange={setExerciseTime}
                    >
                      <SelectTrigger
                        id="exercise-time"
                        className="bg-secondary/50"
                      >
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="exercise-location"
                      className="text-sm font-medium mb-2 block"
                    >
                      Location
                    </Label>
                    <Select
                      value={exerciseLocation}
                      onValueChange={setExerciseLocation}
                    >
                      <SelectTrigger
                        id="exercise-location"
                        className="bg-secondary/50"
                      >
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="gym">Gym</SelectItem>
                        <SelectItem value="park">Park</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Water Intake Card */}
        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-400" />
                  Water Intake
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={addWater}
                  className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-400"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">
                      Daily Goal
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((waterProgress * 2000) / 100)}ml / 2000ml
                    </p>
                  </div>
                  <Progress
                    value={Math.min(waterProgress * 100, 100)}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {waterIntakes.map((intake) => (
                    <motion.div
                      key={intake.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-blue-400" />
                        <p className="text-sm text-foreground">
                          {intake.timestamp}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {intake.amount}ml
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vitamins Card */}
        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-purple-400" />
                  Vitamins
                </div>
                <Dialog
                  open={showVitaminModal}
                  onOpenChange={setShowVitaminModal}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-purple-500/20 hover:text-purple-400"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Vitamin</DialogTitle>
                      <DialogDescription>
                        Add a new vitamin to your daily tracker.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="vitamin-name"
                          className="text-sm font-medium"
                        >
                          Vitamin Name
                        </Label>
                        <Input
                          id="vitamin-name"
                          value={vitaminName}
                          onChange={(e) => setVitaminName(e.target.value)}
                          placeholder="e.g., Vitamin D"
                          className="mt-1 bg-secondary/50"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="vitamin-time"
                          className="text-sm font-medium"
                        >
                          Time
                        </Label>
                        <Input
                          id="vitamin-time"
                          type="time"
                          value={vitaminTime}
                          onChange={(e) => setVitaminTime(e.target.value)}
                          className="mt-1 bg-secondary/50"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="vitamin-frequency"
                          className="text-sm font-medium"
                        >
                          Frequency
                        </Label>
                        <Select
                          value={vitaminFrequency}
                          onValueChange={(value) =>
                            setVitaminFrequency(
                              value as "daily" | "weekly" | "monthly"
                            )
                          }
                        >
                          <SelectTrigger
                            id="vitamin-frequency"
                            className="bg-secondary/50"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={addVitamin}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Add Vitamin
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">
                      Today's Progress
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {vitamins.filter((v) => v.taken).length} /{" "}
                      {vitamins.length}
                    </p>
                  </div>
                  <Progress value={vitaminProgress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2 mb-3">
                    {["all", "daily", "weekly", "monthly"].map((freq) => (
                      <Button
                        key={freq}
                        size="sm"
                        variant={vitaminFilter === freq ? "default" : "outline"}
                        onClick={() => setVitaminFilter(freq as any)}
                        className="text-xs h-8"
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filteredVitamins.map((vitamin) => (
                      <motion.div
                        key={vitamin.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
                      >
                        <Checkbox
                          checked={vitamin.taken}
                          onCheckedChange={() => toggleVitamin(vitamin.id)}
                          className="h-5 w-5"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${vitamin.taken ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {vitamin.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {vitamin.time}
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                          {vitamin.frequency}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mood & Energy Card */}
        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Mood & Energy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div>
                  <Label
                    htmlFor="mood"
                    className="text-sm font-medium mb-3 block"
                  >
                    How are you feeling?
                  </Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger id="mood" className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="great">Great 😄</SelectItem>
                      <SelectItem value="happy">Happy 😊</SelectItem>
                      <SelectItem value="okay">Okay 😐</SelectItem>
                      <SelectItem value="sad">Sad 😢</SelectItem>
                      <SelectItem value="stressed">Stressed 😰</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="energy"
                    className="text-sm font-medium mb-3 block"
                  >
                    Energy Level
                  </Label>
                  <Select value={energy} onValueChange={setEnergy}>
                    <SelectTrigger id="energy" className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High ⚡</SelectItem>
                      <SelectItem value="good">Good ✨</SelectItem>
                      <SelectItem value="fair">Fair 😑</SelectItem>
                      <SelectItem value="low">Low 💤</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                  <p className="text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    Your mood and energy are being tracked for insights.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Background Gradient Accents */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/10 to-accent/5 rounded-full blur-3xl -z-10" />
    </div>
  );
};

export default WellnessTracker;
