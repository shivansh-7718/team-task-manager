import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">🗂 TaskManager</Link>
      {user && (
        <div className="navbar-links">
          <Link to="/dashboard" className="navbar-link">📊 Dashboard</Link>
          <Link to="/projects" className="navbar-link">📁 Projects</Link>
          <span className="navbar-badge">
            {user.role === 'admin' ? '👑' : '👤'} {user.name}
          </span>
          <button className="navbar-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;