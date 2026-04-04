import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostCard({ post, index }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const getPreview = (content) => {
    const strippedContent = content.replace(/<[^>]*>/g, '');
    return strippedContent.substring(0, 180) + '...';
  };

  const handleReadMore = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const confirmLogin = window.confirm('Please sign in to read full posts. Would you like to login now?');
      if (confirmLogin) navigate('/login');
    } else {
      navigate(`/post/${post._id}`);
    }
  };

  const getImageUrl = () => {
    if (post.image_base64) {
      let mimeType = 'image/jpeg';
      if (post.image_filename) {
        const ext = post.image_filename.split('.').pop().toLowerCase();
        if (ext === 'png') mimeType = 'image/png';
        else if (ext === 'gif') mimeType = 'image/gif';
      }
      return `data:${mimeType};base64,${post.image_base64}`;
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const readingTime = Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200);
  const daysAgo = Math.floor((new Date() - new Date(post.created_at)) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className={`row-story-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {imageUrl && (
        <div className="row-card-image">
          <img src={imageUrl} alt={post.title} />
          <div className="image-effects">
            <div className="reading-time-badge">
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="row-card-content">
        <div className="row-card-header">
          <div className="author-section">
            <div className="author-avatar">
              {post.author_name?.charAt(0).toUpperCase()}
            </div>
            <div className="author-details">
              <span className="author-name-row">{post.author_name}</span>
            </div>
          </div>
          <div className="post-meta">
            <span className="post-date-badge">
              {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
            </span>
            {post.category && (
              <span className="category-chip">{post.category}</span>
            )}
          </div>
        </div>
        
        <h3 className="row-card-title">{post.title}</h3>
        <p className="row-card-excerpt">{getPreview(post.content)}</p>
        
        <div className="row-card-footer">
          <div className="engagement-stats">
            <div className="stat-group">
              <span className="stat-icon">❤️</span>
              <span>{post.likes || 0}</span>
            </div>
            <div className="stat-group">
              <span className="stat-icon">💬</span>
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
          
          <button onClick={handleReadMore} className="read-btn">
            <span>Read Story</span>
            <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
