import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Navbar() {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setPoints(parsedUser.points || 0);
    }
  }, []);

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to login page
    navigate('/login');
    // Force reload to clear any state
    window.location.reload();
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">📝SUNCHAIN</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/create">Write</Link>
          <Link to="/profile">Profile</Link>
          <span className="points-badge">⭐ {points} pts</span>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;