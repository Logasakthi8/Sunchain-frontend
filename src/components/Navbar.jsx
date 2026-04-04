import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setPoints(parsedUser.points || 0);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!user) return null;

  return (
    <nav className="navbar-modern">
      <div className="navbar-container-modern">
        {/* Logo Section */}
        <Link to="/" className="logo-modern">
          <div className="logo-icon">📝</div>
          <div className="logo-text">
            <span className="logo-main">Sunchain</span>
           
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links-modern">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span>  Stories</span>
          </Link>
          
          <Link 
            to="/create" 
            className={`nav-link ${isActive('/create') ? 'active' : ''}`}
          >
            <span className="nav-icon">✍️</span>
            <span>Write</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </Link>

          {/* Points Badge */}
          <div className="points-badge-modern">
            <span className="points-icon">⭐</span>
            <span className="points-value">{points}</span>
            <span className="points-label">pts</span>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} className="logout-btn-modern">
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="nav-icon">🏠</span>
          <span>Feed</span>
        </Link>
        
        <Link 
          to="/create" 
          className={`mobile-nav-link ${isActive('/create') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="nav-icon">✍️</span>
          <span>Write</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="nav-icon">👤</span>
          <span>Profile</span>
        </Link>

        <div className="mobile-points">
          <span className="points-icon">⭐</span>
          <span className="points-value">{points}</span>
          <span className="points-label">points</span>
        </div>

        <button onClick={handleLogout} className="mobile-logout-btn">
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
