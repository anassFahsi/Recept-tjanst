import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { api } from "../api/client";
import { slugify } from "../utils/Slugify";
import "./Admin.css";

export default function EditRecipe() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [id, setId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    intro: "",
    instructions: "",
    image_url: "",
    cook_time_min: "",
    category_id: 1,
    required_level_id: 1,
    is_published: true,
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/api/recipes/${slug}`);
        const recipe = res.data;
        setId(recipe.id);
        setForm({
          title: recipe.title,
          intro: recipe.intro ?? "",
          instructions: (recipe.instructions ?? []).join("\n"),
          image_url: recipe.image_url ?? "",
          cook_time_min: recipe.cook_time_min ?? "",
          category_id: recipe.category_id ?? 1,
          required_level_id: recipe.required_level_id,
          is_published: recipe.is_published,
        });
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Kunde inte hämta receptet");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [slug]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    setError(null);

    if (!form.title.trim()) {
      setError("Receptet måste ha en titel");
      return;
    }

    setSubmitting(true);

    try {
      await api.put(`/api/recipes/${id}`, {
        ...form,
        slug: slugify(form.title),
        instructions: form.instructions
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      navigate("/admin");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Kunde inte spara ändringarna");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="admin__state">Laddar…</p>;

  return (
    <div className="form">
      <Link to="/admin" className="form__back">← Tillbaka</Link>
      <h1 className="form__title">Redigera recept</h1>

      <form onSubmit={handleSubmit}>
        <div className="form__fields">
          <div className="form__field">
            <label className="form__label" htmlFor="title">Titel</label>
            <input
              className="form__input"
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {form.title && (
              <span className="form__hint">URL: /recipes/{slugify(form.title)}</span>
            )}
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="intro">Intro</label>
            <textarea
              className="form__textarea"
              id="intro"
              style={{ minHeight: "4.5rem" }}
              value={form.intro}
              onChange={(e) => setForm({ ...form, intro: e.target.value })}
            />
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="instructions">Instruktioner</label>
            <textarea
              className="form__textarea"
              id="instructions"
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            />
            <span className="form__hint">Ett steg per rad</span>
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="image_url">Bild-URL</label>
            <input
              className="form__input"
              id="image_url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
            {form.image_url && (
              <img className="form__preview" src={form.image_url} alt="" />
            )}
          </div>

          <div className="form__row">
            <div className="form__field">
              <label className="form__label" htmlFor="cook_time_min">Tid (min)</label>
              <input
                className="form__input"
                id="cook_time_min"
                type="number"
                min="1"
                value={form.cook_time_min}
                onChange={(e) => setForm({ ...form, cook_time_min: e.target.value })}
              />
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="category_id">Kategori</label>
              <select
                className="form__select"
                id="category_id"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
              >
                <option value={1}>Frukost</option>
                <option value={2}>Lunch</option>
                <option value={3}>Middag</option>
              </select>
            </div>
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="required_level_id">Nivå som krävs</label>
            <select
              className="form__select"
              id="required_level_id"
              value={form.required_level_id}
              onChange={(e) => setForm({ ...form, required_level_id: Number(e.target.value) })}
            >
              <option value={1}>Basic</option>
              <option value={2}>Premium</option>
              <option value={3}>Premium Plus</option>
            </select>
          </div>

          <label className="form__check">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            Publicerad
          </label>

          {error && <p className="form__error" role="alert">{error}</p>}

          <div className="form__actions">
            <button className="btn btn--primary" type="submit" disabled={submitting}>
              {submitting ? "Sparar…" : "Spara ändringar"}
            </button>
            <Link to="/admin" className="btn btn--ghost">Avbryt</Link>
          </div>
        </div>
      </form>
    </div>
  );
}