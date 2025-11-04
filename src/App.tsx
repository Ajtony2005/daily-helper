import type React from "react";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { JotaiProvider } from "@/store/JotaiProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/layout/Header";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import SpendingTracker from "./features/finance/SpendingTracker";
import Shopping from "./features/shopping/Shopping";
import Inventory from "./features/inventory/Inventory";
import FoodTracker from "./features/meals/Foodtracker";
import Wellness from "./features/wellness/Wellness";
import Recipes from "./features/recipes/Recipes";
import ToDo from "./features/todo/ToDo";
import Wishlist from "./features/wishlist/wishlist";
import Dashboard from "./features/dashboard/Dashboard";
import GoalsHabits from "./features/goals/GoalsHabits";
import Analytics from "./features/analytics/Analytics";
import Journal from "./features/journal/Journal";
import Notifications from "./features/notifications/Notifications";
import Onboarding from "./features/onboarding/Onboarding";

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <JotaiProvider>
      <AuthProvider>
        <div className="min-h-screen w-screen bg-background text-on-background transition-colors duration-300">
          <Header isDark={isDark} toggleTheme={toggleTheme} />

          {/* Ensure main content sits below the fixed header */}
          <main className="pt-20 md:pt-24 pb-12">
            <AnimatePresence mode="wait">
              <Routes>
                <Route
                  path="/"
                  element={
                    <PageWrapper>
                      <Home />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <Dashboard />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PageWrapper>
                      <Login />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PageWrapper>
                      <Register />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/finance"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <SpendingTracker />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shopping"
                  element={
                    <PageWrapper>
                      <Shopping />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <PageWrapper>
                      <Inventory />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/meals"
                  element={
                    <PageWrapper>
                      <FoodTracker />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/todo"
                  element={
                    <PageWrapper>
                      <ToDo />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/wellness"
                  element={
                    <PageWrapper>
                      <Wellness />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/recipes"
                  element={
                    <PageWrapper>
                      <Recipes />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/goals"
                  element={
                    <PageWrapper>
                      <GoalsHabits />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <PageWrapper>
                      <Analytics />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/journal"
                  element={
                    <PageWrapper>
                      <Journal />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/onboarding"
                  element={
                    <PageWrapper>
                      <Onboarding />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <PageWrapper>
                      <Notifications />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <Profile />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <PageWrapper>
                      <Wishlist />
                    </PageWrapper>
                  }
                />
                <Route
                  path="*"
                  element={
                    <PageWrapper>
                      <NotFound />
                    </PageWrapper>
                  }
                />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </AuthProvider>
    </JotaiProvider>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
