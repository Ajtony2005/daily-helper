import { defineConfig } from "tailwindcss";
import animate from "tailwindcss-animate";

const plugin = require("tailwindcss/plugin");

export default defineConfig({
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        appBackground: "#f0f0f0", // Light mode background
        "appBackground-dark": "#0f172a", // Optional dark mode background
        // ... other colors
        primary: "#2563eb",
        "primary-50": "#eff6ff",
        "primary-100": "#dbeafe",
        "primary-200": "#bfdbfe",
        "primary-300": "#93c5fd",
        "primary-400": "#60a5fa",
        "primary-500": "#3b82f6",
        "primary-600": "#2563eb",
        "primary-700": "#1d4ed8",
        "primary-800": "#1e40af",
        "primary-900": "#1e3a8a",
        secondary: "#10b981",
        "secondary-50": "#ecfdf5",
        "secondary-100": "#d1fae5",
        "secondary-200": "#a7f3d0",
        "secondary-300": "#6ee7b7",
        "secondary-400": "#34d399",
        "secondary-500": "#10b981",
        "secondary-600": "#059669",
        "secondary-700": "#047857",
        "secondary-800": "#065f46",
        "secondary-900": "#064e3b",
        accent: "#64748b",
        "accent-50": "#f8fafc",
        "accent-100": "#f1f5f9",
        "accent-200": "#e2e8f0",
        "accent-300": "#cbd5e1",
        "accent-400": "#94a3b8",
        "accent-500": "#64748b",
        "accent-600": "#475569",
        "accent-700": "#334155",
        "accent-800": "#1e293b",
        "accent-900": "#0f172a",
        destructive: "#FF3D00",
        "destructive-50": "#FFEBEE",
        "destructive-100": "#FFCDD2",
        "destructive-200": "#EF9A9A",
        "destructive-300": "#E57373",
        "destructive-400": "#EF5350",
        "destructive-500": "#FF3D00",
        "destructive-600": "#E53935",
        "destructive-700": "#D32F2F",
        "destructive-800": "#C62828",
        "destructive-900": "#B71C1C",
        "destructive-foreground": "#FFFFFF",
        neutral: "#737373",
        "neutral-50": "#FAFAFA",
        "neutral-100": "#F5F5F5",
        "neutral-200": "#E5E5E5",
        "neutral-300": "#D4D4D4",
        "neutral-400": "#A3A3A3",
        "neutral-500": "#737373",
        "neutral-600": "#525252",
        "neutral-700": "#404040",
        "neutral-800": "#262626",
        "neutral-900": "#171717",
        "neutral-950": "#0A0A0A",
        card: "#FFFFFF",
        "card-dark": "#1E1E1E",
        "card-glass": "rgba(255, 255, 255, 0.1)",
        "card-glass-dark": "rgba(255, 255, 255, 0.05)",
        "card-foreground": "#1A1A1A",
        "card-darkForeground": "#E5E7EB",
        popover: "#FFFFFF",
        "popover-dark": "#1E1E1E",
        "popover-glass": "rgba(255, 255, 255, 0.95)",
        "popover-glass-dark": "rgba(30, 30, 30, 0.95)",
        "popover-foreground": "#1A1A1A",
        "popover-darkForeground": "#E5E7EB",
        muted: "#D1D5DB",
        "muted-dark": "#4B5563",
        "muted-foreground": "#6B7280",
        "muted-darkForeground": "#9CA3AF",
        border: "#E5E7EB",
        "border-dark": "#374151",
        "border-glass": "rgba(255, 255, 255, 0.2)",
        "border-glass-dark": "rgba(255, 255, 255, 0.1)",
        input: "#F9FAFB",
        "input-dark": "#2C2C2C",
        "input-glass": "rgba(255, 255, 255, 0.1)",
        "input-glass-dark": "rgba(255, 255, 255, 0.05)",
        ring: "#FF6F00",
        "chart-1": "#FF6F00",
        "chart-2": "#00C853",
        "chart-3": "#00E5FF",
        "chart-4": "#FF3D00",
        "chart-5": "#737373",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Orbitron", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1.25rem",
        glass: "1.5rem",
        full: "9999px",
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(36, 58, 94, 0.08)",
        card: "0 4px 24px 0 rgba(36, 58, 94, 0.10)",
        glass: "0 8px 32px 0 rgba(36, 58, 94, 0.12)",
        "glass-lg": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "glass-xl": "0 35px 60px -12px rgba(0, 0, 0, 0.3)",
        neon: "0 0 10px #FF6F00, 0 0 20px #FF6F00, 0 0 30px #FF6F00",
        "neon-sm": "0 0 5px #FF6F00, 0 0 10px #FF6F00",
        "neon-lg": "0 0 20px #FF6F00, 0 0 30px #FF6F00, 0 0 40px #FF6F00",
        "neon-secondary":
          "0 0 10px #00C853, 0 0 20px #00C853, 0 0 30px #00C853",
        "neon-accent": "0 0 10px #00E5FF, 0 0 20px #00E5FF, 0 0 30px #00E5FF",
        "card-hover":
          "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "card-focus": "0 20px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        "secure-gradient": "linear-gradient(120deg, #f8fafc 0%, #dbeafe 100%)",
        "secure-gradient-dark":
          "linear-gradient(120deg, #0f172a 0%, #2563eb 100%)",
        "button-gradient": "linear-gradient(90deg, #2563eb 0%, #10b981 100%)",
        "button-gradient-dark":
          "linear-gradient(90deg, #1e3a8a 0%, #059669 100%)",
        "button-hover": "linear-gradient(90deg, #10b981 0%, #2563eb 100%)",
        "button-hover-dark": "linear-gradient(90deg, #059669 0%, #1e3a8a 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-radial-dark":
          "radial-gradient(circle at 50% 50%, #0f172a 0%, #2563eb 100%)",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-conic-dark":
          "conic-gradient(from 180deg at 50% 50%, #0f172a, #2563eb, #10b981)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        "gradient-glass-dark":
          "linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(30, 30, 30, 0.3) 100%)",
        "neon-border":
          "linear-gradient(90deg, #FF6F00, #00C853, #00E5FF, #FF3D00)",
        "neon-border-dark":
          "linear-gradient(90deg, #FF6F00, #2563eb, #10b981, #FF3D00)",
      },
      backdropBlur: {
        glass: "8px",
        xs: "2px",
        "4xl": "72px",
        "5xl": "96px",
        "6xl": "128px",
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(.4,0,.2,1) both",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in-down": "fade-in-down 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "glow-pulse": "glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        "float-delayed": "float 3s ease-in-out infinite 1.5s",
        "spin-slow": "spin 3s linear infinite",
        "spin-reverse": "spin-reverse 3s linear infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          "0%": {
            boxShadow: "0 0 5px #FF6F00, 0 0 10px #FF6F00",
          },
          "100%": {
            boxShadow: "0 0 10px #FF6F00, 0 0 20px #FF6F00, 0 0 30px #FF6F00",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(255, 111, 0, 0.4)",
          },
          "50%": {
            boxShadow:
              "0 0 20px rgba(255, 111, 0, 0.8), 0 0 30px rgba(255, 111, 0, 0.6)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(-5%)" },
        },
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        colors:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
        opacity: "opacity",
        shadow: "box-shadow",
        transform: "transform",
        filter: "filter",
        backdrop: "backdrop-filter",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        900: "900ms",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "bounce-out": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      blur: {
        "4xl": "72px",
        "5xl": "96px",
        "6xl": "128px",
      },
    },
  },

  plugins: [
    animate,
    // Custom utilities for glass and gradients
    function ({ addUtilities }) {
      const newUtilities = {
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          background: "rgba(30, 30, 30, 0.6)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(30, 30, 30, 0.3)",
        },
        ".glass-strong": {
          background: "rgba(255, 255, 255, 0.2)",
          "backdrop-filter": "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
        ".glass-strong-dark": {
          background: "rgba(30, 30, 30, 0.8)",
          "backdrop-filter": "blur(20px)",
          border: "1px solid rgba(30, 30, 30, 0.4)",
        },
        ".neon-border": {
          borderImage:
            "linear-gradient(90deg, #FF6F00, #00C853, #00E5FF, #FF3D00) 1",
        },
        ".neon-border-dark": {
          borderImage:
            "linear-gradient(90deg, #FF6F00, #2563eb, #10b981, #FF3D00) 1",
        },
        ".text-gradient-primary": {
          background: "linear-gradient(135deg, #FF6F00, #F45100)",
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".text-gradient-primary-dark": {
          background: "linear-gradient(135deg, #2563eb, #10b981)",
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".text-gradient-secondary": {
          background: "linear-gradient(135deg, #00C853, #00B248)",
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".text-gradient-secondary-dark": {
          background: "linear-gradient(135deg, #059669, #1e3a8a)",
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".text-gradient-accent": {
          background: "linear-gradient(135deg, #00E5FF, #00B8D4)",
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".text-gradient-accent-dark": {
          background: "linear-gradient(135deg, #64748b, #0f172a)",
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
      };
      addUtilities(newUtilities);
    },
  ],
});
