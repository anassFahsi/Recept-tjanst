import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import type { Recipe } from "../types/Recipe";
import axios from "axios";
import "./SavedRecipes.css";

export default function SavedRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/recipes/saved");
        setRecipes(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) load();
  }, [user]);

  async function removeSaved(id: number) {
    try {
      await api.delete(`/api/recipes/${id}/save`);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message ?? "Kunde inte ta bort receptet.");
      }
    }
  }

  if (!user) {
    return <p className="saved__state">Du måste logga in för att se sparade recept.</p>;
  }

  if (loading) {
    return <p className="saved__state">Laddar sparade recept…</p>;
  }

  if (error) {
    return <p className="saved__state">Kunde inte hämta sparade recept.</p>;
  }

  return (
    <div className="saved">
      <h1 className="saved__heading">Sparade recept</h1>

      {recipes.length === 0 && (
        <p className="saved__state">Du har inga sparade recept ännu.</p>
      )}

      <div className="saved__grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="saved__card">
            <Link to={`/recipes/${recipe.slug}`}>
              <img src={recipe.image_url ?? ''} alt={recipe.title} className="saved__image" />
            </Link>

            <h3 className="saved__title">{recipe.title}</h3>

            <button
              className="saved__remove"
              onClick={() => removeSaved(recipe.id)}
            >
              Ta bort
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
