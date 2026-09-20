import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import NewRecipe from "./pages/NewRecipe";
import EditRecipe from "./pages/EditRecipe";

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
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
