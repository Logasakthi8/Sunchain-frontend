import React, { useState, useEffect } from 'react';
import { getPosts } from '../api';
import PostCard from './PostCard';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Define categories
  const categories = ['All', 'Story', 'Philosophy', 'Technology', 'Startups', 'Self Growth', 'Health', 'Poetry', 'Memoir'];

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedCategory, posts]);

  const loadPosts = async () => {
    try {
      const response = await getPosts();
      console.log('Posts loaded:', response.data);
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
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    // Filter by search query
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
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

  return (
    <div className="sunchain-feed">
      {/* Hero Section */}
      <div className="feed-hero">
        <div className="hero-content">
          <div className="hero-tagline">
            <h1>Discover stories that go beyond the surface</h1>
            <p>Real experiences. Fully told.</p>
          </div>
          
          <div className="search-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search stories, channels, or writers..."
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

      {/* Category Filter */}
      <div className="category-filter">
        <div className="filter-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-header">
        <span className="results-count">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="empty-feed">
          <div className="empty-icon">📖</div>
          <h3>No stories found</h3>
          <p>
            {selectedCategory !== 'All' 
              ? `No stories in ${selectedCategory} category. Try another category.`
              : 'Try different search terms or explore other categories'}
          </p>
          {(selectedCategory !== 'All' || searchQuery) && (
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }} 
              className="clear-filters-btn"
            >
              Clear Filters
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
