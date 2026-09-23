import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { slugify } from "../utils/Slugify";
import axios from "axios";

export default function EditRecipe() {
  const { slug } = useParams();
  const [form, setForm] = useState({
    title: "",
    intro:'',
    instructions: "",
    image_url: "",
    cook_time_min: "",
    category_id: 1,
    required_level_id: 1,
    is_published:true
  });

  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`/api/recipes/${slug}`);

        const recipe = res.data;

        setId(recipe.id);

        setForm({
          title: recipe.title,
          intro: recipe.intro,
          instructions: recipe.instructions.join(", "),
          image_url: recipe.image_url,
          cook_time_min: recipe.cook_time_min,
          category_id: recipe.category_id,
          required_level_id: recipe.required_level_id,
          is_published: recipe.is_published
        });
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };

    fetchRecipe();
  }, [slug]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    try {
      await axios.put(`/api/recipes/${id}`, {
        ...form,
        slug:slugify(form.title),
        instructions: form.instructions.split(","),
        is_published: form.is_published
      });

      window.location.href = "/admin";
    } catch (err) {
      console.error("Error updating recipe:", err);
    }
  };

  return (
    <div className="edit-recipe">
      <h1>Redigera recept</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Titel"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Intro"
          value={form.intro}
          onChange={(e) => setForm({ ...form, intro: e.target.value })}
        />

        <textarea
          placeholder="Instruktioner (kommaseparerade)"
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
        />

        <input
          placeholder="Bild-URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />

        <input
          placeholder="Tillagningstid (min)"
          value={form.cook_time_min}
          onChange={(e) => setForm({ ...form, cook_time_min: e.target.value })}
        />

        <select
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: Number(e.target.value) })
          }
        >
          <option value={1}>Frukost</option>
          <option value={2}>Lunch</option>
          <option value={3}>Middag</option>
        </select>

        <select
          value={form.required_level_id}
          onChange={(e) =>
            setForm({ ...form, required_level_id: Number(e.target.value) })
          }
        >
          <option value={1}>Basic</option>
          <option value={2}>Premium</option>
          <option value={3}>Premium Plus</option>
        </select>

        <label>
        <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) =>
            setForm({ ...form, is_published: e.target.checked })
            }
        />
            Publicerad
        </label>


        <button type="submit">Spara ändringar</button>
      </form>
    </div>
  );
}

