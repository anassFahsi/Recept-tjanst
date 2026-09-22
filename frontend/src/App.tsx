import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import RecipeDetails from "./pages/RecipeDetails";
import AdminDashboard from "./pages/AdminDashboard";
import NewRecipe from "./pages/NewRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeIngredients from "./pages/RecipeIngredients";
import PublicRecipes from "./pages/PublicRecipes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/membership" element={<Pricing />} />
        <Route path='/recipes' element={<PublicRecipes />}/>
        <Route path="/recipes/:slug" element={<RecipeDetails />} />

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
