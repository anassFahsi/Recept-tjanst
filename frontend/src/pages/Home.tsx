import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import type { Recipe } from "../types/Recipe";
import type { MembershipLevel } from "../types/membership";
import "./Home.css";
import "./PublicRecipes.css";

interface PublicRecipe extends Recipe {
  locked?: boolean;
  required_level_name?: string;
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

const Home = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<PublicRecipe[]>([]);
  const [levels, setLevels] = useState<MembershipLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      try {
        const [recipesRes, levelsRes] = await Promise.all([
          api.get<PublicRecipe[]>("/api/recipes/public"),
          api.get<MembershipLevel[]>("/api/membership-levels"),
        ]);

        if (cancelled) return;

        // Blanda öppna och låsta så hänglåsen syns
        const open = recipesRes.data.filter((r) => !r.locked).slice(0, 3);
        const locked = recipesRes.data.filter((r) => r.locked).slice(0, 3);
        setRecipes([...open, ...locked].slice(0, 6));

        setLevels([...levelsRes.data].sort((a, b) => a.tier - b.tier));
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroImage = recipes[0]?.image_url ?? null;

  return (
    <div className="home">
      <section className="hero">
        {heroImage && <img className="hero__bg" src={heroImage} alt="" />}

        <div className="hero__inner">
          <div className="hero__content">
            {user ? (
              <>
                <span className="hero__eyebrow">{user.levelName}</span>
                <h1 className="hero__title">Välkommen tillbaka, {user.displayName}</h1>
                <p className="hero__lead">
                  Ditt medlemskap ger dig tillgång till hela {user.levelName}-biblioteket.
                  Dags att laga något nytt.
                </p>
                <div className="hero__actions">
                  <Link to="/recipes" className="hero__btn hero__btn--primary">
                    Till recepten
                  </Link>
                  {user.tier < 3 && (
                    <Link to="/membership" className="hero__btn hero__btn--ghost">
                      Uppgradera
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="hero__eyebrow">Tre nivåer, ett kök</span>
                <h1 className="hero__title">Från vardagsmat till Wagyu</h1>
                <p className="hero__lead">
                  Börja gratis med vardagsrecepten. Uppgradera när du vill laga
                  Beef Wellington, Bouillabaisse och resten av receptbanken.
                </p>
                <div className="hero__actions">
                  <Link to="/register" className="hero__btn hero__btn--primary">
                    Skapa konto gratis
                  </Link>
                  <Link to="/recipes" className="hero__btn hero__btn--ghost">
                    Se recepten
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="home__section">
        <div className="home__section-head">
          <h2 className="home__section-title">Ett smakprov</h2>
          <Link to="/recipes" className="home__link">Se alla recept →</Link>
        </div>

        {loading ? (
          <p className="home__state">Laddar…</p>
        ) : (
          <div className="grid">
            {recipes.map((r) => (
              <Link
                key={r.id}
                to={`/recipes/${r.slug}`}
                className={`card${r.locked ? " card--locked" : ""}`}
              >
                <div className="card__media">
                  {r.image_url && (
                    <img className="card__image" src={r.image_url} alt="" loading="lazy" />
                  )}
                  {r.locked && (
                    <span className="card__lock">
                      <LockIcon />
                      {r.required_level_name}
                    </span>
                  )}
                </div>
                <h3 className="card__title">{r.title}</h3>
                <p className="card__intro">{r.intro}</p>
                {r.cook_time_min && (
                  <span className="card__meta">{r.cook_time_min} min</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="tiers">
        <div className="home__section">
          <div className="home__section-head">
            <h2 className="home__section-title">Välj din nivå</h2>
            <Link to="/membership" className="home__link">Jämför nivåerna →</Link>
          </div>

          <div className="tiers__grid">
            {levels.map((level) => (
              <Link key={level.id} to="/membership" className="tier">
                <h3 className="tier__name">{level.name}</h3>
                <p className="tier__price">
                  {level.priceOre === 0
                    ? "Gratis"
                    : `${(level.priceOre / 100).toLocaleString("sv-SE")} kr`}
                  {level.priceOre > 0 && <span className="tier__period"> / mån</span>}
                </p>
                <p className="tier__desc">{level.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="cta">
          <h2 className="cta__title">Redo att börja laga?</h2>
          <p className="cta__lead">
            Skapa ett konto gratis och få tillgång till vardagsrecepten direkt.
          </p>
          <Link to="/register" className="cta__btn">Skapa konto</Link>
        </section>
      )}
    </div>
  );
};

export default Home;