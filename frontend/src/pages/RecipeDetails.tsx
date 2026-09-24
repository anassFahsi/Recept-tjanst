import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from '../api/client';
import type { RecipeDetail } from "../types/Recipe";
import type { Ingredient } from "../types/Ingredient";

export default function RecipeDetails() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await api.get<RecipeDetail>(`/api/recipes/public/${slug}`);
      setRecipe(res.data);
    };
    fetchRecipe();
  }, [slug]);

  if (!recipe) return <p>Laddar...</p>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      {recipe.image_url && <img src={recipe.image_url} width="300" alt="" />}

      <p>{recipe.intro}</p>

      {recipe.locked ? (
        <div>
          <h2>Det här receptet ingår i {recipe.required_level_name}</h2>
          <p>
            {recipe.ingredient_count} ingredienser och steg för steg-instruktioner
            låses upp när du uppgraderar.
          </p>
          <Link to="/membership">Uppgradera till {recipe.required_level_name}</Link>
        </div>
      ) : (
        <>
          <h2>Ingredienser</h2>
          <ul>
            {recipe.ingredients?.map((ing: Ingredient) => (
              <li key={ing.id}>
                {ing.amount} {ing.unit} {ing.name}
              </li>
            ))}
          </ul>

          <h2>Instruktioner</h2>
          <ol>
            {recipe.instructions?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}