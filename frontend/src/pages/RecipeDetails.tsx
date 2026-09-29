import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import type { RecipeDetail } from "../types/Recipe";
import type { Ingredient } from "../types/Ingredient";
import "./RecipeDetails.css";

export default function RecipeDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      try {
        const res = await api.get<RecipeDetail>(`/api/recipes/public/${slug}`);
        if (!cancelled) setRecipe(res.data);
      } catch {
        if (!cancelled) setNotFound(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (notFound) return <p className="recipe__state">Receptet hittades inte.</p>;
  if (!recipe) return <p className="recipe__state">Laddar…</p>;

  return (
    <article className={`recipe${recipe.locked ? " recipe--locked" : ""}`}>
      <Link to="/recipes" className="recipe__back">← Alla recept</Link>

      {recipe.image_url && (
        <div className="recipe__hero">
          <img src={recipe.image_url} alt="" />
        </div>
      )}

      <span
        className={`recipe__badge recipe__badge--${recipe.locked ? "locked" : "open"}`}
      >
        {recipe.required_level_name}
      </span>

      <h1 className="recipe__title">{recipe.title}</h1>
      <p className="recipe__intro">{recipe.intro}</p>

      <div className="recipe__meta">
        {recipe.cook_time_min && <span>{recipe.cook_time_min} min</span>}
        <span>
          {recipe.locked
            ? `${recipe.ingredient_count} ingredienser`
            : `${recipe.ingredients?.length ?? 0} ingredienser`}
        </span>
      </div>

      {recipe.locked ? (
        <div className="paywall">
          <svg
            className="paywall__lock"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>

          <h2 className="paywall__title">
            Ingår i {recipe.required_level_name}
          </h2>
          <p className="paywall__text">
            {recipe.ingredient_count} ingredienser och steg för steg-instruktioner
            låses upp direkt när du uppgraderar.
          </p>

          <Link to="/membership" className="paywall__button">
            Uppgradera till {recipe.required_level_name}
          </Link>

          {!user && (
            <span className="paywall__secondary">
              Redan medlem? <Link to="/login">Logga in</Link>
            </span>
          )}
        </div>
      ) : (
        <>
          <h2 className="recipe__section-title">Ingredienser</h2>
          <ul className="recipe__ingredients">
            {recipe.ingredients?.map((ing: Ingredient) => (
              <li key={ing.id} className="recipe__ingredient">
                <span>{ing.name}</span>
                <span className="recipe__amount">
                  {ing.amount} {ing.unit}
                </span>
              </li>
            ))}
          </ul>

          <h2 className="recipe__section-title">Gör så här</h2>
          <ol className="recipe__steps">
            {recipe.instructions?.map((step, i) => (
              <li key={i} className="recipe__step">
                {step}
              </li>
            ))}
          </ol>
        </>
      )}
    </article>
  );
}