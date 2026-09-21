import { useEffect, useState } from 'react'
import axios from 'axios'
import type { MembershipLevel } from '../types/membership'

const Pricing = () => {
  const [membershipLevels, setMembershipLevels] = useState<MembershipLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembershipLevels = async () => {
      try {
        const response = await axios.get<MembershipLevel[]>(
          '/api/membership-levels'
        )

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

            <button>Välj {level.name}</button>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Pricing