import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Finance", path: "/finance" },
  { name: "Inventory", path: "/inventory" },
  { name: "Shopping", path: "/shopping" },
  { name: "Meals", path: "/meals" },
  { name: "To-Do", path: "/todo" },
  { name: "Recipes", path: "/recipes" },
  { name: "Wellness", path: "/wellness" },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-appBackground dark:bg-appBackground-dark text-card-foreground dark:text-card-darkForeground shadow-card sticky top-0 z-50 font-sans backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            className="drop-shadow-neon-secondary"
          >
            <circle cx="16" cy="16" r="16" fill="url(#logo-gradient)" />
            <text
              x="16"
              y="21"
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#fff"
            >
              DH
            </text>
            <defs>
              <linearGradient
                id="logo-gradient"
                x1="0"
                y1="0"
                x2="32"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
            DailyHelper
          </span>
        </Link>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          className="md:hidden p-2 rounded-full bg-card-glass hover:bg-card-glass-dark transition-colors duration-200 shadow-glass"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-primary-500 dark:text-primary-300"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex gap-2 md:gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-primary-100 dark:hover:bg-primary-800 hover:text-primary-700 dark:hover:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                  isActive
                    ? "bg-primary-500 text-white dark:bg-primary-600 dark:text-white shadow-soft"
                    : "text-card-foreground dark:text-card-darkForeground"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          {/* Theme Toggle Button (Desktop) */}
          <button
            className="ml-4 p-2 rounded-full bg-card-glass hover:bg-card-glass-dark transition-colors duration-200 shadow-glass"
            aria-label="Toggle theme"
            role="switch"
            aria-checked={isDark}
            onClick={toggleTheme}
          >
            {isDark ? (
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-primary-500 dark:text-primary-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-primary-500 dark:text-primary-300"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 4.05l-.71.71M21 12h-1M4 12H3m16.24 4.24l-.71-.71M6.34 17.66l-.71-.71"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-appBackground dark:bg-appBackground-dark shadow-card px-4 py-6 animate-slide-in-right">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-primary-100 dark:hover:bg-primary-800 hover:text-primary-700 dark:hover:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-left ${
                    isActive
                      ? "bg-primary-500 text-white dark:bg-primary-600 dark:text-white shadow-soft"
                      : "text-card-foreground dark:text-card-darkForeground"
                  }`
                }
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                {item.name}
              </NavLink>
            ))}
            {/* Theme Toggle Button (Mobile) */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card-glass hover:bg-card-glass-dark transition-colors duration-200 shadow-glass text-left text-card-foreground dark:text-card-darkForeground"
              aria-label="Toggle theme"
              role="switch"
              aria-checked={isDark}
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false); // Close menu on theme toggle
              }}
            >
              {isDark ? (
                <>
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-primary-500 dark:text-primary-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                    />
                  </svg>
                  Sötét mód
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-primary-500 dark:text-primary-300"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 4.05l-.71.71M21 12h-1M4 12H3m16.24 4.24l-.71-.71M6.34 17.66l-.71-.71"
                    />
                  </svg>
                  Világos mód
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
