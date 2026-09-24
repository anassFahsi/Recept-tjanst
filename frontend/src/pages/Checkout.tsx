import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import type { MembershipLevel } from '../types/membership'

const Checkout = () => {
  const { membershipSlug } = useParams()
  const [membershipLevel, setMembershipLevel] =
    useState<MembershipLevel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { refreshUser } = useAuth()
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembershipLevel = async () => {
      try {
        const response = await api.get<MembershipLevel[]>(
            '/api/membership-levels'
     )

        const selectedLevel = response.data.find(
          (level) => level.slug === membershipSlug
        )

        if (!selectedLevel) {
          setError('Medlemsnivån finns inte.')
          return
        }

        setMembershipLevel(selectedLevel)
      } catch (error) {
        console.error('Failed to fetch membership level:', error)
        setError('Kunde inte hämta medlemsnivån.')
      } finally {
        setLoading(false)
      }
    }

    fetchMembershipLevel()
  }, [membershipSlug])

  const handleCheckout = async () => {
    if (!membershipLevel) return

    try {
        setPurchasing(true)
        setPurchaseError(null)

        await api.post('/api/checkout', {
        membershipSlug: membershipLevel.slug,
        })

        await refreshUser()
    } catch (error) {
        console.error('Checkout failed:', error)

        if (axios.isAxiosError(error) && error.response?.data?.error) {
        setPurchaseError(error.response.data.error)
        } else {
        setPurchaseError('Köpet kunde inte genomföras.')
        }
    } finally {
        setPurchasing(false)
    }
    }

  if (loading) {
    return <p>Laddar checkout...</p>
  }

  if (error || !membershipLevel) {
    return <p>{error ?? 'Medlemsnivån finns inte.'}</p>
  }

  return (
    <main>
        <h1>Checkout</h1>

        <h2>{membershipLevel.name}</h2>

        <p>
            Pris:{' '}
            {membershipLevel.priceOre === 0
            ? 'Gratis'
            : `${membershipLevel.priceOre / 100} kr`}
        </p>

        <p>{membershipLevel.description}</p>

        <button onClick={handleCheckout} disabled={purchasing}>
            {purchasing ? 'Genomför köp...' : 'Bekräfta köp'}
        </button>

        {purchaseError && <p role="alert">{purchaseError}</p>}
    </main>
  )
}

export default Checkout