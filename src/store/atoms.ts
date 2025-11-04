import { atomWithStorage } from "jotai/utils";

// Theme
export const isDarkAtom = atomWithStorage<boolean>("theme", false);

// User preferences from onboarding
export interface OnboardingData {
  name?: string;
  theme?: "light" | "dark";
  notifications?: boolean;
  goal?: string;
  diets?: string[];
  financeCategories?: string[];
  selectedFeatures?: string[];
}

export const onboardingAtom = atomWithStorage<OnboardingData>(
  "dh-onboarding",
  {}
);

// Language
export type Language = "en" | "hu";
export const languageAtom = atomWithStorage<Language>("language", "en");

// Notifications
export interface Reminder {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  reminders: Reminder[];
}

export const notificationsAtom = atomWithStorage<NotificationSettings>(
  "dh-notifications",
  { enabled: true, reminders: [] }
);

// Journal entries
export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: number;
  tags: string[];
  createdAt: string;
}

export const journalEntriesAtom = atomWithStorage<JournalEntry[]>(
  "dh-journal-entries",
  []
);

// Finance - Accounts and Transactions
export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: "spend" | "income" | "transfer";
  accountId: string;
  toAccountId?: string | null;
  category?: string;
  amount: number;
  description?: string;
}

export const accountsAtom = atomWithStorage<Account[]>("finance-accounts", []);
export const transactionsAtom = atomWithStorage<Transaction[]>(
  "finance-transactions",
  []
);

// ToDo
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  description?: string;
}

export const tasksAtom = atomWithStorage<Task[]>("todo-tasks", []);
export const taskCategoriesAtom = atomWithStorage<string[]>("todo-categories", [
  "Personal",
  "Work",
  "School",
]);

// Inventory
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  categoryId?: string;
  locationId?: string;
  expiryDate?: string;
  notes?: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  color?: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
}

export const inventoryItemsAtom = atomWithStorage<InventoryItem[]>(
  "inventory-items",
  []
);
export const inventoryCategoriesAtom = atomWithStorage<InventoryCategory[]>(
  "inventory-categories",
  []
);
export const inventoryLocationsAtom = atomWithStorage<InventoryLocation[]>(
  "inventory-locations",
  []
);

// Shopping List
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  store?: string;
  purchased: boolean;
  price?: number;
}

export const shoppingItemsAtom = atomWithStorage<ShoppingItem[]>(
  "shopping-items",
  []
);

// Meals / Food Tracker
export interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: string[];
  photo?: string;
}

export const mealsAtom = atomWithStorage<Meal[]>("meals", []);

// Recipes
export interface Recipe {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
  ingredients: Array<{ name: string; amount: string; unit: string }>;
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  tags?: string[];
}

export const recipesAtom = atomWithStorage<Recipe[]>("recipes", []);

// Wellness
export interface Exercise {
  id: string;
  type: string;
  duration: number;
  location: string;
  date: string;
  notes?: string;
}

export interface WaterIntake {
  date: string;
  glasses: number;
}

export const exercisesAtom = atomWithStorage<Exercise[]>(
  "wellness-exercises",
  []
);
export const waterIntakeAtom = atomWithStorage<WaterIntake[]>(
  "wellness-water",
  []
);

// Wishlist
export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  priority: "low" | "medium" | "high";
  price?: number;
  url?: string;
  purchased: boolean;
  notes?: string;
}

export const wishlistItemsAtom = atomWithStorage<WishlistItem[]>(
  "wishlist-items",
  []
);

// Goals & Habits
export interface Habit {
  id: string;
  title: string;
  icon: string;
  streak: number;
  completedDays: string[];
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
}

export const habitsAtom = atomWithStorage<Habit[]>("habits", []);
export const goalsAtom = atomWithStorage<Goal[]>("goals", []);
