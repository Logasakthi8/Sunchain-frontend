import React, { useState, useEffect } from 'react';
import { getPosts } from '../api';
import PostCard from './PostCard';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [selectedCategory, posts]);

  const loadPosts = async () => {
    try {
      console.log('Loading posts...');
      const response = await getPosts();
      console.log('Posts loaded:', response.data);
      setPosts(response.data);
      
      // Extract unique categories from posts
      const uniqueCategories = ['All', ...new Set(response.data.map(post => post.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      setError('');
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory));
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) return <div className="loading">Loading thoughtful posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      {/* Category Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>Filter by Category</h3>
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
                {category !== 'All' && (
                  <span className="category-count">
                    ({posts.filter(p => p.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No posts found in {selectedCategory} category.</p>
          <button onClick={() => setSelectedCategory('All')} style={{ marginTop: '1rem' }}>
            View All Posts
          </button>
        </div>
      ) : (
        filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}

export default Feed;