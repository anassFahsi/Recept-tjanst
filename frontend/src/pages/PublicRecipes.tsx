import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import Notification from "../components/Notification"; 
import type { Recipe } from "../types/Recipe";
import type { MembershipLevel } from "../types/membership";
import "./PublicRecipes.css";

const PAGE_SIZE = 8;

interface Group {
  level: MembershipLevel;
  recipes: Recipe[];
  locked: boolean;
}

const LockIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const RecipeCard = ({
  recipe,
  locked,
  levelName,
  notify,
}: {
  recipe: Recipe;
  locked: boolean;
  levelName: string;
  notify: (msg: string, type?: "info" | "success" | "error") => void;
}) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(recipe.is_saved ?? false);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      notify("Du måste logga in för att spara recept.", "error");
      return;
    }

    if (locked) {
      notify(`Detta recept kräver ${levelName}. Uppgradera för att spara.`, "error");
      return;
    }

    try {
      if (saved) {
        notify("Detta recept är redan sparat.", "info");
        return;
      }

      await api.post(`/api/recipes/${recipe.id}/save`);
      setSaved(true);
      notify("Recept sparat!", "success");

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err.response?.data?.error;

        if (error === "not_allowed") {
          notify("Din medlemsnivå tillåter inte att spara recept.", "error");
        }

        if (error === "limit_reached") {
          notify(err.response?.data.message, "error");
        }
      } else {
        console.error("Unknown error", err);
      }
    }
  }

  return (
    <Link
      to={`/recipes/${recipe.slug}`}
      className={`card${locked ? " card--locked" : ""}`}
    >
      <div className="card__media">
        {recipe.image_url && (
          <img
            className="card__image"
            src={recipe.image_url}
            alt=""
            loading="lazy"
          />
        )}

        {!locked && (
          <button
            className={`save-btn ${saved ? "saved" : ""}`}
            onClick={toggleSave}
          >
            {saved ? "★" : "☆"}
          </button>
        )}

        {locked && (
          <span className="card__lock">
            <LockIcon />
            {levelName}
          </span>
        )}
      </div>

      <h3 className="card__title">{recipe.title}</h3>
      <p className="card__intro">{recipe.intro}</p>
      {recipe.cook_time_min && (
        <span className="card__meta">{recipe.cook_time_min} min</span>
      )}
    </Link>
  );
};

const Section = ({ group, notify }: { 
  group: Group; 
  notify: (msg: string, type?: "info" | "success" | "error") => void 
}) => {

  const [expanded, setExpanded] = useState(false);
  const { level, recipes, locked } = group;

  const visible = expanded ? recipes : recipes.slice(0, PAGE_SIZE);
  const hidden = recipes.length - visible.length;

  return (
    <section className="section">
      <div className="section__header">
        <h2 className="section__title">{level.name}</h2>
        <span className="section__count">{recipes.length} recept</span>
        {!locked && <span className="section__badge">Ingår</span>}
      </div>

      <div className="grid">
        {visible.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            locked={locked}
            levelName={level.name}
            notify={notify}
          />
        ))}
      </div>

      {hidden > 0 && (
        <button
          type="button"
          className="showmore"
          onClick={() => setExpanded(true)}
        >
          Visa {hidden} till
        </button>
      )}

      {locked && (
        <div className="upsell">
          <p className="upsell__text">
            {level.description}. Lås upp {recipes.length} recept till för{" "}
            {(level.priceOre / 100).toLocaleString("sv-SE", {
              style: "currency",
              currency: "SEK",
            })}
            .
          </p>
          <Link to="/membership" className="upsell__button">
            Uppgradera
          </Link>
        </div>
      )}
    </section>
  );
};

const PublicRecipes = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [notif, setNotif] = useState<{
    message: string;
    type: "info" | "success" | "error";
  } | null>(null);

  function notify(message: string, type: "info" | "success" | "error" = "info") {
    setNotif({ message, type });
  }

  const userTier = user?.tier ?? 0;

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      try {
        const [recipesRes, levelsRes] = await Promise.all([
          api.get<Recipe[]>("/api/recipes/public"),
          api.get<MembershipLevel[]>("/api/membership-levels"),
        ]);

        const levels = [...levelsRes.data].sort((a, b) => a.tier - b.tier);

        const built = levels
          .map<Group>((level) => ({
            level,
            recipes: recipesRes.data.filter(
              (r) => r.required_level_id === level.id
            ),
            locked: level.tier > userTier,
          }))
          .filter((g) => g.recipes.length > 0);

        if (!cancelled) setGroups(built);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userTier]);

  if (loading) return <p className="recipes__state">Laddar recept…</p>;
  if (error)
    return <p className="recipes__state">Kunde inte hämta recepten just nu.</p>;

  return (
    <div className="recipes">
      <div className="recipes__intro">
        <h1 className="recipes__heading">Utforska våra recept</h1>
        <p className="recipes__lead">
          {user
            ? `Du har ${user.levelName}. Allt ovanför din nivå är markerat med hänglås.`
            : "Logga in för att se vad som ingår i ditt medlemskap."}
        </p>
      </div>

      {groups.map((g) => (
        <Section key={g.level.id} group={g} notify={notify} />
      ))}

      {notif && (
        <Notification
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}
    </div>
  );
};

export default PublicRecipes;







