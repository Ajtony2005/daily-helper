import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Save, Edit2, Trash2, Heart, CalendarDays } from "lucide-react";
import Loading from "@/pages/Loading";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const recipeTypes = [
  "Soup",
  "Main Dish",
  "Meat-Free",
  "Vegan",
  "Gluten-Free",
  "Other",
];

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
};

type Recipe = {
  id: string;
  name: string;
  mealTypes: string[];
  recipeTypes: string[];
  ingredients: Ingredient[];
  instructions: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  favorite: boolean;
  notes: string;
};

type WeeklyMenu = {
  [day: string]: {
    [meal: string]: string; // Recipe ID
  };
};

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [showEditRecipe, setShowEditRecipe] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [form, setForm] = useState({
    name: "",
    mealTypes: [] as string[],
    recipeTypes: [] as string[],
    ingredients: [] as Ingredient[],
    newIngredientName: "",
    newIngredientQuantity: "",
    newIngredientUnit: "",
    instructions: "",
    prepTime: "",
    cookTime: "",
    servings: "4",
    notes: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMealType, setFilterMealType] = useState("All");
  const [filterRecipeType, setFilterRecipeType] = useState("All");
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>({});
  const [showMenuPlanner, setShowMenuPlanner] = useState(false);
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);
  const buttonControls = useAnimation();

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { name: string; value: any }
  ) => {
    if ("target" in e) {
      setForm({ ...form, [e.target.name]: e.target.value });
    } else {
      setForm({ ...form, [e.name]: e.value });
    }
    setError("");
  };

  const handleToggleMealType = (type: string) => {
    setForm({
      ...form,
      mealTypes: form.mealTypes.includes(type)
        ? form.mealTypes.filter((t) => t !== type)
        : [...form.mealTypes, type],
    });
  };

  const handleToggleRecipeType = (type: string) => {
    setForm({
      ...form,
      recipeTypes: form.recipeTypes.includes(type)
        ? form.recipeTypes.filter((t) => t !== type)
        : [...form.recipeTypes, type],
    });
  };

  const handleAddIngredient = () => {
    if (!form.newIngredientName.trim() || !form.newIngredientQuantity.trim()) {
      setError("Ingredient name and quantity are required.");
      return;
    }
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: form.newIngredientName.trim(),
      quantity: form.newIngredientQuantity.trim(),
      unit: form.newIngredientUnit.trim(),
    };
    setForm({
      ...form,
      ingredients: [...form.ingredients, newIngredient],
      newIngredientName: "",
      newIngredientQuantity: "",
      newIngredientUnit: "",
    });
  };

  const handleDeleteIngredient = (id: string) => {
    setForm({
      ...form,
      ingredients: form.ingredients.filter((ing) => ing.id !== id),
    });
  };

  const handleAddRecipe = async () => {
    if (
      !form.name.trim() ||
      form.ingredients.length === 0 ||
      !form.instructions.trim()
    ) {
      setError("Name, ingredients, and instructions are required.");
      return;
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: form.name.trim(),
      mealTypes: form.mealTypes,
      recipeTypes: form.recipeTypes,
      ingredients: form.ingredients,
      instructions: form.instructions.trim(),
      prepTime: form.prepTime.trim(),
      cookTime: form.cookTime.trim(),
      servings: parseInt(form.servings, 10),
      favorite: false,
      notes: form.notes.trim(),
    };
    setRecipes([...recipes, newRecipe]);
    resetForm();
    setShowAddRecipe(false);
    setError("");
    setIsLoading(false);
  };

  const handleEditRecipe = async () => {
    if (
      !editRecipe ||
      !form.name.trim() ||
      form.ingredients.length === 0 ||
      !form.instructions.trim()
    ) {
      setError("Name, ingredients, and instructions are required.");
      return;
    }
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    const updatedRecipe = {
      ...editRecipe,
      name: form.name.trim(),
      mealTypes: form.mealTypes,
      recipeTypes: form.recipeTypes,
      ingredients: form.ingredients,
      instructions: form.instructions.trim(),
      prepTime: form.prepTime.trim(),
      cookTime: form.cookTime.trim(),
      servings: parseInt(form.servings, 10),
      notes: form.notes.trim(),
    };
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === editRecipe.id ? updatedRecipe : recipe
      )
    );
    resetForm();
    setEditRecipe(null);
    setShowEditRecipe(false);
    setError("");
    setIsLoading(false);
  };

  const resetForm = () => {
    setForm({
      name: "",
      mealTypes: [],
      recipeTypes: [],
      ingredients: [],
      newIngredientName: "",
      newIngredientQuantity: "",
      newIngredientUnit: "",
      instructions: "",
      prepTime: "",
      cookTime: "",
      servings: "4",
      notes: "",
    });
  };

  const handleOpenEditRecipe = (recipe: Recipe) => {
    setEditRecipe(recipe);
    setForm({
      name: recipe.name,
      mealTypes: recipe.mealTypes,
      recipeTypes: recipe.recipeTypes,
      ingredients: recipe.ingredients,
      newIngredientName: "",
      newIngredientQuantity: "",
      newIngredientUnit: "",
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings.toString(),
      notes: recipe.notes,
    });
    setShowEditRecipe(true);
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe
      )
    );
  };

  const getFilteredRecipes = () => {
    const search = searchQuery.toLowerCase();
    return recipes.filter(
      (recipe) =>
        (filterMealType === "All" ||
          recipe.mealTypes.includes(filterMealType)) &&
        (filterRecipeType === "All" ||
          recipe.recipeTypes.includes(filterRecipeType)) &&
        (recipe.name.toLowerCase().includes(search) ||
          recipe.ingredients.some((ing) =>
            ing.name.toLowerCase().includes(search)
          ))
    );
  };

  const handlePlanMenu = () => {
    setShowMenuPlanner(true);
  };

  const handleAddToMenu = (day: string, meal: string, recipeId: string) => {
    setWeeklyMenu({
      ...weeklyMenu,
      [day]: {
        ...(weeklyMenu[day] || {}),
        [meal]: recipeId,
      },
    });
  };

  const generateShoppingList = () => {
    const list: { [key: string]: { quantity: number; unit: string } } = {};
    Object.values(weeklyMenu).forEach((dayMeals) => {
      Object.values(dayMeals).forEach((recipeId) => {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (recipe) {
          recipe.ingredients.forEach((ing) => {
            const scaledQuantity =
              parseFloat(ing.quantity) * (recipe.servings / 4); // Scale based on servings (assuming base is 4)
            if (list[ing.name]) {
              list[ing.name].quantity += scaledQuantity;
            } else {
              list[ing.name] = { quantity: scaledQuantity, unit: ing.unit };
            }
          });
        }
      });
    });
    setShoppingList(
      Object.entries(list).map(([name, { quantity, unit }]) => ({
        id: name,
        name,
        quantity: quantity.toString(),
        unit,
      }))
    );
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)",
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      boxShadow: "none",
      transition: { duration: 0.2 },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl relative z-10"
      >
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardContent className="p-10 relative z-10">
            <CardTitle className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              Recipes
            </CardTitle>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-6"
            >
              <Button
                type="button"
                disabled={isLoading}
                onClick={() => setShowAddRecipe(true)}
                className={`w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  <Plus className="w-5 h-5" />
                  Add Recipe
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </Button>
            </motion.div>
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Search recipes or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
              />
              <Select value={filterMealType} onValueChange={setFilterMealType}>
                <SelectTrigger className="w-48 bg-gray-800/30 text-white border border-blue-600/40">
                  <SelectValue placeholder="Filter by meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {mealTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterRecipeType}
                onValueChange={setFilterRecipeType}
              >
                <SelectTrigger className="w-48 bg-gray-800/30 text-white border border-blue-600/40">
                  <SelectValue placeholder="Filter by recipe type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {recipeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handlePlanMenu}
              className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 mb-6"
            >
              <span className="flex items-center justify-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Plan Weekly Menu
              </span>
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredRecipes().map((recipe) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/30 p-4 rounded-xl border border-blue-600/40 shadow-inner"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-lg text-white">
                      {recipe.name}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => handleOpenEditRecipe(recipe)}
                        className="bg-blue-600 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                          <Edit2 className="w-4 h-4" />
                        </span>
                        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="bg-red-500 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                          <Trash2 className="w-4 h-4" />
                        </span>
                        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleToggleFavorite(recipe.id)}
                        className="bg-transparent text-red-500 p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            recipe.favorite ? "fill-red-500" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    Meal Types: {recipe.mealTypes.join(", ") || "None"}
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    Recipe Types: {recipe.recipeTypes.join(", ") || "None"}
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    Prep Time: {recipe.prepTime || "N/A"}
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    Cook Time: {recipe.cookTime || "N/A"}
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    Servings: {recipe.servings}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-blue-300 mb-2">
                      Ingredients
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-white">
                      {recipe.ingredients.map((ing) => (
                        <li key={ing.id}>
                          {ing.quantity} {ing.unit} {ing.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-blue-300 mb-2">
                      Instructions
                    </h4>
                    <p className="text-white">{recipe.instructions}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-blue-300 mb-2">
                      Notes
                    </h4>
                    <p className="text-white">{recipe.notes || "No notes"}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Recipe Modal */}
      {(showAddRecipe || showEditRecipe) && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowAddRecipe(false);
            setShowEditRecipe(false);
          }}
        >
          <motion.div
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                {showAddRecipe ? "Add Recipe" : "Edit Recipe"}
              </CardTitle>
              <motion.form className="space-y-6">
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="name"
                    animate={
                      form.name ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Name
                  </motion.label>
                  <motion.input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Recipe name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <Label className="text-blue-300">Meal Types</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mealTypes.map((type) => (
                      <div key={type} className="flex items-center gap-1">
                        <Checkbox
                          checked={form.mealTypes.includes(type)}
                          onCheckedChange={() => handleToggleMealType(type)}
                        />
                        <span className="text-white">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Label className="text-blue-300">Recipe Types</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recipeTypes.map((type) => (
                      <div key={type} className="flex items-center gap-1">
                        <Checkbox
                          checked={form.recipeTypes.includes(type)}
                          onCheckedChange={() => handleToggleRecipeType(type)}
                        />
                        <span className="text-white">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Label className="text-blue-300">Ingredients</Label>
                  <div className="space-y-2 mt-2">
                    {form.ingredients.map((ing) => (
                      <div
                        key={ing.id}
                        className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-xl"
                      >
                        <span className="text-white flex-1">
                          {ing.quantity} {ing.unit} {ing.name}
                        </span>
                        <Button
                          type="button"
                          onClick={() => handleDeleteIngredient(ing.id)}
                          className="bg-red-500 text-white p-1 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                            <Trash2 className="w-4 h-4" />
                          </span>
                          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Input
                      name="newIngredientQuantity"
                      value={form.newIngredientQuantity}
                      onChange={handleChange}
                      placeholder="Quantity"
                      className="bg-gray-800/30 text-white border border-blue-600/40"
                    />
                    <Input
                      name="newIngredientUnit"
                      value={form.newIngredientUnit}
                      onChange={handleChange}
                      placeholder="Unit"
                      className="bg-gray-800/30 text-white border border-blue-600/40"
                    />
                    <Input
                      name="newIngredientName"
                      value={form.newIngredientName}
                      onChange={handleChange}
                      placeholder="Name"
                      className="bg-gray-800/30 text-white border border-blue-600/40"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddIngredient}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl mt-2"
                  >
                    Add Ingredient
                  </Button>
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="instructions"
                    animate={
                      form.instructions
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Instructions
                  </motion.label>
                  <motion.textarea
                    id="instructions"
                    name="instructions"
                    value={form.instructions}
                    onChange={handleChange}
                    placeholder="Step-by-step instructions"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 min-h-[150px]"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="prepTime"
                      animate={
                        form.prepTime
                          ? { y: -25, scale: 0.9 }
                          : { y: 0, scale: 1 }
                      }
                    >
                      Prep Time
                    </motion.label>
                    <motion.input
                      id="prepTime"
                      type="text"
                      name="prepTime"
                      value={form.prepTime}
                      onChange={handleChange}
                      placeholder="e.g., 15 min"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>
                  <div className="relative">
                    <motion.label
                      className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                      htmlFor="cookTime"
                      animate={
                        form.cookTime
                          ? { y: -25, scale: 0.9 }
                          : { y: 0, scale: 1 }
                      }
                    >
                      Cook Time
                    </motion.label>
                    <motion.input
                      id="cookTime"
                      type="text"
                      name="cookTime"
                      value={form.cookTime}
                      onChange={handleChange}
                      placeholder="e.g., 30 min"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                    />
                  </div>
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="servings"
                    animate={
                      form.servings
                        ? { y: -25, scale: 0.9 }
                        : { y: 0, scale: 1 }
                    }
                  >
                    Servings
                  </motion.label>
                  <motion.input
                    id="servings"
                    type="number"
                    name="servings"
                    value={form.servings}
                    onChange={handleChange}
                    placeholder="e.g., 4"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                    htmlFor="notes"
                    animate={
                      form.notes ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                    }
                  >
                    Notes
                  </motion.label>
                  <motion.textarea
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Additional notes or variations"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50 min-h-[100px]"
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                  />
                </div>
                {error && (
                  <motion.p
                    id="form-error"
                    aria-live="assertive"
                    className="text-red-400 mb-6 text-center font-medium drop-shadow animate-pulse"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {error}
                  </motion.p>
                )}
                <motion.div animate={buttonControls}>
                  <Button
                    type="button"
                    disabled={isLoading}
                    onClick={showAddRecipe ? handleAddRecipe : handleEditRecipe}
                    className={`w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                        <Save className="w-5 h-5" />
                        {showAddRecipe ? "Add Recipe" : "Save Changes"}
                      </span>
                    )}
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                  </Button>
                </motion.div>
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setShowAddRecipe(false);
                    setShowEditRecipe(false);
                    resetForm();
                  }}
                  className={`w-full bg-gray-800/30 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </Button>
              </motion.form>
            </CardContent>
          </motion.div>
        </motion.div>
      )}

      {/* Menu Planner Modal */}
      {showMenuPlanner && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowMenuPlanner(false)}
        >
          <motion.div
            className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
            <CardContent className="p-10 relative z-10">
              <CardTitle className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Weekly Menu Planner
              </CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div key={day} className="space-y-2">
                    <h4 className="text-lg font-semibold text-white">{day}</h4>
                    {mealTypes.map((meal) => (
                      <Select
                        key={meal}
                        value={weeklyMenu[day]?.[meal] || ""}
                        onValueChange={(value) =>
                          handleAddToMenu(day, meal, value)
                        }
                      >
                        <SelectTrigger className="bg-gray-800/30 text-white border border-blue-600/40">
                          <SelectValue placeholder={meal} />
                        </SelectTrigger>
                        <SelectContent>
                          {recipes.map((recipe) => (
                            <SelectItem key={recipe.id} value={recipe.id}>
                              {recipe.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ))}
                  </div>
                ))}
              </div>
              <Button
                onClick={generateShoppingList}
                className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 mt-6"
              >
                Generate Shopping List
              </Button>
              {shoppingList.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xl font-bold text-white mb-2">
                    Shopping List
                  </h4>
                  <ul className="space-y-2">
                    {shoppingList.map((item) => (
                      <li
                        key={item.id}
                        className="bg-gray-800/30 p-2 rounded-xl text-white"
                      >
                        {item.quantity} {item.unit} {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Recipes;
