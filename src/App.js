import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import FullPost from './components/FullPost';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar />}
        <div className="container">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
            <Route path="/" element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} />
            <Route path="/post/:id" element={isAuthenticated ? <FullPost /> : <Navigate to="/login" />} />
            <Route path="/create" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;