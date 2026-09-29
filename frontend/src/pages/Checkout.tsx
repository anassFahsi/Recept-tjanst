import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import type { MembershipLevel } from "../types/membership";
import "./Checkout.css";

type Receipt = {
  id: number;
  orderReference: string;
  amountOre: number;
  levelName: string;
  status: string;
  paidAt: string;
};

type CheckoutResponse = {
  message: string;
  receipt: Receipt;
};

// 4242424242424242 -> "4242 4242 4242 4242", max 16 siffror
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

// 1228 -> "12/28", månad 13+ blir 12
function formatExpiry(value: string): string {
  let digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length >= 2) {
    const month = Number(digits.slice(0, 2));
    if (month === 0) digits = "01" + digits.slice(2);
    else if (month > 12) digits = "12" + digits.slice(2);
  }

  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvc(value: string): string {
  return value.replace(/\D/g, "").slice(0, 3);
}

const Checkout = () => {
  const { membershipSlug } = useParams();
  const { refreshUser } = useAuth();

  const [membershipLevel, setMembershipLevel] =
    useState<MembershipLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // Låtsasfält, skickas aldrig till backend
  const [card, setCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  });

  useEffect(() => {
    const fetchMembershipLevel = async () => {
      try {
        const response = await api.get<MembershipLevel[]>(
          "/api/membership-levels",
        );
        const selectedLevel = response.data.find(
          (level) => level.slug === membershipSlug,
        );

        if (!selectedLevel) {
          setError("Medlemsnivån finns inte.");
          return;
        }

        setMembershipLevel(selectedLevel);
      } catch (err) {
        console.error("Failed to fetch membership level:", err);
        setError("Kunde inte hämta medlemsnivån.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipLevel();
  }, [membershipSlug]);

  const handleCheckout = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!membershipLevel) return;

    if (card.number.replace(/\s/g, "").length !== 16) {
      setPurchaseError("Kortnumret måste vara 16 siffror");
      return;
    }

    if (card.expiry.length !== 5) {
      setPurchaseError("Fyll i giltighetstid som MM/ÅÅ");
      return;
    }

    if (card.cvc.length !== 3) {
      setPurchaseError("CVC måste vara 3 siffror");
      return;
    }

    try {
      setPurchasing(true);
      setPurchaseError(null);

      const { data } = await api.post<CheckoutResponse>("/api/checkout", {
        membershipSlug: membershipLevel.slug,
      });

      setReceipt(data.receipt);
      await refreshUser();
    } catch (err) {
      console.error("Checkout failed:", err);
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setPurchaseError(err.response.data.error);
      } else {
        setPurchaseError("Köpet kunde inte genomföras.");
      }
    } finally {
      setPurchasing(false);
    }
  };

  const formatMoney = (ore: number) =>
    (ore / 100).toLocaleString("sv-SE", { style: "currency", currency: "SEK" });

  if (loading) return <p className="checkout__state">Laddar…</p>;

  if (error || !membershipLevel) {
    return (
      <main className="checkout">
        <p className="checkout__error">{error ?? "Medlemsnivån finns inte."}</p>
        <Link to="/membership" className="done__btn done__btn--ghost">
          Tillbaka till medlemskapen
        </Link>
      </main>
    );
  }

  if (receipt) {
    return (
      <main className="checkout">
        <div className="done">
          <div className="done__icon">
            <svg
              width="26"
              height="26"
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
          </div>

          <h1 className="done__title">Tack för ditt köp</h1>
          <p className="done__lead">
            {receipt.levelName} är aktiverat. Alla recept på den nivån är
            upplåsta nu.
          </p>

          <div className="done__receipt">
            <div className="done__row">
              <span className="done__label">Medlemskap</span>
              <span className="done__value">{receipt.levelName}</span>
            </div>
            <div className="done__row">
              <span className="done__label">Belopp</span>
              <span className="done__value">
                {formatMoney(receipt.amountOre)}
              </span>
            </div>
            <div className="done__row">
              <span className="done__label">Datum</span>
              <span className="done__value">
                {new Date(receipt.paidAt).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="done__row">
              <span className="done__label">Ordernummer</span>
              <span className="done__value done__value--mono">
                {receipt.orderReference}
              </span>
            </div>
          </div>

          <div className="done__actions">
            <Link to="/recipes" className="done__btn done__btn--primary">
              Till recepten
            </Link>
            <Link to="/account" className="done__btn done__btn--ghost">
              Mina kvitton
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout">
      <Link to="/membership" className="checkout__back">
        ← Byt medlemskap
      </Link>
      <h1 className="checkout__title">Slutför köp</h1>

      <div className="summary">
        <div className="summary__head">
          <h2 className="summary__name">{membershipLevel.name}</h2>
          <span className="summary__price">
            {membershipLevel.priceOre === 0
              ? "Gratis"
              : formatMoney(membershipLevel.priceOre)}
            {membershipLevel.priceOre > 0 && (
              <span className="summary__period"> / mån</span>
            )}
          </span>
        </div>

        {membershipLevel.description && (
          <p className="summary__desc">{membershipLevel.description}</p>
        )}

        <div className="summary__total">
          <span className="summary__total-label">Att betala idag</span>
          <span className="summary__total-value">
            {formatMoney(membershipLevel.priceOre)}
          </span>
        </div>
      </div>

      <form onSubmit={handleCheckout}>
        <fieldset
          className="checkout__card"
          style={{ border: "none", padding: 0, margin: "0 0 2rem" }}
        >
          <h2 className="checkout__legend">Betalning</h2>
          <p className="checkout__demo">
            Demoläge. Inga riktiga kortuppgifter behandlas eller sparas.
          </p>

          <div className="pay-fields">
            <div className="pay-field">
              <label className="pay-label" htmlFor="cardName">
                Namn på kortet
              </label>
              <input
                className="pay-input"
                id="cardName"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                placeholder="Anna Andersson"
                required
              />
            </div>

            <div className="pay-field">
              <label className="pay-label" htmlFor="cardNumber">
                Kortnummer
              </label>
              <input
                className="pay-input"
                id="cardNumber"
                value={card.number}
                onChange={(e) =>
                  setCard({ ...card, number: formatCardNumber(e.target.value) })
                }
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                autoComplete="cc-number"
                required
              />
            </div>

            <div className="pay-row">
              <div className="pay-field">
                <label className="pay-label" htmlFor="expiry">
                  Giltigt till
                </label>
                <input
                  className="pay-input"
                  id="expiry"
                  value={card.expiry}
                  onChange={(e) =>
                    setCard({ ...card, expiry: formatExpiry(e.target.value) })
                  }
                  placeholder="MM/ÅÅ"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  required
                />
              </div>

              <div className="pay-field">
                <label className="pay-label" htmlFor="cvc">
                  CVC
                </label>
                <input
                  className="pay-input"
                  id="cvc"
                  value={card.cvc}
                  onChange={(e) =>
                    setCard({ ...card, cvc: formatCvc(e.target.value) })
                  }
                  placeholder="123"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  required
                />
              </div>
            </div>
          </div>
        </fieldset>

        {purchaseError && (
          <p className="checkout__error" role="alert">
            {purchaseError}
          </p>
        )}

        <button
          className="checkout__submit"
          type="submit"
          disabled={purchasing}
        >
          {purchasing
            ? "Genomför köp…"
            : `Betala ${formatMoney(membershipLevel.priceOre)}`}
        </button>

        <p className="checkout__note">
          Du kan avsluta när du vill. Ingen bindningstid.
        </p>
      </form>
    </main>
  );
};

export default Checkout;
