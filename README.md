# Daily Helper

Daily Helper is a modern productivity dashboard designed to help you organize and manage your daily life in one place. It combines multiple tools and modules into a single, beautiful, and responsive web app. Whether you want to track your finances, manage your inventory, plan meals, keep shopping lists, organize recipes, manage to-dos, or monitor wellness habits, Daily Helper brings all these features together with a creative and user-friendly interface.

## What Daily Helper Knows & Does

- **Finance Tracking:** Record expenses, view summaries, and monitor your budget.
- **Inventory Management:** Keep track of household items, supplies, and assets.
- **Shopping Lists:** Create, edit, and check off items for your next shopping trip.
- **Meal Planning:** Plan weekly meals, save favorite dishes, and organize ingredients.
- **To-Do Lists:** Manage tasks, set priorities, and mark items as complete.
- **Recipe Organizer:** Save, categorize, and view recipes with ingredient lists.
- **Wellness Tracker:** Log habits, track progress, and set wellness goals.

## Why Use Daily Helper?

- **All-in-One Dashboard:** No need for multiple apps—everything is integrated.
- **Modern, Responsive Design:** Works beautifully on desktop and mobile, with creative visuals and smooth transitions.
- **Dark/Light Mode:** Choose your preferred theme, with persistent settings.
- **Customizable:** Built with Tailwind CSS v4 and shadcn/ui for easy theming and extension.
- **Fast & Secure:** Powered by React 19 and Vite 7 for instant updates and reliable performance.
- **Open Source:** Freely available under the MIT license.

Daily Helper is ideal for students, families, professionals, or anyone who wants to streamline daily routines and boost productivity with a single, easy-to-use tool.

## Features

- Finance, Inventory, Shopping, Meals, To-Do, Recipes, Wellness modules
- Modern responsive UI with glassmorphism and gradients
- Dark/light mode toggle (persists theme)
- Mobile hamburger menu for navigation
- Custom Tailwind v4 utilities and color palette
- Fast development with Vite

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm

### Installation

```sh
yarn install
# or
npm install
```

### Development

```sh
yarn dev
# or
npm run dev
```

### Build

```sh
yarn build
# or
npm run build
```

## Project Structure

```
src/
  App.tsx         # Main app shell
  layout/
    Navbar.tsx    # Responsive navbar with theme toggle
  pages/          # Page components
  features/       # Feature modules
  components/ui/  # UI components (badge, button, card)
  index.css       # Global styles, custom utilities
  ...
```

## Customization

- Tailwind config: `tailwind.config.js` (custom colors, gradients, glassmorphism)
- Global styles: `src/index.css` (custom utilities, dark mode)
- Navbar: `src/layout/Navbar.tsx` (responsive, theme toggle)

## Credits

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## License

MIT
