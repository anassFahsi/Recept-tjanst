import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Steps from '../components/Steps';
import './Auth.css';

const steps = [
  { label: 'Skapa konto', icon: 'user' as const },
  { label: 'Välj plan', icon: 'card' as const },
  { label: 'Betalning', icon: 'payment' as const },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Lösenordet måste vara minst 8 tecken');
      return;
    }

    setSubmitting(true);

    try {
      await register(email, password, displayName);
      navigate('/membership');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Något gick fel. Försök igen.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Steps steps={steps} current={0} />

      <div className="auth">
        <h1 className="auth__title">Skapa konto</h1>
        <p className="auth__lead">
          Kom igång på en minut. Du väljer plan i nästa steg.
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="displayName">Namn</label>
            <input
              className="auth__input"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="email">E-post</label>
            <input
              className="auth__input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="password">Lösenord</label>
            <input
              className="auth__input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <span className="auth__hint">Minst 8 tecken</span>
          </div>

          {error && <p className="auth__error" role="alert">{error}</p>}

          <button className="auth__submit" type="submit" disabled={submitting}>
            {submitting ? 'Skapar konto…' : 'Fortsätt'}
          </button>
        </form>

        <p className="auth__footer">
          Har du redan ett konto? <Link to="/login">Logga in</Link>
        </p>
      </div>
    </>
  );
};

export default Register;