import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Ingredient } from "../types/Ingredient";

export default function RecipeIngredients() {
  const { id } = useParams();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  interface IngredientForm{
    name:string,
    amount:string,
    unit:string,
    sort_order:number
  }
  const [form, setForm] = useState<IngredientForm>({
    name: "",
    amount: "",
    unit: "",
    sort_order: 1
  });

  const [editing, setEditing] = useState<Ingredient | null>(null);

  // Fetch ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await axios.get(
          `/api/recipes/${id}/ingredients`
        );
        setIngredients(res.data);
      } catch (err) {
        console.error("Error fetching ingredients:", err);
      }
    };

    fetchIngredients();
  }, [id]);

  // Add ingredient
  const handleAdd = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `/api/recipes/${id}/ingredients`,
        form
      );

      setIngredients((prev) => [...prev, res.data]);

      // Reset form
      setForm({
        name: "",
        amount: "",
        unit: "",
        sort_order: form.sort_order + 1
      });
    } catch (err) {
      console.error("Error adding ingredient:", err);
    }
  };

  // Delete ingredient
  const deleteIngredient = async (ingredientId: number) => {
    if (!confirm("Ta bort ingrediens?")) return;

    try {
      await axios.delete(
        `/api/recipes/${id}/ingredients/${ingredientId}`
      );

      setIngredients((prev) =>
        prev.filter((ing) => ing.id !== ingredientId)
      );
    } catch (err) {
      console.error("Error deleting ingredient:", err);
    }
  };

  // Update ingredient
  const saveIngredient = async (ingredientId: number) => {
    if (!editing) return;

    try {
      const res = await axios.put(
        `/api/recipes/${id}/ingredients/${ingredientId}`,
        editing
      );

      setIngredients((prev) =>
        prev.map((ing) => (ing.id === ingredientId ? res.data : ing))
      );

      setEditing(null);
    } catch (err) {
      console.error("Error updating ingredient:", err);
    }
  };

  return (
    <div className="ingredients-page">
      <h1>Ingredienser för recept #{id}</h1>

      {/* Add ingredient form */}
      <form onSubmit={handleAdd}>
        <input
          placeholder="Namn"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Mängd"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          placeholder="Enhet (t.ex. g, dl, st)"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />

        <input
          type="number"
          placeholder="Sortering"
          value={form.sort_order}
          onChange={(e) =>
            setForm({ ...form, sort_order: Number(e.target.value) })
          }
        />

        <button type="submit">Lägg till ingrediens</button>
      </form>

      {/* Ingredient list */}
      <table>
        <thead>
          <tr>
            <th>Sort</th>
            <th>Namn</th>
            <th>Mängd</th>
            <th>Enhet</th>
            <th>Åtgärder</th>
          </tr>
        </thead>

        <tbody>
          {ingredients.map((ing) => (
            <tr key={ing.id}>
              {editing?.id === ing.id ? (
                <>
                  <td>
                    <input
                      type="number"
                      value={editing.sort_order}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          sort_order: Number(e.target.value)
                        })
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={editing.amount}
                      onChange={(e) =>
                        setEditing({ ...editing, amount: Number(e.target.value )})
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={editing.unit}
                      onChange={(e) =>
                        setEditing({ ...editing, unit: e.target.value })
                      }
                    />
                  </td>

                  <td>
                    <button onClick={() => saveIngredient(ing.id)}>
                      Spara
                    </button>
                    <button onClick={() => setEditing(null)}>
                      Avbryt
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{ing.sort_order}</td>
                  <td>{ing.name}</td>
                  <td>{ing.amount}</td>
                  <td>{ing.unit}</td>
                  <td>
                    <button onClick={() => setEditing(ing)}>Redigera</button>
                    <button onClick={() => deleteIngredient(ing.id)}>
                      Ta bort
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => (window.location.href = "/admin")}>
        Klar - tillbaka till admin
      </button>
    </div>
  );
}

