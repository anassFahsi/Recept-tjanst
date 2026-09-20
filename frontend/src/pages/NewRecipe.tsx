import { useState } from "react";
import axios from "axios";

export default function NewRecipe() {
  const [form, setForm] = useState({
    title: "",
    intro: "",
    instructions: "",
    image_url: "",
    cook_time_min: "",
    category_id: 1,
    required_level_id: 1
  });

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/recipes", {
        ...form,
        instructions: form.instructions.split(",")
      });

      window.location.href = "/admin";
    } catch (err) {
      console.error("Error creating recipe:", err);
    }
  };

  return (
    <div className="new-recipe">
      <h1>Skapa nytt recept</h1>

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
          onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
        >
          <option value={1}>Frukost</option>
          <option value={2}>Lunch</option>
          <option value={3}>Middag</option>
        </select>

        <select
          value={form.required_level_id}
          onChange={(e) => setForm({ ...form, required_level_id: Number(e.target.value) })}
        >
          <option value={1}>Basic</option>
          <option value={2}>Premium</option>
          <option value={3}>Premium plus</option>
        </select>

        <button type="submit">Skapa</button>
      </form>
    </div>
  );
}

