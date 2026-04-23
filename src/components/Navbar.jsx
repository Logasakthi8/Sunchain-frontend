import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-sunchain">
      <div className="navbar-container-sunchain">
        <Link to="/" className="logo-sunchain">
          <span className="logo-icon"></span>
          <span className="logo-text">Sunchain</span>
        </Link>

        <div className="nav-links-sunchain">
          <Link to="/" className={`nav-link-sunchain ${isActive('/') ? 'active' : ''}`}>
            <span className="nav-icon">📝</span>
            <span>Explore </span>
          </Link>
          
          <Link to="/subscriptions" className={`nav-link-sunchain ${isActive('/subscriptions') ? 'active' : ''}`}>
            <span className="nav-icon">🔔</span>
            <span>Subscriptions</span>
          </Link>
          
          <Link to="/create" className={`nav-link-sunchain ${isActive('/create') ? 'active' : ''}`}>
            <span className="nav-icon">✍️</span>
            <span>Share Insight</span>
          </Link>
          
          <Link to="/profile" className={`nav-link-sunchain ${isActive('/profile') ? 'active' : ''}`}>
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </Link>

          <button onClick={handleLogout} className="logout-btn-sunchain">
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      <div className={`mobile-nav-sunchain ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
          <span>📝</span> Explore
        </Link>
        <Link to="/subscriptions" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
          <span>🔔</span> Subscriptions
        </Link>
        <Link to="/create" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
          <span>✍️</span> Share Insights
        </Link>
        <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
          <span>👤</span> Profile
        </Link>
        <button onClick={handleLogout} className="mobile-logout-btn">🚪 Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
