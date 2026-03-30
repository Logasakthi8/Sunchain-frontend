import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import FullPost from './components/FullPost';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import { Link } from "react-router-dom";

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app">
        {/* Show Navbar only for authenticated users */}
        {isAuthenticated && <Navbar />}
        
        {/* Show simple header for non-authenticated users */}
        {!isAuthenticated && (
          <nav className="navbar public-navbar">
            <div className="navbar-container">
              <Link to="/" className="logo">📝 Mindful Blog</Link>
              <div className="nav-links">
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </div>
            </div>
          </nav>
        )}
        
        <div className="container">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
            {/* Feed is accessible to everyone */}
            <Route path="/" element={<Feed />} />
            {/* Protected routes */}
            <Route path="/post/:id" element={<FullPost />} />
            <Route path="/create" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
