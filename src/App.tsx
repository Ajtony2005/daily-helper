import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/layout/Navbar";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Loading from "@/pages/Loading";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-panda-cream font-sans">
        {/* You can use isDarkMode for conditional rendering or debugging */}
        <Navbar />
        <main className="pt-8 px-4 max-w-5xl mx-auto">
          {/* Example debug output */}

          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add your feature routes here, e.g.:
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/wellness" element={<WellnessPage />} />
            */}
            <Route path="/loading" element={<Loading />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
