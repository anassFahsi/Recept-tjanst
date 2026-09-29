import { useEffect, useState } from 'react'
import { api } from '../api/client';
import type { MembershipLevel } from '../types/membership'
import { useNavigate } from 'react-router-dom'

const Pricing = () => {
  const navigate = useNavigate()
  const [membershipLevels, setMembershipLevels] = useState<MembershipLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembershipLevels = async () => {
      try {
        const response = await api.get<MembershipLevel[]>('/api/membership-levels');

        setMembershipLevels(response.data)
      } catch (error) {
        console.error('Failed to fetch membership levels:', error)
        setError('Kunde inte hämta medlemsnivåerna.')
      } finally {
        setLoading(false)
      }
    }

    fetchMembershipLevels()
  }, [])

  if (loading) {
    return <p>Laddar medlemskap...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <main>
      <h1>Välj ditt medlemskap</h1>

      <div>
        {membershipLevels.map((level) => (
          <article key={level.id}>
            <h2>{level.name}</h2>

            <p>
              {level.priceOre === 0
                ? 'Gratis'
                : `${level.priceOre / 100} kr`}
            </p>

            <p>{level.description}</p>

            <p>Max sparade recept: {level.maxSavedRecipes}</p>

            <button onClick={() => navigate(`/checkout/${level.slug}`)}>
              Välj {level.name}
            </button>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Pricing