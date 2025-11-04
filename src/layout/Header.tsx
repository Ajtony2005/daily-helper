"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  CheckSquare,
  CreditCard,
  ShoppingCart,
  UtensilsCrossed,
  Book,
  FileText,
  Heart,
  Package,
  Star,
  BarChart,
  Award,
  Activity,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  isDark?: boolean;
  toggleTheme?: () => void;
}

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/analytics", label: "Analytics", icon: BarChart },
  { href: "/todo", label: "To-Do", icon: CheckSquare },
  { href: "/finance", label: "Finance", icon: CreditCard },
  { href: "/shopping", label: "Shopping", icon: ShoppingCart },
  { href: "/meals", label: "Meals", icon: UtensilsCrossed },
  { href: "/recipes", label: "Recipes", icon: Book },
  { href: "/journal", label: "Journal", icon: FileText },
  { href: "/goals", label: "Goals", icon: Award },
  { href: "/wellness", label: "Wellness", icon: Heart },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Star },
];

export default function Header({
  isDark: isDarkProp,
  toggleTheme,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(Boolean(isDarkProp));
  const location = useLocation();
  const navigate = useNavigate();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [notifCount, setNotifCount] = useState<number>(0);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (typeof isDarkProp === "boolean") setIsDark(isDarkProp);
  }, [isDarkProp]);

  useEffect(() => {
    if (!toggleTheme) {
      const stored = localStorage.getItem("dh-theme");
      if (stored) setIsDark(stored === "dark");
    }
  }, [toggleTheme]);

  useEffect(() => {
    if (!toggleTheme) {
      localStorage.setItem("dh-theme", isDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [isDark, toggleTheme]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function updateNotifCount() {
    try {
      const raw = localStorage.getItem("dh-notifications");
      if (!raw) {
        setNotifCount(0);
        return;
      }
      const parsed = JSON.parse(raw) as {
        enabled?: boolean;
        reminders?: Array<{ enabled?: boolean }>;
      };
      const count = Array.isArray(parsed.reminders)
        ? parsed.reminders.filter((r) => r && r.enabled).length
        : 0;
      setNotifCount(count);
    } catch {
      setNotifCount(0);
    }
  }

  useEffect(() => {
    updateNotifCount();
    function onStorage(e: StorageEvent) {
      if (e.key === "dh-notifications") updateNotifCount();
    }
    function onVisibility() {
      updateNotifCount();
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener(
      "dh-notifications-updated",
      updateNotifCount as EventListener
    );
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "dh-notifications-updated",
        updateNotifCount as EventListener
      );
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  function openOverlay() {
    setIsOpen(true);
    setTimeout(() => firstLinkRef.current?.focus(), 120);
  }

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 w-full")}
      aria-label="Main header"
    >
      <div className="glass-nav mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-linear-to-r from-primary to-secondary text-white font-bold text-lg hover-lift">
            DH
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-semibold">DailyHelper</span>
            <span className="text-xs text-muted">Plan. Track. Improve.</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {currentUser && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, idx) => {
                const Icon = link.icon;
                const isActive =
                  location.pathname === link.href ||
                  (link.href !== "/" &&
                    location.pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    ref={idx === 0 ? firstLinkRef : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "px-3 py-2 rounded-md flex items-center gap-2 text-sm",
                      isActive
                        ? "bg-accent/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentUser && (
            <Link
              to="/notifications"
              className="relative p-2 rounded-md hover:bg-background/10"
            >
              <Bell className="w-5 h-5" aria-hidden />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-destructive rounded-full">
                  {notifCount}
                </span>
              )}
            </Link>
          )}

          <button
            aria-label="Toggle theme"
            onClick={() => {
              if (typeof toggleTheme === "function") toggleTheme();
              else setIsDark((s) => !s);
            }}
            className="p-2 rounded-md hover:bg-background/10"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/10"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/10 text-destructive"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/10"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-sm">Login</span>
            </Link>
          )}

          <button
            aria-expanded={isOpen}
            aria-controls="main-navigation"
            onClick={() => (isOpen ? setIsOpen(false) : openOverlay())}
            className="p-2 rounded-md md:hidden"
            aria-label="Open menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full screen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="max-w-5xl mx-auto h-full grid grid-cols-1 md:grid-cols-2">
              <motion.div
                initial={{ x: -40 }}
                animate={{ x: 0 }}
                exit={{ x: -40 }}
                className="p-8 flex flex-col gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-r from-primary to-secondary text-white font-bold">
                    DH
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">DailyHelper</h3>
                    <p className="text-sm text-muted">
                      Quick links & navigation
                    </p>
                  </div>
                </div>

                <nav id="main-navigation" className="flex-1 grid gap-3">
                  {currentUser &&
                    navLinks.map((link, idx) => {
                      const Icon = link.icon;
                      const isActive =
                        location.pathname === link.href ||
                        (link.href !== "/" &&
                          location.pathname.startsWith(link.href));
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          ref={idx === 0 ? firstLinkRef : undefined}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-md text-lg",
                            isActive
                              ? "bg-accent/10 text-foreground"
                              : "text-on-surface hover:bg-accent/10"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}

                  {!currentUser && (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-md text-lg text-on-surface hover:bg-accent/10"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                  )}
                </nav>

                <div className="mt-auto flex flex-col gap-2">
                  {currentUser && (
                    <>
                      <Link
                        to="/profile"
                        className="btn-secondary"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="btn-outline text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 40 }}
                animate={{ x: 0 }}
                exit={{ x: 40 }}
                className="p-8 border-l border-border/20 hidden md:flex flex-col"
              >
                {currentUser ? (
                  <>
                    <h4 className="font-semibold">Quick actions</h4>
                    <div className="mt-4 grid gap-3">
                      <Link
                        to="/shopping"
                        className="btn-outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Open Shopping
                      </Link>
                      <Link
                        to="/meals"
                        className="btn-outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Log a Meal
                      </Link>
                      <Link
                        to="/finance"
                        className="btn-outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Add Transaction
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold">Get Started</h4>
                    <div className="mt-4 grid gap-3">
                      <Link
                        to="/login"
                        className="btn-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="btn-outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
