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

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }
  
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return <div className="profile-error">Profile not found</div>;

  return (
    <div className="profile-container">
      {/* Profile Header Section */}
      <div className="profile-cover">
        <div className="profile-cover-gradient"></div>
        <div className="profile-info-wrapper">
          <div className="profile-avatar-large">
            {profile.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h1 className="profile-username">{profile.username}</h1>
            <p className="profile-bio">Passionate writer sharing stories with the world</p>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-value-large">⭐ {profile.points}</span>
                <span className="stat-label-large">Total Points</span>
              </div>
              <div className="profile-stat-divider"></div>
              <div className="profile-stat">
                <span className="stat-value-large">{profile.total_blogs}</span>
                <span className="stat-label-large">Stories Written</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="profile-logout-btn">
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Posts Section */}
      <div className="profile-posts-section">
        <div className="section-header">
          <h2>
            <span className="section-icon">📝</span>
            Your Stories
          </h2>
          <span className="post-count">{posts.length} {posts.length === 1 ? 'story' : 'stories'}</span>
        </div>
        
        {posts.length === 0 ? (
          <div className="empty-posts-state">
            <div className="empty-state-icon">✍️</div>
            <h3>No stories yet</h3>
            <p>Start your writing journey by creating your first story</p>
            <button onClick={() => navigate('/create')} className="write-first-btn">
              Write Your First Story
            </button>
          </div>
        ) : (
          <div className="profile-posts-grid">
            {posts.map((post, index) => (
              <div key={post._id} className="profile-post-item">
                <PostCard post={post} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
