import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">📝 Mindful Blog</Link>
        <div className="nav-links">
          <Link to="/">Feed</Link>
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
