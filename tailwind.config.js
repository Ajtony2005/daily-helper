import { defineConfig } from "tailwindcss";
import animate from "tailwindcss-animate";

export default defineConfig({
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./components/ui/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
      backdropBlur: {
        xl: "24px",
      },
      colors: {
        appBackground: "#0f172a",
        primary: "#2563eb",
        "primary-400": "#60a5fa",
        "primary-600": "#2563eb",
        secondary: "#10b981",
        "secondary-400": "#34d399",
        card: "#1E1E1E",
        "card-glass": "rgba(255, 255, 255, 0.05)",
        "card-darkForeground": "#E5E7EB",
        border: "#374151",
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
