import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import FullPost from './components/FullPost';
import CreatePost from './components/CreatePost';
import ChannelPage from './components/ChannelPage';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import Subscriptions from './components/Subscriptions';
import CreateChannel from './components/CreateChannel';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar />}
        
        {!isAuthenticated && (
          <nav className="public-navbar-modern">
            <div className="public-navbar-container">
              <Link to="/" className="public-logo">
                <span className="public-logo-icon">🌿</span>
                <span className="public-logo-text">Sunchain</span>
              </Link>
              <div className="public-nav-links">
                <Link to="/" className="public-nav-link home-link">Home</Link>
                <Link to="/login" className="public-nav-link login-link">Login</Link>
                <Link to="/signup" className="public-nav-link signup-link">Sign Up</Link>
              </div>
            </div>
          </nav>
        )}
        
        <div className="container">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
            <Route path="/" element={<Feed />} />
            <Route path="/post/:id" element={<FullPost />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/create-channel" element={isAuthenticated ? <CreateChannel /> : <Navigate to="/login" />} />
            <Route path="/create" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/subscriptions" element={isAuthenticated ? <Subscriptions /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
