import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter,Routes,Route } from "react-router-dom";

const App=()=>{
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route 
          path="/admin"
          element={<AdminDashboard  />}
        />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
