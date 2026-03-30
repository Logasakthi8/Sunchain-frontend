import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserPosts, getProfile } from '../api';
import PostCard from './PostCard';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadProfile();
    loadPosts();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      console.log('Profile data:', response.data);
      setProfile(response.data);
      
      // Update user in localStorage with latest points
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.points = response.data.points;
        user.total_blogs = response.data.total_blogs;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile. Please try again.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const loadPosts = async () => {
    try {
      const response = await getUserPosts();
      console.log('User posts:', response.data);
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load your posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="error">Profile not found</div>;

  return (
    <div>
      <div className="profile-header">
        <h1>{profile.username}</h1>
        <div className="stats">
          <div className="stat">
            <div className="stat-value">⭐ {profile.points}</div>
            <div className="stat-label">Points</div>
          </div>
          <div className="stat">
            <div className="stat-value">{profile.total_blogs}</div>
            <div className="stat-label">Blogs Written</div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <h2>Your Posts</h2>
      {posts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>You haven't written any posts yet.</p>
          <button onClick={() => navigate('/create')} style={{ marginTop: '1rem' }}>
            Write Your First Post
          </button>
        </div>
      ) : (
        posts.map(post => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}

export default Profile;