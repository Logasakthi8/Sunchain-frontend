import React, { useState, useEffect } from 'react';
import { getPosts } from '../api';
import PostCard from './PostCard';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    searchPosts();
  }, [searchQuery, posts]);

  const loadPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
      setFilteredPosts(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Unable to load stories. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = () => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.author_name.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-animation">
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
        </div>
        <p>Loading stories...</p>
      </div>
    );
  }
  
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="row-feed-container">
      {/* Hero Section */}
      <div className="row-hero">
        <div className="row-hero-content">
          <span className="hero-badge">✨ Discover</span>
          <h1>Stories That <span className="gradient-text">Inspire</span></h1>
          <p>Explore thoughtful stories from writers around the world</p>
          <div className="row-search-wrapper">
            <div className="row-search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search stories or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="row-search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#f5f7fa" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Results Stats */}
      <div className="row-stats">
        <div className="stats-left">
          <span className="stats-icon">📚</span>
          <span className="stats-text">{filteredPosts.length} stories</span>
        </div>
      </div>

      {/* Posts - Row Based Layout */}
      {filteredPosts.length === 0 ? (
        <div className="empty-row-state">
          <div className="empty-animation">🔍</div>
          <h3>No stories found</h3>
          <p>Try adjusting your search to find what you're looking for</p>
          <button onClick={() => setSearchQuery('')} className="explore-btn">
            Browse All Stories
          </button>
        </div>
      ) : (
        <div className="row-posts">
          {filteredPosts.map((post, index) => (
            <PostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;
