import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { api } from "../api/client";
import type { Ingredient } from "../types/Ingredient";
import "./Admin.css";

interface IngredientForm {
  name: string;
  amount: string;
  unit: string;
}

export default function RecipeIngredients() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [editAmount, setEditAmount] = useState("");

  const [form, setForm] = useState<IngredientForm>({
    name: "",
    amount: "",
    unit: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [ingRes, listRes] = await Promise.all([
          api.get(`/api/recipes/${id}/ingredients`),
          api.get("/api/recipes"),
        ]);
        setIngredients(ingRes.data);
        const match = listRes.data.find(
          (r: { id: number }) => r.id === Number(id),
        );
        if (match) setRecipeTitle(match.title);
      } catch (err) {
        console.error("Error fetching ingredients:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  function readError(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      return err.response.data.error;
    }
    return fallback;
  }

  const handleAdd = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const nextOrder =
      ingredients.reduce((max, i) => Math.max(max, i.sort_order), 0) + 1;

    try {
      const res = await api.post(`/api/recipes/${id}/ingredients`, {
        ...form,
        sort_order: nextOrder,
      });

      setIngredients((prev) => [...prev, res.data]);
      setForm({ name: "", amount: "", unit: "" });
    } catch (err) {
      setError(readError(err, "Kunde inte lägga till ingrediensen"));
    }
  };

  const deleteIngredient = async (ingredientId: number, name: string) => {
    if (!confirm(`Ta bort ${name}?`)) return;

    try {
      await api.delete(`/api/recipes/${id}/ingredients/${ingredientId}`);
      setIngredients((prev) => prev.filter((ing) => ing.id !== ingredientId));
    } catch (err) {
      setError(readError(err, "Kunde inte ta bort ingrediensen"));
    }
  };

  const saveIngredient = async (ingredientId: number) => {
    if (!editing) return;
    setError(null);

    const parsed = editAmount.trim() === "" ? null : Number(editAmount);

    if (parsed !== null && !Number.isFinite(parsed)) {
      setError("Mängd måste vara ett tal");
      return;
    }

    try {
      const res = await api.put(
        `/api/recipes/${id}/ingredients/${ingredientId}`,
        { ...editing, amount: parsed },
      );
      setIngredients((prev) =>
        prev.map((ing) => (ing.id === ingredientId ? res.data : ing)),
      );
      setEditing(null);
      setEditAmount("");
    } catch (err) {
      setError(readError(err, "Kunde inte spara ändringen"));
    }
  };

  if (loading) return <p className="admin__state">Laddar…</p>;

  return (
    <div className="ingredients">
      <Link to="/admin" className="form__back">
        ← Tillbaka
      </Link>

      <div className="admin__header">
        <div>
          <h1 className="admin__title">Ingredienser</h1>
          <p className="admin__count">{recipeTitle || `Recept #${id}`}</p>
        </div>
      </div>

      <form className="ing-form" onSubmit={handleAdd}>
        <div className="ing-form__field ing-form__field--name">
          <label className="form__label" htmlFor="name">
            Namn
          </label>
          <input
            className="form__input"
            id="name"
            placeholder="t.ex. Vetemjöl"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="ing-form__field">
          <label className="form__label" htmlFor="amount">
            Mängd
          </label>
          <input
            className="form__input"
            id="amount"
            placeholder="3"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        <div className="ing-form__field">
          <label className="form__label" htmlFor="unit">
            Enhet
          </label>
          <input
            className="form__input"
            id="unit"
            placeholder="dl"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        </div>

        <button className="btn btn--primary" type="submit">
          Lägg till
        </button>
      </form>

      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      {ingredients.length === 0 ? (
        <p className="admin__state">Inga ingredienser än.</p>
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th style={{ width: "4rem" }}>#</th>
                <th>Namn</th>
                <th style={{ width: "8rem" }}>Mängd</th>
                <th style={{ width: "8rem" }}>Enhet</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing) => (
                <tr key={ing.id}>
                  {editing?.id === ing.id ? (
                    <>
                      <td>
                        <input
                          className="form__input form__input--sm"
                          type="number"
                          value={editing.sort_order}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              sort_order: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form__input form__input--sm"
                          value={editing.name}
                          onChange={(e) =>
                            setEditing({ ...editing, name: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form__input form__input--sm"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form__input form__input--sm"
                          value={editing.unit ?? ""}
                          onChange={(e) =>
                            setEditing({ ...editing, unit: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <div className="admin__actions">
                          <button
                            type="button"
                            className="btn btn--primary btn--sm"
                            onClick={() => saveIngredient(ing.id)}
                          >
                            Spara
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => {
                              setEditing(null);
                              setEditAmount("");
                            }}
                          >
                            Avbryt
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="ing__order">{ing.sort_order}</td>
                      <td className="admin__recipe-title">{ing.name}</td>
                      <td>{ing.amount ?? "—"}</td>
                      <td>{ing.unit ?? "—"}</td>
                      <td>
                        <div className="admin__actions">
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => {
                              setEditing(ing);
                              setEditAmount(ing.amount?.toString() ?? "");
                            }}
                          >
                            Redigera
                          </button>
                          <button
                            type="button"
                            className="btn btn--danger"
                            onClick={() => deleteIngredient(ing.id, ing.name)}
                          >
                            Ta bort
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="form__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => navigate("/admin")}
        >
          Klar
        </button>
      </div>
    </div>
  );
}