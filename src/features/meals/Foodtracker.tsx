"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  useRef,
} from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, CheckCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// removed unused Textarea import
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MealItemSchema } from "@/lib/schemas";
import { z } from "zod";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

type FoodItem = {
  id: string;
  name: string;
  category: "Vegetable" | "Fruit" | "Protein" | "Grain" | "Dairy" | "Other";
  qty: string;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  photo?: string; // data URL
};

type Meal = {
  id: string;
  date: string; // ISO date
  type: MealType;
  items: FoodItem[];
};

type Habit = { id: string; name: string; doneDates: string[] };

const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const CATEGORY_COLORS: Record<FoodItem["category"], string> = {
  Vegetable: "bg-green-500/20 text-green-500",
  Fruit: "bg-amber-500/20 text-amber-500",
  Protein: "bg-rose-500/20 text-rose-500",
  Grain: "bg-sky-500/20 text-sky-500",
  Dairy: "bg-violet-500/20 text-violet-500",
  Other: "bg-muted/10 text-muted-foreground",
};

function uid(prefix = "") {
  return (
    prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
  );
}

export default function FoodTracker() {
  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10);
  const [viewDay, setViewDay] = useState<string>(isoToday);
  const [weeklyView, setWeeklyView] = useState(false);
  const [meals, setMeals] = useState<Meal[]>(() => []);

  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(() => [
    { id: uid("h_"), name: "No Sugary Drinks", doneDates: [] },
  ]);

  const { toast } = useToast();

  // form state for new meal/item
  const [mealFormType, setMealFormType] = useState<MealType>("Breakfast");
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] =
    useState<FoodItem["category"]>("Vegetable");
  const [itemQty, setItemQty] = useState("");
  const [itemUnit, setItemUnit] = useState("pcs");
  const [itemCalories, setItemCalories] = useState<number | undefined>(
    undefined
  );
  const [itemProtein, setItemProtein] = useState<number | undefined>(undefined);
  const [itemCarbs, setItemCarbs] = useState<number | undefined>(undefined);
  const [itemFat, setItemFat] = useState<number | undefined>(undefined);
  const [itemPhoto, setItemPhoto] = useState<string | undefined>(undefined);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // inventory (sample) — in a real app this would come from inventory feature
  const [inventory] = useState<string[]>([
    "Banana",
    "Spinach",
    "Chicken Breast",
    "Oats",
    "Eggs",
  ]);

  useEffect(() => {
    // try to pre-suggest from inventory when typing (kept for future enhancements)
  }, []);

  const mealsForDay = useMemo(
    () => meals.filter((m) => m.date === viewDay),
    [meals, viewDay]
  );

  const weeklyRange = useMemo(() => {
    const start = new Date(viewDay);
    const days = [] as string[];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }, [viewDay]);

  const nutritionTotals = useMemo(() => {
    const allItems = weeklyView
      ? meals
          .filter((m) => weeklyRange.includes(m.date))
          .flatMap((m) => m.items)
      : mealsForDay.flatMap((m) => m.items);
    return allItems.reduce(
      (acc, it) => {
        acc.calories += it.calories || 0;
        acc.protein += it.protein || 0;
        acc.carbs += it.carbs || 0;
        acc.fat += it.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [mealsForDay, weeklyView, weeklyRange, meals]);

  const nutritionGoals = { calories: 2000, protein: 75, carbs: 300, fat: 70 };

  function resetForm() {
    setMealFormType("Breakfast");
    setItemName("");
    setItemCategory("Vegetable");
    setItemQty("");
    setItemUnit("pcs");
    setItemCalories(undefined);
    setItemProtein(undefined);
    setItemCarbs(undefined);
    setItemFat(undefined);
    setItemPhoto(undefined);
    setSuggestions([]);
  }

  function openNewMealModal() {
    setEditingMeal(null);
    resetForm();
    setIsMealModalOpen(true);
  }

  function handlePhotoUpload(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setItemPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files ? e.target.files[0] : undefined;
    handlePhotoUpload(f);
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  function triggerFilePicker() {
    fileInputRef.current?.click();
  }

  function saveMealItem() {
    if (!itemName.trim()) {
      toast({ title: "Name required" });
      return;
    }
    // normalize quantity
    const qty = itemQty.trim() || "1";
    const newItem: FoodItem = {
      id: uid("f_"),
      name: itemName.trim(),
      category: itemCategory,
      qty,
      unit: itemUnit || "pcs",
      calories: itemCalories,
      protein: itemProtein,
      carbs: itemCarbs,
      fat: itemFat,
      photo: itemPhoto,
    };

    // validate with zod
    try {
      MealItemSchema.parse({
        id: newItem.id,
        name: newItem.name,
        calories: newItem.calories,
        notes: undefined,
        photo: newItem.photo,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msg = err.issues?.[0]?.message || "Validation failed";
        toast({ title: msg });
        return;
      }
      throw err;
    }

    if (editingMeal) {
      // update existing meal
      setMeals((m) =>
        m.map((me) =>
          me.id === editingMeal.id
            ? { ...me, items: [...me.items, newItem] }
            : me
        )
      );
      toast({ title: "Added to meal" });
    } else {
      const mealDate = viewDay;
      const newMeal: Meal = {
        id: uid("m_"),
        date: mealDate,
        type: mealFormType,
        items: [newItem],
      };
      setMeals((m) => [newMeal, ...m]);
      toast({ title: "Meal created" });
    }
    setIsMealModalOpen(false);
    resetForm();
  }

  function removeItemFromMeal(mealId: string, itemId: string) {
    setMeals((m) =>
      m.map((me) =>
        me.id === mealId
          ? { ...me, items: me.items.filter((i) => i.id !== itemId) }
          : me
      )
    );
  }

  function deleteMeal(mealId: string) {
    setMeals((m) => m.filter((x) => x.id !== mealId));
  }

  function suggestMeals(query: string) {
    // simple suggestion using inventory contains
    if (!query) return inventory.slice(0, 5);
    return inventory
      .filter((i) => i.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }

  function toggleHabit(habitId: string, date = viewDay) {
    setHabits((h) =>
      h.map((hb) =>
        hb.id === habitId
          ? {
              ...hb,
              doneDates: hb.doneDates.includes(date)
                ? hb.doneDates.filter((d) => d !== date)
                : [...hb.doneDates, date],
            }
          : hb
      )
    );
  }

  function addHabit(name: string) {
    setHabits((h) => [{ id: uid("h_"), name, doneDates: [] }, ...h]);
    setIsHabitModalOpen(false);
  }

  // layout
  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Food Tracker</h2>
            <p className="text-sm text-muted-foreground">
              Track meals, nutrition and healthy habits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Input
              type="date"
              value={viewDay}
              onChange={(e) => setViewDay(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Label>Weekly</Label>
              <Switch
                checked={weeklyView}
                onCheckedChange={(v) => setWeeklyView(Boolean(v))}
              />
            </div>
            <Button
              onClick={openNewMealModal}
              className="flex items-center gap-2"
            >
              <Plus /> Add Meal
            </Button>
            <Dialog open={isHabitModalOpen} onOpenChange={setIsHabitModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setIsHabitModalOpen(true)}
                >
                  Add Habit
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div layout>
            <Card>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Nutrition</h3>
                <small className="text-muted-foreground">
                  {weeklyView ? "Weekly" : "Today"}
                </small>
              </div>
              <div className="space-y-3 mt-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Calories</span>
                    <span>
                      {nutritionTotals.calories}/{nutritionGoals.calories}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (nutritionTotals.calories / nutritionGoals.calories) * 100
                    )}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Protein (g)</span>
                    <span>
                      {nutritionTotals.protein}/{nutritionGoals.protein}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (nutritionTotals.protein / nutritionGoals.protein) * 100
                    )}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Carbs (g)</span>
                  <span>
                    {nutritionTotals.carbs}/{nutritionGoals.carbs}
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    (nutritionTotals.carbs / nutritionGoals.carbs) * 100
                  )}
                />
                <div className="flex justify-between text-sm">
                  <span>Fat (g)</span>
                  <span>
                    {nutritionTotals.fat}/{nutritionGoals.fat}
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    (nutritionTotals.fat / nutritionGoals.fat) * 100
                  )}
                />
              </div>
            </Card>
          </motion.div>

          <motion.div layout className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Meals {weeklyView ? "(week)" : ""}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {mealsForDay.length} items
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {weeklyView
                  ? weeklyRange.map((day) => (
                      <div key={day}>
                        <h4 className="font-medium">{day}</h4>
                        <div className="space-y-2 mt-2">
                          {meals
                            .filter((m) => m.date === day)
                            .map((me) => (
                              <div
                                key={me.id}
                                className="p-3 rounded-md bg-muted/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge className="text-xs">{me.type}</Badge>
                                    <div className="text-sm font-medium">
                                      Meal ({me.items.length} items)
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-2 flex-wrap">
                                    {me.items.map((it) => (
                                      <div
                                        key={it.id}
                                        className="flex items-center gap-2"
                                      >
                                        <Avatar className="h-8 w-8">
                                          {it.photo ? (
                                            <img src={it.photo} alt={it.name} />
                                          ) : (
                                            <div className="bg-muted/10 h-8 w-8 rounded" />
                                          )}
                                        </Avatar>
                                        <div>
                                          <div className="text-sm">
                                            {it.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {it.qty} {it.unit}
                                          </div>
                                        </div>
                                        <div className="ml-auto">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              removeItemFromMeal(me.id, it.id)
                                            }
                                            aria-label={`Remove ${it.name}`}
                                          >
                                            <Trash2 />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    onClick={() => setEditingMeal(me)}
                                  >
                                    <Plus /> Add
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    onClick={() => deleteMeal(me.id)}
                                  >
                                    <Trash2 />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))
                  : MEAL_TYPES.map((type) => (
                      <div key={type}>
                        <h4 className="font-medium">{type}</h4>
                        <div className="space-y-2 mt-2">
                          {mealsForDay
                            .filter((m) => m.type === type)
                            .map((me) => (
                              <div
                                key={me.id}
                                className="p-3 rounded-md bg-muted/5 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <Badge className="text-xs">{type}</Badge>
                                  <div>
                                    <div className="font-medium flex flex-wrap gap-2">
                                      {me.items.map((i) => (
                                        <span
                                          key={i.id}
                                          className="inline-flex items-center gap-2 px-2 py-1 rounded bg-muted/5"
                                        >
                                          <span>{i.name}</span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                              removeItemFromMeal(me.id, i.id)
                                            }
                                            aria-label={`Remove ${i.name}`}
                                          >
                                            <Trash2 />
                                          </Button>
                                        </span>
                                      ))}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {me.items.length} items
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingMeal(me)}
                                  >
                                    <Plus />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteMeal(me.id)}
                                  >
                                    <Trash2 />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Suggestions</h4>
              <small className="text-muted-foreground">From inventory</small>
            </div>
            <div className="mt-3 space-y-2">
              {suggestMeals("").map((s) => (
                <div key={s} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-slate-300`} />
                    <div>{s}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      // quick add as snack meal
                      const newMeal: Meal = {
                        id: uid("m_"),
                        date: viewDay,
                        type: "Snack",
                        items: [
                          {
                            id: uid("f_"),
                            name: s,
                            category: "Other",
                            qty: "1",
                            unit: "pcs",
                          },
                        ],
                      };
                      setMeals((m) => [newMeal, ...m]);
                      toast({ title: "Added suggestion to meals" });
                    }}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Habits</h4>
              <div className="flex items-center gap-2">
                <Dialog
                  open={isHabitModalOpen}
                  onOpenChange={setIsHabitModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Habit</DialogTitle>
                    </DialogHeader>
                    <HabitForm onAdd={(name) => addHabit(name)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              {habits.map((h) => (
                <div key={h.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm">{h.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Streak: {h.doneDates.length}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={
                        h.doneDates.includes(viewDay) ? "default" : "outline"
                      }
                      onClick={() => toggleHabit(h.id, viewDay)}
                    >
                      <CheckCircle />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Meal Modal */}
        <Dialog open={isMealModalOpen} onOpenChange={setIsMealModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMeal ? "Add Item to Meal" : "Add Meal"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Meal Type</Label>
                  <Select onValueChange={(v) => setMealFormType(v as MealType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEAL_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={viewDay}
                    onChange={(e) => setViewDay(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label>Food</Label>
                  <div className="relative">
                    <Input
                      value={itemName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setItemName(e.target.value);
                        setSuggestions(suggestMeals(e.target.value));
                      }}
                      placeholder="e.g., Banana"
                      aria-label="Food name"
                    />
                    {suggestions.length > 0 && (
                      <ul className="absolute z-20 left-0 right-0 mt-1 bg-popover border border-border/20 rounded-md shadow-md overflow-hidden">
                        {suggestions.map((s) => (
                          <li
                            key={s}
                            className="px-3 py-2 hover:bg-accent/10 cursor-pointer"
                            onClick={() => {
                              setItemName(s);
                              setSuggestions([]);
                            }}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    onValueChange={(v) =>
                      setItemCategory(v as FoodItem["category"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(CATEGORY_COLORS).map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <div className="flex gap-2">
                    <Input
                      value={itemQty}
                      onChange={(e) => setItemQty(e.target.value)}
                    />
                    <Input
                      value={itemUnit}
                      onChange={(e) => setItemUnit(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label>Calories</Label>
                  <Input
                    type="number"
                    value={itemCalories ?? ""}
                    onChange={(e) =>
                      setItemCalories(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Protein (g)</Label>
                  <Input
                    type="number"
                    value={itemProtein ?? ""}
                    onChange={(e) =>
                      setItemProtein(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Carbs (g)</Label>
                  <Input
                    type="number"
                    value={itemCarbs ?? ""}
                    onChange={(e) =>
                      setItemCarbs(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Fat (g)</Label>
                  <Input
                    type="number"
                    value={itemFat ?? ""}
                    onChange={(e) =>
                      setItemFat(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Photo</Label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileInput(e)}
                  />
                  <Button variant="outline" onClick={triggerFilePicker}>
                    <Camera className="mr-2" />
                    Upload photo
                  </Button>
                  {itemPhoto && (
                    <div className="flex items-center gap-2">
                      <img
                        src={itemPhoto}
                        className="h-16 w-16 object-cover rounded"
                        alt="preview"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setItemPhoto(undefined)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsMealModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveMealItem}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function HabitForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="space-y-3">
      <Label>Name</Label>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (name.trim()) {
              onAdd(name.trim());
              setName("");
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
