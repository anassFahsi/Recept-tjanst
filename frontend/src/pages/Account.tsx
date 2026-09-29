import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import type { Receipt } from '../types/receipt'
import './Account.css'

const STATUS_LABELS: Record<string, string> = {
  paid: 'Betald',
  refunded: 'Återbetald',
  failed: 'Misslyckad',
}

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
      } catch (err) {
        console.error('Failed to fetch receipts:', err)
        setError('Kunde inte hämta dina kvitton.')
      } finally {
        setLoading(false)
      }
    }

    void fetchReceipts()
  }, [])

  const formatMoney = (ore: number) =>
    (ore / 100).toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' })

  return (
    <main className="account">
      <h1 className="account__title">Mitt konto</h1>

      <section className="account__section">
        <div className="account__section-head">
          <h2 className="account__section-title">Kontouppgifter</h2>
        </div>

        <div className="details">
          <div className="details__row">
            <span className="details__label">Namn</span>
            <span className="details__value">{user?.displayName}</span>
          </div>
          <div className="details__row">
            <span className="details__label">E-post</span>
            <span className="details__value">{user?.email}</span>
          </div>
          <div className="details__row">
            <span className="details__label">Medlemskap</span>
            <span className="details__value">
              <span className={`level-pill level-pill--tier${user?.tier}`}>
                {user?.levelName}
              </span>
            </span>
          </div>
        </div>
      </section>

      <section className="account__section">
        <div className="account__section-head">
          <h2 className="account__section-title">Mina kvitton</h2>
          {user && user.tier < 3 && (
            <Link to="/membership" className="account__link">
              Uppgradera →
            </Link>
          )}
        </div>

        {loading && <p className="account__state">Laddar kvitton…</p>}

        {error && <p className="account__error">{error}</p>}

        {!loading && !error && receipts.length === 0 && (
          <div className="account__empty">
            <p>Du har inga kvitton ännu.</p>
            <Link to="/membership" className="account__btn">
              Se medlemskapen
            </Link>
          </div>
        )}

        {!loading && !error && receipts.length > 0 && (
          <div className="receipts">
            {receipts.map((receipt) => (
              <article key={receipt.id} className="receipt">
                <div className="receipt__main">
                  <h3 className="receipt__level">{receipt.levelName}</h3>
                  <span className="receipt__meta">
                    {new Date(receipt.paidAt).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="receipt__order">{receipt.orderReference}</span>
                </div>

                <div className="receipt__right">
                  <span className="receipt__amount">
                    {formatMoney(receipt.amountOre)}
                  </span>
                  <span className={`status status--${receipt.status}`}>
                    {STATUS_LABELS[receipt.status] ?? receipt.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Account