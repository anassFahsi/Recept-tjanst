import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

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
      navigate('/');
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
    <div>
      <h1>Skapa konto</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="displayName">Namn</label>
        <input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoComplete="name"
          required
        />

        <label htmlFor="email">E-post</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Lösenord</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Skapar konto…' : 'Skapa konto'}
        </button>
      </form>

      <p>
        Har du redan ett konto? <Link to="/login">Logga in</Link>
      </p>
    </div>
  );
};

export default Register;