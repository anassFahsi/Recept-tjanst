import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import type { Receipt } from '../types/receipt'

const Account = () => {
  const { user } = useAuth()

  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await api.get<Receipt[]>('/api/receipts/me')
        setReceipts(response.data)
      } catch (error) {
        console.error('Failed to fetch receipts:', error)
        setError('Kunde inte hämta dina kvitton.')
      } finally {
        setLoading(false)
      }
    }

    void fetchReceipts()
  }, [])

  return (
    <main>
      <h1>Mitt konto</h1>

      <section>
        <h2>Kontouppgifter</h2>

        <p>Namn: {user?.displayName}</p>
        <p>E-post: {user?.email}</p>
        <p>Medlemskap: {user?.levelName}</p>
      </section>

      <section>
        <h2>Mina kvitton</h2>

        {loading && <p>Laddar kvitton...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && receipts.length === 0 && (
          <p>Du har inga kvitton ännu.</p>
        )}

        {!loading &&
          !error &&
          receipts.map((receipt) => (
            <article key={receipt.id}>
              <h3>{receipt.levelName}</h3>

              <p>Belopp: {(receipt.amountOre / 100).toFixed(2)} kr</p>

              <p>
                Datum:{' '}
                {new Date(receipt.paidAt).toLocaleDateString('sv-SE')}
              </p>

              <p>Ordernummer: {receipt.orderReference}</p>
              <p>Status: {receipt.status}</p>
            </article>
          ))}
      </section>
    </main>
  )
}

export default Account
