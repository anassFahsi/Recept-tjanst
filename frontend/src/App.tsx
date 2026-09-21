import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import NewRecipe from "./pages/NewRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeIngredients from "./pages/RecipeIngredients";

const App=()=>{
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route 
          path="/admin"
          element={<AdminDashboard  />}
        />
        <Route
        path='/admin/new'
        element={<NewRecipe />}
        />
        <Route
        path='/admin/edit/:slug'
        element={<EditRecipe />}
        />
        <Route
          path='/admin/recipes/:id/ingredients'
          element={<RecipeIngredients />}
          />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
