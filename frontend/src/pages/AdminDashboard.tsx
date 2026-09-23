import { useEffect, useState } from "react";
import axios  from "axios";
import type { Recipe } from "../types/Recipe";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard () {
    const navigate=useNavigate();
    const [recipes,setRecipes]=useState <Recipe[]>([]);
 
    useEffect(()=>{
      const fetchRecipes=async()=>{
        try{
            const result = await axios.get('/api/recipes/admin');
            setRecipes(result.data);
            
        }
        catch(err){
            console.error("Error fetching recipes ",err)
        }
    };fetchRecipes()},[]);

  const deleteRecipe = async (id:number) => {

    if (!confirm("Är du säker?")) return;

    try {
      await axios.delete(`/api/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

return (
    <div className="admin-dashboard">
      <h1> Admin - Recept</h1>
      <button onClick={()=>navigate('/admin/new')}> + Skapa nytt recept</button>
      <table>
        
          <thead>
          <tr>
            <th>Titel</th>
            <th>Kategori</th>
            <th>Tid</th>
            <th>Publicerad</th>
            <th> Ingredienser</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {
            recipes.map((r)=>(
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.category_id}</td>
                <td>{r.cook_time_min} min</td>
                <td>{r.is_published ?'Ja':'Nej'}</td>
                <td><button onClick={() => navigate(`/admin/recipes/${r.id}/ingredients`)}>
                     Ingredienser
                     </button>
                </td>
                <td>
                  <button onClick={()=>navigate(`/admin/edit/${r.slug}`)}>Redigera</button>
                  <button onClick={()=>deleteRecipe(r.id)}>Ta bort</button></td>
                </tr>
            ))

         }
        </tbody>
     
      </table>
    
    </div>
  )
}

    