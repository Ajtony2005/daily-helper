import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { CheckCircle, Plus, XCircle, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const foodCategories = [
  { name: "Vegetable/Fruit", color: "bg-green-500" },
  { name: "Meat", color: "bg-red-500" },
  { name: "Dessert", color: "bg-yellow-500" },
  { name: "Grain", color: "bg-blue-500" },
  { name: "Dairy", color: "bg-purple-500" },
  { name: "Other", color: "bg-gray-500" },
];

const mealTypes = [
  "Breakfast",
  "Morning Snack",
  "Lunch",
  "Afternoon Snack",
  "Dinner",
];

type Meal = {
  id: string;
  mealType: string;
  food: string;
  category: string;
  quantity: string;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  photo?: string;
  date: string;
};

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  minQuantity: number;
  expirationDate: string;
  location: string;
  status: "in_stock" | "low" | "out";
};

type Habit = {
  id: string;
  name: string;
  streak: number;
  completedDates: string[];
};

const FoodTracker = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [, setInventory] = useState<InventoryItem[]>([]); // Assume inventory is passed or fetched
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [form, setForm] = useState({
    mealType: mealTypes[0],
    food: "",
    category: foodCategories[0].name,
    quantity: "",
    unit: "",
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
    photo: null as File | null,
  });
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "default",
      name: "No Sugary Drinks",
      streak: 0,
      completedDates: [],
    },
  ]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [habitForm, setHabitForm] = useState({ name: "" });
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  // Mock inventory fetch (replace with actual integration)
  useEffect(() => {
    // Example: Fetch inventory from a state or API
    const mockInventory: InventoryItem[] = [
      {
        id: "1",
        name: "Rice",
        quantity: 2,
        unit: "kg",
        category: "Grain",
        minQuantity: 1,
        expirationDate: "",
        location: "Pantry",
        status: "in_stock",
      },
      {
        id: "2",
        name: "Chicken Breast",
        quantity: 1,
        unit: "kg",
        category: "Meat",
        minQuantity: 0.5,
        expirationDate: "",
        location: "Fridge",
        status: "in_stock",
      },
    ];
    setInventory(mockInventory);
    suggestMeals(mockInventory);
  }, []);

  // Update streaks for habits
  useEffect(() => {
    // Only recalculate streaks when selectedDate changes, not when habits change
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        const todayDate = format(selectedDate, "yyyy-MM-dd");
        const sortedDates = [...habit.completedDates].sort();
        let streak = 0;
        let currentDate = new Date(todayDate);
        while (sortedDates.includes(format(currentDate, "yyyy-MM-dd"))) {
          streak++;
          currentDate = subDays(currentDate, 1);
        }
        return { ...habit, streak };
      })
    );
  }, [selectedDate]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: any } }
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAddMeal = () => {
    if (!form.food.trim() || !form.quantity.trim()) {
      setError("Food name and quantity are required.");
      return;
    }
    const newMeal: Meal = {
      id: Date.now().toString(),
      mealType: form.mealType,
      food: form.food.trim(),
      category: form.category,
      quantity: form.quantity,
      unit: form.unit.trim(),
      calories: parseFloat(form.calories) || 0,
      protein: parseFloat(form.protein) || 0,
      fat: parseFloat(form.fat) || 0,
      carbs: parseFloat(form.carbs) || 0,
      photo: form.photo ? URL.createObjectURL(form.photo) : undefined,
      date: format(selectedDate, "yyyy-MM-dd"),
    };
    setMeals([...meals, newMeal]);
    setForm({
      mealType: mealTypes[0],
      food: "",
      category: foodCategories[0].name,
      quantity: "",
      unit: "",
      calories: "",
      protein: "",
      fat: "",
      carbs: "",
      photo: null,
    });
    setShowAddMeal(false);
    setError("");
  };

  const handleAddHabit = () => {
    if (!habitForm.name.trim()) {
      setError("Habit name is required.");
      return;
    }
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitForm.name.trim(),
      streak: 0,
      completedDates: [],
    };
    setHabits([...habits, newHabit]);
    setHabitForm({ name: "" });
    setShowAddHabit(false);
    setError("");
  };

  const handleToggleHabit = (habitId: string) => {
    const todayDate = format(selectedDate, "yyyy-MM-dd");
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completedDates: habit.completedDates.includes(todayDate)
                ? habit.completedDates.filter((date) => date !== todayDate)
                : [...habit.completedDates, todayDate],
            }
          : habit
      )
    );
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
  };

  const suggestMeals = (inventory: InventoryItem[]) => {
    const availableItems = inventory.filter(
      (item) => item.status === "in_stock" && item.quantity > 0
    );
    const suggestions = availableItems.map((item) => {
      if (item.category === "Grain") return `${item.name} with vegetables`;
      if (item.category === "Meat") return `${item.name} with rice`;
      return item.name;
    });
    setSuggestions(suggestions);
  };

  const getMealsForDate = (date: Date) => {
    return meals.filter((meal) => meal.date === format(date, "yyyy-MM-dd"));
  };

  const getDailyTotals = (date: Date) => {
    const dailyMeals = getMealsForDate(date);
    return dailyMeals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        fat: totals.fat + meal.fat,
        carbs: totals.carbs + meal.carbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  };

  const getDatesWithMeals = () => {
    const dates = new Set(meals.map((meal) => new Date(meal.date)));
    return Array.from(dates);
  };

  const getWeeklyDates = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(start, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

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
        className="w-full max-w-5xl relative z-10"
      >
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardContent className="p-10 relative z-10">
            <CardTitle className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              Food Tracker
            </CardTitle>

            {/* View Mode Toggle */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={() => setViewMode("daily")}
                className={`mr-2 ${
                  viewMode === "daily" ? "bg-blue-600" : "bg-gray-800/30"
                } text-white py-2 px-4 rounded-xl`}
              >
                Daily View
              </Button>
              <Button
                onClick={() => setViewMode("weekly")}
                className={`${
                  viewMode === "weekly" ? "bg-blue-600" : "bg-gray-800/30"
                } text-white py-2 px-4 rounded-xl`}
              >
                Weekly View
              </Button>
            </div>

            {/* Calendar Navigation */}
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                className="bg-blue-600 text-white py-2 px-4 rounded-xl"
              >
                Previous Day
              </Button>

              <Button
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="bg-blue-600 text-white py-2 px-4 rounded-xl"
              >
                Next Day
              </Button>
            </div>

            {/* Habit Tracking */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-white">Habit Tracking</h3>
                <Button
                  onClick={() => setShowAddHabit(true)}
                  className="bg-blue-600 text-white py-1 px-2 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Habit
                </Button>
              </div>
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between gap-2 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={habit.completedDates.includes(
                        format(selectedDate, "yyyy-MM-dd")
                      )}
                      onCheckedChange={() => handleToggleHabit(habit.id)}
                      className="text-green-500"
                    />
                    <span className="text-gray-300">{habit.name}:</span>
                    <span className="text-yellow-500 font-bold">
                      {habit.streak} days
                    </span>
                    {habit.streak > 0 ? (
                      <CheckCircle className="text-green-500 w-5 h-5" />
                    ) : (
                      <XCircle className="text-red-500 w-5 h-5" />
                    )}
                  </div>
                  <Button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="bg-red-500 text-white p-1 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Meal Suggestions */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Meal Suggestions (Based on Inventory)
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <span
                      key={index}
                      className="bg-gray-800/50 text-white px-3 py-1 rounded-xl"
                    >
                      {suggestion}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">
                    No inventory items available.
                  </span>
                )}
              </div>
            </div>

            {viewMode === "daily" ? (
              <>
                {/* Daily Totals */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Totals for {format(selectedDate, "MMMM d, yyyy")}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/30 p-3 rounded-xl">
                      <span className="text-gray-300">Calories:</span>{" "}
                      <span className="font-bold text-white">
                        {getDailyTotals(selectedDate).calories} kcal
                      </span>
                    </div>
                    <div className="bg-gray-800/30 p-3 rounded-xl">
                      <span className="text-gray-300">Protein:</span>{" "}
                      <span className="font-bold text-white">
                        {getDailyTotals(selectedDate).protein} g
                      </span>
                    </div>
                    <div className="bg-gray-800/30 p-3 rounded-xl">
                      <span className="text-gray-300">Fat:</span>{" "}
                      <span className="font-bold text-white">
                        {getDailyTotals(selectedDate).fat} g
                      </span>
                    </div>
                    <div className="bg-gray-800/30 p-3 rounded-xl">
                      <span className="text-gray-300">Carbs:</span>{" "}
                      <span className="font-bold text-white">
                        {getDailyTotals(selectedDate).carbs} g
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add Meal Button */}
                <Button
                  type="button"
                  onClick={() => setShowAddMeal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 mb-6"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Meal
                  </span>
                </Button>

                {/* Meals Display */}
                <div className="space-y-8">
                  {mealTypes.map((mealType) => {
                    const mealsForType = getMealsForDate(selectedDate).filter(
                      (meal) => meal.mealType === mealType
                    );
                    return (
                      <div key={mealType}>
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 mb-4">
                          {mealType}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mealsForType.length === 0 ? (
                            <p className="text-gray-400">No meals recorded.</p>
                          ) : (
                            mealsForType.map((meal) => (
                              <motion.div
                                key={meal.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-800/30 p-4 rounded-xl border border-blue-600/40 shadow-inner"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="font-bold text-lg text-white">
                                    {meal.food}
                                  </div>
                                  <div
                                    className={`px-2 py-1 rounded-full text-sm text-white ${
                                      foodCategories.find(
                                        (cat) => cat.name === meal.category
                                      )?.color
                                    }`}
                                  >
                                    {meal.category}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-300 mb-2">
                                  Quantity: {meal.quantity} {meal.unit}
                                </div>
                                <div className="text-sm text-gray-300 mb-2">
                                  Calories: {meal.calories} kcal
                                </div>
                                <div className="text-sm text-gray-300 mb-2">
                                  Protein: {meal.protein} g | Fat: {meal.fat} g
                                  | Carbs: {meal.carbs} g
                                </div>
                                {meal.photo && (
                                  <img
                                    src={meal.photo}
                                    alt={meal.food}
                                    className="w-24 h-24 object-cover rounded-xl mt-2"
                                  />
                                )}
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Weekly Table View */
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Weekly Totals
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Metric</TableHead>
                      {getWeeklyDates().map((date) => (
                        <TableHead
                          key={format(date, "yyyy-MM-dd")}
                          className="text-white"
                        >
                          {format(date, "EEE, MMM d")}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-gray-300">
                        Calories (kcal)
                      </TableCell>
                      {getWeeklyDates().map((date) => (
                        <TableCell
                          key={format(date, "yyyy-MM-dd")}
                          className="text-white"
                        >
                          {getDailyTotals(date).calories}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-gray-300">
                        Protein (g)
                      </TableCell>
                      {getWeeklyDates().map((date) => (
                        <TableCell
                          key={format(date, "yyyy-MM-dd")}
                          className="text-white"
                        >
                          {getDailyTotals(date).protein}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-gray-300">Fat (g)</TableCell>
                      {getWeeklyDates().map((date) => (
                        <TableCell
                          key={format(date, "yyyy-MM-dd")}
                          className="text-white"
                        >
                          {getDailyTotals(date).fat}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-gray-300">Carbs (g)</TableCell>
                      {getWeeklyDates().map((date) => (
                        <TableCell
                          key={format(date, "yyyy-MM-dd")}
                          className="text-white"
                        >
                          {getDailyTotals(date).carbs}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAddMeal(false)}
        >
          <motion.div
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Add Meal
              </CardTitle>
              <motion.div className="space-y-6">
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="mealType"
                    animate={
                      form.mealType
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Meal Type
                  </motion.label>
                  <Select
                    value={form.mealType}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "mealType", value } })
                    }
                  >
                    <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mealTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="food"
                    animate={
                      form.food ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Food
                  </motion.label>
                  <motion.input
                    id="food"
                    type="text"
                    name="food"
                    value={form.food}
                    onChange={handleChange}
                    placeholder="e.g., Scrambled eggs"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
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
                      handleChange({ target: { name: "category", value } })
                    }
                  >
                    <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {foodCategories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          <div className="flex items-center">
                            <span
                              className={`w-3 h-3 rounded-full ${cat.color} mr-2`}
                            ></span>
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="quantity"
                    animate={
                      form.quantity
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Quantity
                  </motion.label>
                  <motion.input
                    id="quantity"
                    type="text"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="e.g., 200"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="unit"
                    animate={
                      form.unit ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Unit
                  </motion.label>
                  <motion.input
                    id="unit"
                    type="text"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="e.g., g"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="calories"
                    animate={
                      form.calories
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Calories (kcal)
                  </motion.label>
                  <motion.input
                    id="calories"
                    type="number"
                    name="calories"
                    value={form.calories}
                    onChange={handleChange}
                    placeholder="e.g., 250"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="protein"
                    animate={
                      form.protein ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Protein (g)
                  </motion.label>
                  <motion.input
                    id="protein"
                    type="number"
                    name="protein"
                    value={form.protein}
                    onChange={handleChange}
                    placeholder="e.g., 20"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="fat"
                    animate={
                      form.fat ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Fat (g)
                  </motion.label>
                  <motion.input
                    id="fat"
                    type="number"
                    name="fat"
                    value={form.fat}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="carbs"
                    animate={
                      form.carbs ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Carbs (g)
                  </motion.label>
                  <motion.input
                    id="carbs"
                    type="number"
                    name="carbs"
                    value={form.carbs}
                    onChange={handleChange}
                    placeholder="e.g., 30"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
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
                  onClick={handleAddMeal}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Meal
                  </span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddMeal(false)}
                  className="w-full bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                >
                  Cancel
                </Button>
              </motion.div>
            </CardContent>
          </motion.div>
        </motion.div>
      )}

      {/* Add Habit Modal */}
      {showAddHabit && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAddHabit(false)}
        >
          <motion.div
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Add Habit
              </CardTitle>
              <motion.div className="space-y-6">
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold"
                    htmlFor="name"
                    animate={
                      habitForm.name
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Habit Name
                  </motion.label>
                  <motion.input
                    id="name"
                    type="text"
                    name="name"
                    value={habitForm.name}
                    onChange={(e) =>
                      setHabitForm({ ...habitForm, name: e.target.value })
                    }
                    placeholder="e.g., Drink 8 glasses of water"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white border border-blue-600/40"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
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
                  onClick={handleAddHabit}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Habit
                  </span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddHabit(false)}
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

export default FoodTracker;
