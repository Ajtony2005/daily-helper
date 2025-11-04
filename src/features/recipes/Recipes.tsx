"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Star,
  StarOff,
  Search,
  Download,
  Calendar,
  Trash2,
  Edit2,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { RecipeSchema } from "@/lib/schemas";
import { z } from "zod";

type Ingredient = { id: string; name: string; quantity: string; unit: string };

type Recipe = {
  id: string;
  name: string;
  mealTypes: string[]; // breakfast, lunch, dinner, snack
  recipeType: string; // e.g., Vegan, Dessert
  ingredients: Ingredient[];
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  notes: string;
  imageUrl?: string;
  favorite?: boolean;
  createdAt: string;
};

const DEFAULT_MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const DEFAULT_RECIPE_TYPES = [
  "All",
  "Vegan",
  "Vegetarian",
  "Dessert",
  "Main",
  "Appetizer",
];

export default function RecipesManager() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => []);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const { toast } = useToast();

  const emptyForm = {
    name: "",
    mealTypes: [] as string[],
    recipeType: "",
    ingredients: [] as Ingredient[],
    instructions: "",
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    notes: "",
    imageUrl: "",
  };

  const [form, setForm] = useState(() => ({ ...emptyForm }));

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (favoritesOnly && !r.favorite) return false;
      if (typeFilter !== "All" && r.recipeType !== typeFilter) return false;
      if (query && !r.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [recipes, query, typeFilter, favoritesOnly]);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setIsEditorOpen(true);
  };

  const openEdit = (r: Recipe) => {
    setEditingId(r.id);
    setForm({
      ...r,
      imageUrl: r.imageUrl || "",
      ingredients: r.ingredients.map((i) => ({ ...i })),
    });
    setIsEditorOpen(true);
  };

  const saveRecipe = () => {
    if (!form.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a recipe name",
        variant: "destructive",
      });
      return;
    }

    // Validate with Zod
    try {
      const candidate = {
        id: editingId || Date.now().toString(),
        title: form.name.trim(),
        ingredients: form.ingredients.map((i) => ({
          name: i.name,
          quantity: i.quantity || undefined,
        })),
        steps: form.instructions
          ? form.instructions
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        tags: form.mealTypes || [],
        timeMinutes: Number(form.prepTime || 0) + Number(form.cookTime || 0),
        image: form.imageUrl || undefined,
      };
      RecipeSchema.parse(candidate);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msg = err.issues?.[0]?.message || "Validation failed";
        toast({ title: msg, variant: "destructive" });
        return;
      }
      throw err;
    }
    if (editingId) {
      setRecipes((s) =>
        s.map((r) =>
          r.id === editingId ? { ...(r as Recipe), ...form, id: editingId } : r
        )
      );
      toast({ title: "Updated", description: "Recipe updated" });
    } else {
      const newRecipe: Recipe = {
        ...(form as any),
        id: Date.now().toString(),
        favorite: false,
        createdAt: new Date().toISOString(),
      };
      setRecipes((s) => [newRecipe, ...s]);
      toast({ title: "Saved", description: "Recipe created" });
    }
    setIsEditorOpen(false);
  };

  const toggleFavorite = (id: string) =>
    setRecipes((s) =>
      s.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r))
    );

  const deleteRecipe = (id: string) => {
    setRecipes((s) => s.filter((r) => r.id !== id));
    toast({ title: "Deleted", description: "Recipe removed" });
  };

  // Planner state: map day->meal->recipeId
  const [planner, setPlanner] = useState<
    Record<string, Record<string, string | null>>
  >(() => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];
    const p: any = {};
    days.forEach((d) => {
      p[d] = {};
      meals.forEach((m) => (p[d][m] = null));
    });
    return p;
  });

  const assignToPlanner = (day: string, meal: string, recipeId?: string) => {
    setPlanner((p) => ({
      ...p,
      [day]: { ...p[day], [meal]: recipeId || null },
    }));
  };

  const generateShoppingList = (selectedDays: string[]) => {
    // gather ingredients for recipes assigned to selectedDays
    const aggregated: Record<string, { quantity: string; unit: string }[]> = {};
    selectedDays.forEach((day) => {
      Object.values(planner[day]).forEach((rid) => {
        if (!rid) return;
        const r = recipes.find((x) => x.id === rid);
        if (!r) return;
        r.ingredients.forEach((ing) => {
          const key = ing.name.toLowerCase();
          if (!aggregated[key]) aggregated[key] = [];
          aggregated[key].push({ quantity: ing.quantity, unit: ing.unit });
        });
      });
    });
    return aggregated;
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Recipes</h1>
            <p className="text-sm text-muted-foreground">
              Manage your recipes & plan weekly menus
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search recipes..."
              value={query}
              onChange={(e: any) => setQuery(e.target.value)}
              className="w-64"
            />
            <Select
              value={typeFilter}
              onValueChange={(v: any) => setTypeFilter(v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_RECIPE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={favoritesOnly ? "default" : "outline"}
              onClick={() => setFavoritesOnly((s) => !s)}
            >
              {favoritesOnly ? (
                <Star className="h-4 w-4" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}{" "}
              Favorites
            </Button>
            <Button
              onClick={openNew}
              className="gap-2 bg-primary text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> New Recipe
            </Button>
            <Dialog open={plannerOpen} onOpenChange={setPlannerOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" /> Weekly Planner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[70vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Weekly Menu Planner</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {Object.keys(planner).map((day) => (
                    <div key={day} className="border p-3 rounded-md">
                      <h4 className="font-semibold mb-2">{day}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {Object.keys(planner[day]).map((meal) => (
                          <div key={meal} className="flex items-center gap-2">
                            <Label className="w-24">{meal}</Label>
                            <Select
                              value={planner[day][meal] || ""}
                              onValueChange={(val: any) =>
                                assignToPlanner(
                                  day,
                                  meal,
                                  val === "__none__" ? undefined : val
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select recipe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">
                                  -- none --
                                </SelectItem>
                                {recipes.map((r) => (
                                  <SelectItem key={r.id} value={r.id}>
                                    {r.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => {
                        const selectedDays = Object.keys(planner);
                        const list = generateShoppingList(selectedDays);
                        // show simple export as CSV
                        const csvLines: string[] = ["Ingredient,Quantities"];
                        Object.entries(list).forEach(([name, vals]) => {
                          csvLines.push(
                            `${name},"${vals.map((v) => v.quantity + " " + v.unit).join(" + ")}"`
                          );
                        });
                        const blob = new Blob([csvLines.join("\n")], {
                          type: "text/csv",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "shopping-from-planner.csv";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" /> Generate Shopping List
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((r) => (
            <motion.div key={r.id} whileHover={{ y: -4 }} className="group">
              <Card className="overflow-hidden">
                <div className="relative">
                  {r.imageUrl ? (
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(r.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-card/60"
                  >
                    {r.favorite ? (
                      <Star className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <StarOff className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg">{r.name}</h3>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(r)}
                      >
                        <Edit2 />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteRecipe(r.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.mealTypes.map((m) => (
                      <span
                        key={m}
                        className="text-xs px-2 py-1 bg-muted/10 rounded-full"
                      >
                        {m}
                      </span>
                    ))}
                    {r.recipeType && (
                      <span className="text-xs px-2 py-1 bg-muted/10 rounded-full">
                        {r.recipeType}
                      </span>
                    )}
                  </div>

                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="details">
                      <AccordionTrigger>Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="mb-3">
                          <h4 className="font-medium">Ingredients</h4>
                          <ul className="list-disc pl-5 mt-2 text-sm">
                            {r.ingredients.map((ing) => (
                              <li key={ing.id}>
                                {ing.quantity} {ing.unit} — {ing.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mb-3">
                          <h4 className="font-medium">Instructions</h4>
                          <p className="text-sm mt-2 whitespace-pre-wrap">
                            {r.instructions}
                          </p>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <div>Prep: {r.prepTime}m</div>
                          <div>Cook: {r.cookTime}m</div>
                          <div>Serves: {r.servings}</div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Editor Dialog */}
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Recipe" : "Add Recipe"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e: any) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Meal Types</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DEFAULT_MEAL_TYPES.map((m) => (
                      <label key={m} className="inline-flex items-center gap-2">
                        <Checkbox
                          checked={form.mealTypes.includes(m)}
                          onCheckedChange={(v: any) => {
                            setForm((s) => ({
                              ...s,
                              mealTypes: v
                                ? [...s.mealTypes, m]
                                : s.mealTypes.filter((x) => x !== m),
                            }));
                          }}
                        />
                        <span className="text-sm">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Recipe Type</Label>
                  <Input
                    value={form.recipeType}
                    onChange={(e: any) =>
                      setForm({ ...form, recipeType: e.target.value })
                    }
                    placeholder="e.g., Vegan, Dessert"
                  />
                </div>
              </div>

              <div>
                <Label>Ingredients</Label>
                <div className="space-y-2 mt-2">
                  {form.ingredients.map((ing, idx) => (
                    <div
                      key={ing.id}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <Input
                        className="col-span-5"
                        value={ing.name}
                        onChange={(e: any) => {
                          const copy = [...form.ingredients];
                          copy[idx] = { ...copy[idx], name: e.target.value };
                          setForm({ ...form, ingredients: copy });
                        }}
                        placeholder="Name"
                      />
                      <Input
                        className="col-span-3"
                        value={ing.quantity}
                        onChange={(e: any) => {
                          const copy = [...form.ingredients];
                          copy[idx] = {
                            ...copy[idx],
                            quantity: e.target.value,
                          };
                          setForm({ ...form, ingredients: copy });
                        }}
                        placeholder="Qty"
                      />
                      <Input
                        className="col-span-3"
                        value={ing.unit}
                        onChange={(e: any) => {
                          const copy = [...form.ingredients];
                          copy[idx] = { ...copy[idx], unit: e.target.value };
                          setForm({ ...form, ingredients: copy });
                        }}
                        placeholder="Unit"
                      />
                      <Button
                        variant="ghost"
                        className="col-span-1"
                        onClick={() => {
                          setForm((s) => ({
                            ...s,
                            ingredients: s.ingredients.filter(
                              (x) => x.id !== ing.id
                            ),
                          }));
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() =>
                      setForm((s) => ({
                        ...s,
                        ingredients: [
                          ...s.ingredients,
                          {
                            id: Date.now().toString(),
                            name: "",
                            quantity: "",
                            unit: "",
                          },
                        ],
                      }))
                    }
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4" /> Add Ingredient
                  </Button>
                </div>
              </div>

              <div>
                <Label>Instructions</Label>
                <Textarea
                  value={form.instructions}
                  onChange={(e: any) =>
                    setForm({ ...form, instructions: e.target.value })
                  }
                  className="min-h-28"
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label>Prep (min)</Label>
                  <Input
                    type="number"
                    value={form.prepTime}
                    onChange={(e: any) =>
                      setForm({
                        ...form,
                        prepTime: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Cook (min)</Label>
                  <Input
                    type="number"
                    value={form.cookTime}
                    onChange={(e: any) =>
                      setForm({
                        ...form,
                        cookTime: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Servings</Label>
                  <Input
                    type="number"
                    value={form.servings}
                    onChange={(e: any) =>
                      setForm({
                        ...form,
                        servings: Number(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={form.imageUrl}
                    onChange={(e: any) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e: any) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditorOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveRecipe}
                  className="bg-primary text-primary-foreground"
                >
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
