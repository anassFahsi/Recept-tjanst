import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(): void {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__mark" aria-hidden="true" />
        Recepttjänst
      </Link>

      <div className="navbar__links">
        <Link to="/recipes" className="navbar__link">Recept</Link>
        <Link to="/membership" className="navbar__link">Medlemskap</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="navbar__link">Admin</Link>
        )}
      </div>

      <div className="navbar__right">
        {loading ? null : user ? (
          <>
            <Link to="/account" className="navbar__link">
              Mitt konto
            </Link>
            <span className="navbar__user">
              <span className="navbar__name">{user.displayName}</span>
              <span className="navbar__level">{user.levelName}</span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="navbar__button navbar__button--ghost"
            >
              Logga ut
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__button navbar__button--ghost">
              Logga in
            </Link>
            <Link to="/register" className="navbar__button">
              Skapa konto
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;