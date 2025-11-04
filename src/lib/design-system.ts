export const designTokens = {
  colors: {
    // Ocean-inspired primary palette (Teal-Green)
    primary: {
      50: "#f0fdf9", // Very light mint
      100: "#ccfdf7", // Light mint
      200: "#99f6e4", // Soft turquoise
      300: "#5eead4", // Medium turquoise
      400: "#2dd4bf", // Bright teal
      500: "#14b8a6", // Core teal
      600: "#0d9488", // Deep teal
      700: "#0f766e", // Darker teal
      800: "#115e59", // Very dark teal
      900: "#134e4a", // Deepest teal
    },
    // Ocean depths palette (Blue)
    secondary: {
      50: "#eff6ff", // Very light blue
      100: "#dbeafe", // Light blue
      200: "#bfdbfe", // Soft blue
      300: "#93c5fd", // Medium blue
      400: "#60a5fa", // Bright blue
      500: "#3b82f6", // Core blue
      600: "#2563eb", // Deep blue
      700: "#1d4ed8", // Darker blue
      800: "#1e40af", // Very dark blue
      900: "#1e3a8a", // Deepest blue
    },
    // Neutral grays for balance
    neutral: {
      50: "#f8fafc", // Almost white
      100: "#f1f5f9", // Very light gray
      200: "#e2e8f0", // Light gray
      300: "#cbd5e1", // Medium light gray
      400: "#94a3b8", // Medium gray
      500: "#64748b", // Core gray
      600: "#475569", // Dark gray
      700: "#334155", // Darker gray
      800: "#1e293b", // Very dark gray
      900: "#0f172a", // Almost black
    },
    // Success, warning, error colors that complement the theme
    success: {
      light: "#10b981",
      dark: "#34d399",
    },
    warning: {
      light: "#f59e0b",
      dark: "#fbbf24",
    },
    error: {
      light: "#ef4444",
      dark: "#f87171",
    },
    // Theme-specific colors
    light: {
      background: "#ffffff",
      surface: "#f8fafc",
      surfaceVariant: "#f1f5f9",
      onBackground: "#0f172a",
      onSurface: "#334155",
      border: "#e2e8f0",
      accent: "#14b8a6",
    },
    dark: {
      background: "#0f172a",
      surface: "#1e293b",
      surfaceVariant: "#334155",
      onBackground: "#f1f5f9",
      onSurface: "#e2e8f0",
      border: "#475569",
      accent: "#2dd4bf",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  borderRadius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  shadows: {
    glass: "0 8px 32px rgba(20, 184, 166, 0.15)",
    glassStrong: "0 12px 40px rgba(20, 184, 166, 0.25)",
    soft: "0 4px 20px rgba(0, 0, 0, 0.1)",
    softStrong: "0 8px 30px rgba(0, 0, 0, 0.15)",
    neonTeal: "0 0 25px rgba(20, 184, 166, 0.6)",
    neonBlue: "0 0 25px rgba(37, 99, 235, 0.6)",
    glow: "0 0 40px rgba(45, 212, 191, 0.3)",
  },
  gradients: {
    primary: "linear-gradient(135deg, #14b8a6 0%, #2563eb 100%)",
    primaryReverse: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
    ocean: "linear-gradient(135deg, #0d9488 0%, #1d4ed8 50%, #2dd4bf 100%)",
    subtle: "linear-gradient(135deg, #f0fdf9 0%, #eff6ff 100%)",
    dark: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  transitions: {
    fast: "0.15s ease-out",
    base: "0.3s ease-out",
    slow: "0.5s ease-out",
  },
} as const;

export const animations = {
  fadeIn: "fadeIn 0.5s ease-out",
  fadeInUp: "fadeInUp 0.6s ease-out",
  fadeInDown: "fadeInDown 0.4s ease-out",
  slideInRight: "slideInRight 0.3s ease-out",
  glow: "glow 2s ease-in-out infinite alternate",
} as const;

export const componentClasses = {
  // Glass morphism components
  glass: "glass",
  glassCard: "glass-card",
  glassNav: "glass-nav",

  // Buttons
  btnPrimary: "btn-primary hover-lift",
  btnSecondary: "btn-secondary hover-lift",
  btnOutline: "btn-outline hover-lift",
  btnGhost: "btn-ghost hover-lift",

  // Form elements
  inputField: "input-field",
  selectTrigger: "select-trigger",
  selectContent: "select-content",
  selectItem: "select-item",

  // Layout
  modalOverlay: "modal-overlay",
  modalContent: "modal-content fade-in",
  pageContainer: "page-container",
  pageContent: "page-content fade-in-up",

  // Typography
  sectionTitle: "section-title",
  cardTitle: "card-title",
  textGradient: "text-gradient",

  // Grid and spacing
  cardGrid: "card-grid",

  // Priority indicators
  priorityLow: "priority-low",
  priorityMedium: "priority-medium",
  priorityHigh: "priority-high",
} as const;

export const getPriorityClass = (priority: "low" | "medium" | "high") => {
  const priorityMap = {
    low: componentClasses.priorityLow,
    medium: componentClasses.priorityMedium,
    high: componentClasses.priorityHigh,
  };
  return priorityMap[priority];
};

// Theme utilities
export const getThemeColors = (isDark: boolean) => {
  return isDark ? designTokens.colors.dark : designTokens.colors.light;
};

export const getGradient = (name: keyof typeof designTokens.gradients) => {
  return designTokens.gradients[name];
};
