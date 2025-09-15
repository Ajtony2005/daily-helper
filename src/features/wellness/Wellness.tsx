import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, subDays } from "date-fns";
import {
  Droplet,
  Sun,
  CloudRain,
  Wind,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";

type WeatherData = {
  temperature: number;
  condition: "sunny" | "rainy" | "windy" | "cloudy";
  windSpeed: number;
};

type Exercise = {
  hasExercise: boolean;
  type?: string;
  time?: string;
  location?: string;
};

type Vitamin = {
  id: string;
  name: string;
  time: string;
  taken: boolean;
  frequency: number; // Hány naponta kell szedni
  createdAt: string; // Hozzáadás dátuma
};

type WaterIntake = {
  id: string;
  quantity: number; // Vízmennyiség ml-ben
  taken: boolean;
};

type MoodEnergy = {
  mood: string;
  energy: string;
};

type DailyData = {
  date: string;
  weather: WeatherData | null;
  exercise: Exercise;
  vitamins: Vitamin[];
  waterIntakes: WaterIntake[];
  moodEnergy: MoodEnergy;
};

const Wellness = () => {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddVitamin, setShowAddVitamin] = useState(false);
  const [vitaminForm, setVitaminForm] = useState({
    name: "",
    time: "",
    frequency: "1",
  });
  const [error, setError] = useState("");
  const [waterQuantityInput, setWaterQuantityInput] = useState<string>("250");

  const getDailyData = (date: Date): DailyData => {
    const dateKey = format(date, "yyyy-MM-dd");
    let data = dailyData.find((d) => d.date === dateKey);
    if (!data) {
      data = {
        date: dateKey,
        weather: null,
        exercise: { hasExercise: false },
        vitamins: [
          {
            id: "1",
            name: "D-vitamin",
            time: "Morning",
            taken: false,
            frequency: 1,
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "C-vitamin",
            time: "After Lunch",
            taken: false,
            frequency: 1,
            createdAt: new Date().toISOString(),
          },
        ],
        waterIntakes: Array(8)
          .fill(null)
          .map((_, i) => ({
            id: `water-${i}`,
            quantity: 250,
            taken: false,
          })),
        moodEnergy: { mood: "", energy: "" },
      };
      setDailyData([...dailyData, data]);
    }
    return data;
  };

  const currentData = getDailyData(selectedDate);

  useEffect(() => {
    const fetchWeather = async () => {
      const mockWeather: WeatherData = {
        temperature: 20,
        condition: "sunny",
        windSpeed: 5,
      };
      setDailyData((prev) =>
        prev.map((d) =>
          d.date === format(selectedDate, "yyyy-MM-dd")
            ? { ...d, weather: mockWeather }
            : d
        )
      );
    };
    fetchWeather();
  }, [selectedDate]);

  const getRecommendedClothing = (weather: WeatherData | null): string[] => {
    if (!weather) return [];
    const clothing = [];
    if (weather.temperature < 10) clothing.push("Warm jacket", "Scarf");
    else if (weather.temperature < 20)
      clothing.push("Light jacket", "Long-sleeve shirt");
    else clothing.push("T-shirt", "Shorts");
    if (weather.condition === "rainy")
      clothing.push("Umbrella", "Waterproof shoes");
    if (weather.condition === "windy") clothing.push("Windbreaker");
    if (
      currentData.exercise.hasExercise &&
      currentData.exercise.type === "Running"
    )
      clothing.push("Running shoes");
    return clothing;
  };

  const getDailyStatus = (data: DailyData) => {
    const allVitaminsTaken = data.vitamins.every(
      (v) => v.taken || !isVitaminApplicable(v, selectedDate)
    );
    const allWaterTaken = data.waterIntakes.every((w) => w.taken);
    const exerciseDone =
      !data.exercise.hasExercise ||
      (data.exercise.hasExercise && data.exercise.type !== undefined);
    const moodEnergyLogged =
      data.moodEnergy.mood !== "" && data.moodEnergy.energy !== "";
    if (allVitaminsTaken && allWaterTaken && exerciseDone && moodEnergyLogged)
      return "green";
    if (
      data.vitamins.some(
        (v) => !v.taken && isVitaminApplicable(v, selectedDate)
      ) ||
      data.waterIntakes.some((w) => !w.taken) ||
      !moodEnergyLogged
    )
      return "yellow";
    return "red";
  };

  const isVitaminApplicable = (vitamin: Vitamin, date: Date): boolean => {
    const createdDate = new Date(vitamin.createdAt);
    const currentDate = new Date(date);
    const diffInDays = Math.floor(
      (currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays % vitamin.frequency === 0;
  };

  const handleAddVitamin = () => {
    if (
      !vitaminForm.name.trim() ||
      !vitaminForm.time.trim() ||
      !vitaminForm.frequency
    ) {
      setError("Vitamin name, time, and frequency are required.");
      return;
    }
    setDailyData((prev) =>
      prev.map((d) =>
        d.date === format(selectedDate, "yyyy-MM-dd")
          ? {
              ...d,
              vitamins: [
                ...d.vitamins,
                {
                  id: Date.now().toString(),
                  name: vitaminForm.name.trim(),
                  time: vitaminForm.time.trim(),
                  taken: false,
                  frequency: parseInt(vitaminForm.frequency, 10),
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : d
      )
    );
    setVitaminForm({ name: "", time: "", frequency: "1" });
    setShowAddVitamin(false);
    setError("");
  };

  const handleToggleVitamin = (id: string) => {
    setDailyData((prev) =>
      prev.map((d) =>
        d.date === format(selectedDate, "yyyy-MM-dd")
          ? {
              ...d,
              vitamins: d.vitamins.map((v) =>
                v.id === id ? { ...v, taken: !v.taken } : v
              ),
            }
          : d
      )
    );
  };

  const handleToggleWater = (id: string, quantity?: number) => {
    setDailyData((prev) =>
      prev.map((d) =>
        d.date === format(selectedDate, "yyyy-MM-dd")
          ? {
              ...d,
              waterIntakes: d.waterIntakes.map((w) =>
                w.id === id
                  ? { ...w, taken: !w.taken, quantity: quantity || w.quantity }
                  : w
              ),
            }
          : d
      )
    );
  };

  const handleExerciseChange = (hasExercise: boolean) => {
    setDailyData((prev) =>
      prev.map((d) =>
        d.date === format(selectedDate, "yyyy-MM-dd")
          ? {
              ...d,
              exercise: {
                hasExercise,
                type: undefined,
                time: undefined,
                location: undefined,
              },
            }
          : d
      )
    );
  };

  const handleExerciseDetailsChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: string; value: any }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setDailyData((prev) =>
      prev.map((d) =>
        d.date === format(selectedDate, "yyyy-MM-dd")
          ? { ...d, exercise: { ...d.exercise, [name]: value } }
          : d
      )
    );
  };

  const handleMoodEnergyChange = (
    e: React.ChangeEvent<HTMLSelectElement> | { name: string; value: any }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setDailyData((prev) =>
      prev.map((d) =>
        d.date === format(selectedDate, "yyyy-MM-dd")
          ? { ...d, moodEnergy: { ...d.moodEnergy, [name]: value } }
          : d
      )
    );
  };

  const handleVitaminFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitaminForm({ ...vitaminForm, [e.target.name]: e.target.value });
    setError("");
  };

  const totalWaterIntake = currentData.waterIntakes
    .filter((w) => w.taken)
    .reduce((sum, w) => sum + w.quantity, 0);

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)",
      transition: { duration: 0.2 },
    },
    blur: { scale: 1, boxShadow: "none", transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardContent className="p-10 relative z-10">
            <CardTitle className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              Wellness Dashboard - {format(selectedDate, "MMMM d, yyyy")}
            </CardTitle>

            {/* Date Navigation */}
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  Previous Day
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
              <Button
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  Next Day
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
            </div>

            {/* Daily Status */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Daily Status
              </h3>
              <div
                className={`p-4 rounded-xl text-center glass ${
                  getDailyStatus(currentData) === "green"
                    ? "bg-green-500/20 text-green-400"
                    : getDailyStatus(currentData) === "yellow"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {getDailyStatus(currentData) === "green"
                  ? "All tasks completed!"
                  : getDailyStatus(currentData) === "yellow"
                  ? "Some tasks pending"
                  : "Tasks overdue or missing"}
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Weather Forecast
              </h3>
              {currentData.weather ? (
                <div className="glass p-4 rounded-xl border border-blue-600/40">
                  <div className="flex items-center gap-4">
                    {currentData.weather.condition === "sunny" && (
                      <Sun className="text-yellow-500 w-8 h-8" />
                    )}
                    {currentData.weather.condition === "rainy" && (
                      <CloudRain className="text-blue-500 w-8 h-8" />
                    )}
                    {currentData.weather.condition === "windy" && (
                      <Wind className="text-gray-400 w-8 h-8" />
                    )}
                    <div>
                      <div className="text-lg text-white">
                        Temperature: {currentData.weather.temperature}°C
                      </div>
                      <div className="text-sm text-gray-300">
                        Condition: {currentData.weather.condition}
                      </div>
                      <div className="text-sm text-gray-300">
                        Wind Speed: {currentData.weather.windSpeed} km/h
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-blue-300">
                      Recommended Clothing:
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getRecommendedClothing(currentData.weather).map(
                        (item, index) => (
                          <span
                            key={index}
                            className="bg-gray-800/50 text-white px-3 py-1 rounded-xl"
                          >
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Loading weather...</div>
              )}
            </div>

            {/* Exercise Tracking */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Daily Exercise
              </h3>
              <div className="glass p-4 rounded-xl border border-blue-600/40">
                <div className="flex items-center gap-2 mb-4">
                  <Checkbox
                    checked={currentData.exercise.hasExercise}
                    onCheckedChange={handleExerciseChange}
                    className="text-green-500"
                  />
                  <span className="text-white">Exercise today?</span>
                </div>
                {currentData.exercise.hasExercise && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-blue-300">Type</Label>
                      <Select
                        value={currentData.exercise.type || ""}
                        onValueChange={(value) =>
                          handleExerciseDetailsChange({ name: "type", value })
                        }
                      >
                        <SelectTrigger className="w-full glass px-4 py-3 text-[var(--color-card-darkForeground)] border-[var(--color-border)] focus:outline-none transition-all duration-300 fade-in">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="dropdown fade-in-down">
                          <SelectItem value="Running" className="dropdown-item">
                            Running
                          </SelectItem>
                          <SelectItem value="Gym" className="dropdown-item">
                            Gym
                          </SelectItem>
                          <SelectItem value="Yoga" className="dropdown-item">
                            Yoga
                          </SelectItem>
                          <SelectItem value="Other" className="dropdown-item">
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-blue-300">Time</Label>
                      <Input
                        type="time"
                        name="time"
                        value={currentData.exercise.time || ""}
                        onChange={handleExerciseDetailsChange}
                        className="w-full glass px-4 py-3 text-[var(--color-card-darkForeground)] border-[var(--color-border)] focus:outline-none transition-all duration-300 fade-in"
                      />
                    </div>
                    <div>
                      <Label className="text-blue-300">Location</Label>
                      <Input
                        type="text"
                        name="location"
                        value={currentData.exercise.location || ""}
                        onChange={handleExerciseDetailsChange}
                        placeholder="e.g., Park, Gym"
                        className="w-full glass px-4 py-3 text-[var(--color-card-darkForeground)] border-[var(--color-border)] focus:outline-none transition-all duration-300 placeholder-gray-400/50 fade-in"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Vitamin/Supplement Tracker */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Vitamin/Supplement Tracker
              </h3>
              <Button
                onClick={() => setShowAddVitamin(true)}
                className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group mb-4"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  <Plus className="w-5 h-5 mr-2" /> Add Vitamin
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
              <div className="glass p-4 rounded-xl border border-blue-600/40">
                {currentData.vitamins.filter((v) =>
                  isVitaminApplicable(v, selectedDate)
                ).length === 0 ? (
                  <p className="text-gray-400">
                    No vitamins scheduled for today.
                  </p>
                ) : (
                  currentData.vitamins
                    .filter((v) => isVitaminApplicable(v, selectedDate))
                    .map((vitamin) => (
                      <div
                        key={vitamin.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <Checkbox
                          checked={vitamin.taken}
                          onCheckedChange={() =>
                            handleToggleVitamin(vitamin.id)
                          }
                          className="text-green-500"
                        />
                        <span className="text-white">
                          {vitamin.name} ({vitamin.time}, every{" "}
                          {vitamin.frequency} day
                          {vitamin.frequency > 1 ? "s" : ""})
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Water Intake Tracker */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Water Intake (Total: {totalWaterIntake} ml)
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <Input
                  type="number"
                  value={waterQuantityInput}
                  onChange={(e) => setWaterQuantityInput(e.target.value)}
                  placeholder="ml"
                  className="w-32 glass px-4 py-3 text-[var(--color-card-darkForeground)] border-[var(--color-border)] focus:outline-none transition-all duration-300 placeholder-gray-400/50 fade-in"
                />
                <Button
                  onClick={() => {
                    const quantity = parseInt(waterQuantityInput, 10);
                    if (quantity > 0) {
                      handleToggleWater(
                        currentData.waterIntakes.find((w) => !w.taken)?.id ||
                          "",
                        quantity
                      );
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                    Add Water
                  </span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                </Button>
              </div>
              <div className="glass p-4 rounded-xl border border-blue-600/40 grid grid-cols-4 md:grid-cols-8 gap-2">
                {currentData.waterIntakes.map((water) => (
                  <div key={water.id} className="flex flex-col items-center">
                    <motion.div
                      animate={{ scale: water.taken ? 1.2 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Droplet
                        className={`w-8 h-8 cursor-pointer ${
                          water.taken ? "text-blue-500" : "text-gray-400"
                        }`}
                        onClick={() => handleToggleWater(water.id)}
                      />
                    </motion.div>
                    <span className="text-sm text-white">
                      {water.quantity} ml
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood/Energy Diary */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Mood & Energy Diary
              </h3>
              <div className="glass p-4 rounded-xl border border-blue-600/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-blue-300">Mood</Label>
                  <Select
                    value={currentData.moodEnergy.mood}
                    onValueChange={(value) =>
                      handleMoodEnergyChange({ name: "mood", value })
                    }
                  >
                    <SelectTrigger className="w-full glass px-4 py-3 text-[var(--color-card-darkForeground)] border-[var(--color-border)] focus:outline-none transition-all duration-300 fade-in">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent className="dropdown fade-in-down">
                      <SelectItem value="Happy" className="dropdown-item">
                        Happy
                      </SelectItem>
                      <SelectItem value="Neutral" className="dropdown-item">
                        Neutral
                      </SelectItem>
                      <SelectItem value="Sad" className="dropdown-item">
                        Sad
                      </SelectItem>
                      <SelectItem value="Stressed" className="dropdown-item">
                        Stressed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-blue-300">Energy Level</Label>
                  <Select
                    value={currentData.moodEnergy.energy}
                    onValueChange={(value) =>
                      handleMoodEnergyChange({ name: "energy", value })
                    }
                  >
                    <SelectTrigger className="w-full glass px-4 py-3 text-[var(--color-card-darkForeground)] border-[var(--color-border)] focus:outline-none transition-all duration-300 fade-in">
                      <SelectValue placeholder="Select energy level" />
                    </SelectTrigger>
                    <SelectContent className="dropdown fade-in-down">
                      <SelectItem value="High" className="dropdown-item">
                        High
                      </SelectItem>
                      <SelectItem value="Medium" className="dropdown-item">
                        Medium
                      </SelectItem>
                      <SelectItem value="Low" className="dropdown-item">
                        Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Vitamin Modal */}
      {showAddVitamin && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAddVitamin(false)}
        >
          <motion.div
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Add Vitamin/Supplement
              </CardTitle>
              <motion.div className="space-y-6">
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="name"
                    animate={
                      vitaminForm.name
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Vitamin Name
                  </motion.label>
                  <motion.input
                    id="name"
                    type="text"
                    name="name"
                    value={vitaminForm.name}
                    onChange={handleVitaminFormChange}
                    placeholder="e.g., D-vitamin"
                    className="w-full glass px-4 py-3 text-[var(--color-card-darkForeground)] border-[var(--color-border)] focus:outline-none transition-all duration-300 placeholder-gray-400/50 fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="time"
                    animate={
                      vitaminForm.time
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Time of Day
                  </motion.label>
                  <motion.input
                    id="time"
                    type="text"
                    name="time"
                    value={vitaminForm.time}
                    onChange={handleVitaminFormChange}
                    placeholder="e.g., Morning"
                    className="w-full glass px-4 py-3 text-[var(--color-card-darkForeground)] border-[var(--color-border)] focus:outline-none transition-all duration-300 placeholder-gray-400/50 fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="frequency"
                    animate={
                      vitaminForm.frequency
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Frequency (days)
                  </motion.label>
                  <motion.input
                    id="frequency"
                    type="number"
                    name="frequency"
                    value={vitaminForm.frequency}
                    onChange={handleVitaminFormChange}
                    placeholder="e.g., 1 for daily"
                    className="w-full glass px-4 py-3 text-[var(--color-card-darkForeground)] border-[var(--color-border)] focus:outline-none transition-all duration-300 placeholder-gray-400/50 fade-in"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                    min="1"
                  />
                </div>
                {error && (
                  <motion.p
                    className="text-red-400 text-center font-medium"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {error}
                  </motion.p>
                )}
                <Button
                  type="button"
                  onClick={handleAddVitamin}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                    <Plus className="w-5 h-5" />
                    Add Vitamin
                  </span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddVitamin(false)}
                  className="w-full bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                >
                  Cancel
                </Button>
              </motion.div>
            </CardContent>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Wellness;
