import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import type { Recipe } from "../types/Recipe";

export default function PublicRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await axios.get("/api/recipes/public");
      setRecipes(res.data);
    };
    fetchRecipes();
  }, []);

  return (
    <div>
      <h1>Recept</h1>

      <ul>
        {recipes.map((r) => (
          <li key={r.id}>
            <Link to={`/recipes/${r.slug}`}>
              <img src={r.image_url} width="150" />
              <p>{r.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
