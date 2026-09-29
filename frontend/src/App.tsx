import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import RecipeDetails from "./pages/RecipeDetails";
import AdminDashboard from "./pages/AdminDashboard";
import NewRecipe from "./pages/NewRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeIngredients from "./pages/RecipeIngredients";
import PublicRecipes from "./pages/PublicRecipes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import SavedRecipes from "./pages/SavedRecipes";
import Account from "./pages/Account";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/membership" element={<Pricing />} />
        <Route
          path="/checkout/:membershipSlug"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/recipes" element={<PublicRecipes />} />
        <Route path="/recipes/:slug" element={<RecipeDetails />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/saved" element={<ProtectedRoute><SavedRecipes /></ProtectedRoute>} />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        {/* Admin pages */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/new"
          element={
            <ProtectedRoute requireAdmin>
              <NewRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:slug"
          element={
            <ProtectedRoute requireAdmin>
              <EditRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/recipes/:id/ingredients"
          element={
            <ProtectedRoute requireAdmin>
              <RecipeIngredients />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;