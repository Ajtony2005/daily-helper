import { useAtom } from "jotai";
import {
  isDarkAtom,
  languageAtom,
  onboardingAtom,
  notificationsAtom,
  journalEntriesAtom,
  accountsAtom,
  transactionsAtom,
  tasksAtom,
  taskCategoriesAtom,
  inventoryItemsAtom,
  inventoryCategoriesAtom,
  inventoryLocationsAtom,
  shoppingItemsAtom,
  mealsAtom,
  recipesAtom,
  exercisesAtom,
  waterIntakeAtom,
  wishlistItemsAtom,
  habitsAtom,
  goalsAtom,
} from "./atoms";

// Theme
export const useTheme = () => useAtom(isDarkAtom);

// Language
export const useLanguage = () => useAtom(languageAtom);

// Onboarding
export const useOnboarding = () => useAtom(onboardingAtom);

// Notifications
export const useNotifications = () => useAtom(notificationsAtom);

// Journal
export const useJournalEntries = () => useAtom(journalEntriesAtom);

// Finance
export const useAccounts = () => useAtom(accountsAtom);
export const useTransactions = () => useAtom(transactionsAtom);

// ToDo
export const useTasks = () => useAtom(tasksAtom);
export const useTaskCategories = () => useAtom(taskCategoriesAtom);

// Inventory
export const useInventoryItems = () => useAtom(inventoryItemsAtom);
export const useInventoryCategories = () => useAtom(inventoryCategoriesAtom);
export const useInventoryLocations = () => useAtom(inventoryLocationsAtom);

// Shopping
export const useShoppingItems = () => useAtom(shoppingItemsAtom);

// Meals
export const useMeals = () => useAtom(mealsAtom);

// Recipes
export const useRecipes = () => useAtom(recipesAtom);

// Wellness
export const useExercises = () => useAtom(exercisesAtom);
export const useWaterIntake = () => useAtom(waterIntakeAtom);

// Wishlist
export const useWishlistItems = () => useAtom(wishlistItemsAtom);

// Goals & Habits
export const useHabits = () => useAtom(habitsAtom);
export const useGoals = () => useAtom(goalsAtom);
