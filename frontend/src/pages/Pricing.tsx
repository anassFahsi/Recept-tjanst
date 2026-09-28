import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import type { MembershipLevel } from '../types/membership'
import './Pricing.css'

const Check = () => (
  <svg
    className="plan__check"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const Pricing = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [membershipLevels, setMembershipLevels] = useState<MembershipLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userTier = user?.tier ?? 0

  useEffect(() => {
    const fetchMembershipLevels = async () => {
      try {
        const response = await api.get<MembershipLevel[]>('/api/membership-levels')
        setMembershipLevels([...response.data].sort((a, b) => a.tier - b.tier))
      } catch (err) {
        console.error('Failed to fetch membership levels:', err)
        setError('Kunde inte hämta medlemsnivåerna.')
      } finally {
        setLoading(false)
      }
    }

    fetchMembershipLevels()
  }, [])

  if (loading) return <p className="pricing__state">Laddar medlemskap…</p>
  if (error) return <p className="pricing__state">{error}</p>

  return (
    <main className="pricing">
      <div className="pricing__intro">
        <h1 className="pricing__title">Välj ditt medlemskap</h1>
        <p className="pricing__lead">
          Ju högre nivå, desto fler recept och större bibliotek.
        </p>
      </div>

      <div className="pricing__grid">
        {membershipLevels.map((level) => {
          const isCurrent = user ? level.tier === userTier : false
          const isDowngrade = level.tier < userTier
          const featured = level.tier === 2 && !isCurrent

          return (
            <article
              key={level.id}
              className={[
                'plan',
                featured ? 'plan--featured' : '',
                isCurrent ? 'plan--current' : '',
              ].filter(Boolean).join(' ')}
            >
              {isCurrent && (
                <span className="plan__flag plan__flag--current">Din nivå</span>
              )}
              {featured && <span className="plan__flag">Populärast</span>}

              <h2 className="plan__name">{level.name}</h2>

              <div className="plan__price">
                <span className="plan__amount">
                  {level.priceOre === 0
                    ? 'Gratis'
                    : `${(level.priceOre / 100).toLocaleString('sv-SE')} kr`}
                </span>
                {level.priceOre > 0 && (
                  <span className="plan__period">/ mån</span>
                )}
              </div>

              {level.description && (
                <p className="plan__description">{level.description}</p>
              )}

              <ul className="plan__features">
                <li className="plan__feature">
                  <Check />
                  <span>
                    Alla recept på nivå {level.tier} och lägre
                  </span>
                </li>
                <li className="plan__feature">
                  <Check />
                  <span>
                    {level.maxSavedRecipes === null
                      ? 'Obegränsat antal sparade recept'
                      : `Upp till ${level.maxSavedRecipes} sparade recept`}
                  </span>
                </li>
                <li className="plan__feature">
                  <Check />
                  <span>Ingredienslistor och steg för steg</span>
                </li>
              </ul>

              {isCurrent ? (
                <span className="plan__button plan__button--disabled">
                  Nuvarande nivå
                </span>
              ) : isDowngrade ? (
                <span className="plan__button plan__button--disabled">
                  Ingår redan
                </span>
              ) : (
                <button
                  className={`plan__button plan__button--${featured ? 'primary' : 'outline'}`}
                  onClick={() => navigate(`/checkout/${level.slug}`)}
                >
                  Välj {level.name}
                </button>
              )}
            </article>
          )
        })}
      </div>

      {!user && (
        <p className="pricing__note">
          Du behöver ett konto för att uppgradera.{' '}
          <Link to="/register">Skapa konto</Link> eller{' '}
          <Link to="/login">logga in</Link>.
        </p>
      )}
    </main>
  )
}

export default Pricing