import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMoneyBillWave,
  FaBoxes,
  FaShoppingCart,
  FaUtensils,
  FaClipboardList,
  FaBook,
  FaHeartbeat,
  FaSignInAlt,
} from "react-icons/fa";

const navItems = [
  { name: "Finance", path: "/finance", icon: <FaMoneyBillWave /> },
  { name: "Inventory", path: "/inventory", icon: <FaBoxes /> },
  { name: "Shopping", path: "/shopping", icon: <FaShoppingCart /> },
  { name: "Meals", path: "/meals", icon: <FaUtensils /> },
  { name: "To-Do", path: "/todo", icon: <FaClipboardList /> },
  { name: "Wishlist", path: "/wishlist", icon: <FaShoppingCart /> },
  { name: "Recipes", path: "/recipes", icon: <FaBook /> },
  { name: "Wellness", path: "/wellness", icon: <FaHeartbeat /> },
  { name: "Login", path: "/login", icon: <FaSignInAlt /> },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="bg-appBackground-dark text-card-darkForeground shadow-card sticky top-0 z-50 font-sans backdrop-blur-lg">
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
          <span className="text-2xl font-bold tracking-tight bg-clip-text group-hover:scale-105 transition-transform duration-200">
            DailyHelper
          </span>
        </Link>

        {/* Desktop nav + Login */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-primary-800 hover:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  isActive
                    ? "bg-primary-600 text-white shadow-soft"
                    : "text-card-darkForeground"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          className="md:hidden p-2 rounded-full bg-card-glass-dark hover:bg-card-glass-dark transition-colors duration-200 shadow-glass"
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
            className="text-primary-500"
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
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden bg-appBackground-dark text-card-darkForeground shadow-card px-4 py-6 fixed top-16 right-0 w-3/4 max-w-xs h-[calc(100vh-4rem)] z-50"
            style={{
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(30, 41, 59, 0.9)",
            }}
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-primary-800 hover:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-left ${
                      isActive
                        ? "bg-primary-600 text-white shadow-soft"
                        : "text-card-darkForeground"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
