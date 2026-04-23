import React, { useState, useEffect } from 'react';
import { getPosts } from '../api';
import PostCard from './PostCard';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, posts]);

  const loadPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];
    
    // Filter by search query only
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.channel_name?.toLowerCase().includes(query) ||
        post.author_name.toLowerCase().includes(query)
      );
    }
    
    setFilteredPosts(filtered);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-animation">
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
        </div>
        <p>Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="sunchain-feed">
      {/* Hero Section */}
      <div className="feed-hero">
        <div className="hero-content">
          <div className="hero-tagline">
            <h1>Learn from real experiences, <span className="gradient-text">not just stories</span></h1>
            <p>Structured insights from builders and thinkers</p>
          </div>
          
          <div className="search-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search insights, channels, or writers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-header">
        <span className="results-count">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'insight' : 'insights'}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="empty-feed">
          <div className="empty-icon">📖</div>
          <h3>No insights found</h3>
          <p>
            {searchQuery 
              ? `No insights matching "${searchQuery}"`
              : 'Be the first to share an insight'}
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="clear-filters-btn"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="posts-grid-sunchain">
          {filteredPosts.map((post, index) => (
            <PostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;
