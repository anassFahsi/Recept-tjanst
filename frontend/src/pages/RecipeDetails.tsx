import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Recipe, } from "../types/Recipe";
import type { Ingredient } from "../types/Ingredient";

export default function RecipeDetails() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState<Recipe|null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await axios.get(`/api/recipes/public/${slug}`);
      setRecipe(res.data);
    };
    fetchRecipe();
  }, [slug]);

  if (!recipe) return <p>Laddar...</p>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <img src={recipe.image_url} width="300" />

      <p>{recipe.intro}</p>

      <h2>Ingredienser</h2>
      <ul>
        {recipe.ingredients?.map((ing:Ingredient) => (
          <li key={ing.id}>
            {ing.amount} {ing.unit} {ing.name}
          </li>
        ))}
      </ul>

      <h2>Instruktioner</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
}
