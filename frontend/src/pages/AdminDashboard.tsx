import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Recipe } from "../types/Recipe";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const CATEGORIES: Record<number, string> = {
  1: "Frukost",
  2: "Lunch",
  3: "Middag",
};

const LEVELS: Record<number, string> = {
  1: "Basic",
  2: "Premium",
  3: "Premium Plus",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const result = await api.get("/api/recipes");
        setRecipes(result.data);
      } catch (err) {
        console.error("Error fetching recipes ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const deleteRecipe = async (id: number, title: string) => {
    if (!confirm(`Ta bort "${title}"? Ingredienserna raderas också.`)) return;

    try {
      await api.delete(`/api/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  if (loading) return <p className="admin__state">Laddar recept…</p>;

  return (
    <div className="admin">
      <div className="admin__header">
        <div>
          <h1 className="admin__title">Recept</h1>
          <p className="admin__count">{recipes.length} totalt</p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => navigate("/admin/new")}
        >
          Skapa nytt recept
        </button>
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Kategori</th>
              <th>Nivå</th>
              <th>Tid</th>
              <th>Publicerad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="admin__recipe-title">{r.title}</span>
                  <span className="admin__slug">{r.slug}</span>
                </td>
                <td>{CATEGORIES[r.category_id ?? 0] ?? "—"}</td>
                <td>
                  <span className={`pill pill--tier${r.required_level_id}`}>
                    {LEVELS[r.required_level_id]}
                  </span>
                </td>
                <td>{r.cook_time_min ? `${r.cook_time_min} min` : "—"}</td>
                <td>
                  <span className={`pill pill--${r.is_published ? "yes" : "no"}`}>
                    {r.is_published ? "Ja" : "Nej"}
                  </span>
                </td>
                <td>
                  <div className="admin__actions">
                    <button
                      className="btn btn--ghost"
                      onClick={() =>
                        navigate(`/admin/recipes/${r.id}/ingredients`)
                      }
                    >
                      Ingredienser
                    </button>
                    <button
                      className="btn btn--ghost"
                      onClick={() => navigate(`/admin/edit/${r.slug}`)}
                    >
                      Redigera
                    </button>
                    <button
                      className="btn btn--danger"
                      onClick={() => deleteRecipe(r.id, r.title)}
                    >
                      Ta bort
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}