import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/layout/Navbar";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Loading from "@/pages/Loading";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SpendingTracker from "./features/finance/SpendingTracker";
import Shopping from "./features/shopping/Shopping";
import Inventory from "./features/inventory/Inventory";
import FoodTracker from "./features/meals/Foodtracker";
import Wellness from "./features/wellness/Wellness";
import Recipes from "./features/recipes/Recipes";
import ToDo from "./features/todo/ToDo";
import Wislist from "./features/wishlist/Wishlist";

export default function App() {
  const [isDark] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Router>
      <Navbar />
      <main className="pt-8 px-4 max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/finance" element={<SpendingTracker />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/meals" element={<FoodTracker />} />
          <Route path="/todo" element={<ToDo />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/wishlist" element={<Wislist />} />
        </Routes>
      </main>
    </Router>
  );
}
