# Daily Helper - AI Coding Assistant Instructions

## Project Overview

Daily Helper is a modern React 19 productivity dashboard with 8 integrated modules (Finance, Inventory, Shopping, Meals, To-Do, Recipes, Wellness, Wishlist). Uses Vite 7, Tailwind CSS v4, shadcn/ui, and features an attractive ocean-inspired design system with glassmorphism effects supporting both dark and light modes.

## Architecture & Key Patterns

### Tech Stack

- **Frontend**: React 19 + TypeScript, Vite 7, React Router
- **Styling**: Tailwind CSS v4 with custom design system, Framer Motion for animations
- **Components**: shadcn/ui base components + custom glassmorphism styling
- **Icons**: React Icons (FaIcons) + Lucide React

### File Organization

- `src/features/[module]/` - Feature modules (each has single component file)
- `src/components/ui/` - shadcn/ui components with glassmorphism styling
- `src/lib/design-system.ts` - Design tokens and component classes
- `src/index.css` - Global styles, custom CSS classes, Tailwind v4 theme
- `src/layout/Navbar.tsx` - Responsive nav with mobile hamburger menu
- `@/` alias points to `src/` (configured in vite.config.ts)

## Design System Conventions

### Styling Approach

- **Primary Pattern**: Use predefined CSS classes from `src/index.css` over inline Tailwind
- **Key Classes**: `.glass`, `.glass-card`, `.btn-primary`, `.input-field`, `.section-title`
- **Component Styling**: Import design tokens from `@/lib/design-system` for consistent theming
- **Animations**: Use Framer Motion with predefined variants for consistency

### Color System

```typescript
// Ocean-inspired theme from lib/design-system.ts
primary: teal-600 (14b8a6) to blue-600 (2563eb) gradient
secondary: blue palette (3b82f6 family)
neutral: slate grays for balance
backgrounds: Adaptive glassmorphism (dark: slate-900, light: white)
accent: Dynamic teal (dark: 2dd4bf, light: 14b8a6)
```

### Theme Support

- **Dark Mode**: Deep ocean theme with teal/blue glassmorphism
- **Light Mode**: Clean, bright theme with subtle teal accents
- **Theme Toggle**: Available in navbar (sun/moon icon)
- **Persistence**: Theme choice saved to localStorage

### Component Structure Pattern

```tsx
// Feature components follow this structure:
const [Component] = () => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  return (
    <div className="page-container">
      <motion.div className="page-content">
        <Card className="glass-card">
          <CardContent>
            <CardTitle className="section-title">Title</CardTitle>
            {/* Content */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
```

## Development Workflows

### Adding New Features

1. Create component in `src/features/[module]/[Component].tsx`
2. Add route in `App.tsx` routes array
3. Add navigation item to `navItems` in `Navbar.tsx` with React Icon
4. Use existing design patterns from other feature components

### Styling New Components

1. Check `src/index.css` for existing classes first
2. Use `cn()` utility from `@/lib/utils` for class merging
3. Follow glassmorphism pattern: `glass-card` for containers, `input-field` for inputs
4. Use `motion.div` with fade-in animations for new elements

### State Management

- Local component state with `useState`
- No global state management (Redux/Zustand) currently used
- Form state managed locally with controlled inputs
- Loading states handled per component

## Component Patterns

### Modal Pattern

```tsx
// Consistent modal structure across features
{
  showModal && (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={modalVariants}
      className="modal-overlay"
    >
      <motion.div className="modal-content">
        <Card className="glass-card">{/* Modal content */}</Card>
      </motion.div>
    </motion.div>
  );
}
```

### Form Pattern

```tsx
// Standard form with glassmorphism styling
<motion.form onSubmit={handleSubmit}>
  <motion.input
    className="input-field"
    variants={inputVariants}
    whileFocus="focus"
  />
  <Button className="btn-primary">Submit</Button>
</motion.form>
```

### Animation Variants

Use consistent animation variants defined in feature components:

- `modalVariants` - Modal entrance/exit
- `inputVariants` - Input focus effects
- `errorVariants` - Error message animations

## Common Gotchas

- Always use `@/` imports, not relative paths
- Include `disabled={isLoading}` on interactive elements during loading states
- Use `cn()` for conditional styling, not template literals
- Follow existing error handling patterns with `setError()` state
- Mobile responsiveness handled in CSS classes, not conditional rendering

## When Creating New Features

- Mirror the structure and patterns from `SpendingTracker.tsx` (most comprehensive example)
- Use React Icons from the same family (prefer FaIcons for consistency)
- Include loading states, error handling, and responsive design
- Follow the ocean-inspired glassmorphism aesthetic with teal-to-blue gradients
- Test both light and dark modes - use theme toggle in navbar
- Ensure proper contrast and readability in both themes
