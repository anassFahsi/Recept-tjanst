import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(): void {
    logout();
    navigate('/');
  }

  return (
    <nav>
      <Link to="/">Hem</Link>
      <Link to="/recipes">Recept</Link>
      <Link to="/membership">Medlemskap</Link>

      {user?.role === 'admin' && <Link to="/admin">Admin</Link>}

      {loading ? null : user ? (
        <>
          <span>{user.displayName} ({user.levelName})</span>
          <button onClick={handleLogout}>Logga ut</button>
        </>
      ) : (
        <>
          <Link to="/login">Logga in</Link>
          <Link to="/register">Skapa konto</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;