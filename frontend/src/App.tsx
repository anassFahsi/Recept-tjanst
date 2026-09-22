import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";

import AdminDashboard from "./pages/AdminDashboard";
import NewRecipe from "./pages/NewRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeIngredients from "./pages/RecipeIngredients";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/membership" element={<Pricing />} />

        {/* Admin pages */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/new" element={<NewRecipe />} />
        <Route path="/admin/edit/:slug" element={<EditRecipe />} />
        <Route path="/admin/recipes/:id/ingredients" element={<RecipeIngredients />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
