import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostCard({ post, index }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  
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
    if (imgError) return null;
    
    // Check for image_base64 (from MongoDB)
    if (post.image_base64) {
      let mimeType = 'image/jpeg';
      if (post.image_filename) {
        const ext = post.image_filename.split('.').pop().toLowerCase();
        if (ext === 'png') mimeType = 'image/png';
        else if (ext === 'gif') mimeType = 'image/gif';
        else if (ext === 'webp') mimeType = 'image/webp';
      }
      return `data:${mimeType};base64,${post.image_base64}`;
    }
    
    // Check for cover_image_base64
    if (post.cover_image_base64) {
      let mimeType = 'image/jpeg';
      if (post.cover_image_filename) {
        const ext = post.cover_image_filename.split('.').pop().toLowerCase();
        if (ext === 'png') mimeType = 'image/png';
        else if (ext === 'gif') mimeType = 'image/gif';
        else if (ext === 'webp') mimeType = 'image/webp';
      }
      return `data:${mimeType};base64,${post.cover_image_base64}`;
    }
    
    return null;
  };

  const imageUrl = getImageUrl();
  const readingTime = Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200);
  const daysAgo = Math.floor((new Date() - new Date(post.created_at)) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className={`story-card-expanded ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Cover Image Section */}
      <div className="story-card-cover">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="story-cover-image"
            onError={(e) => {
              console.error('Image failed to load for:', post.title);
              setImgError(true);
              e.target.style.display = 'none';
            }}
            onLoad={() => console.log('Image loaded for:', post.title)}
            loading="lazy"
          />
        ) : (
          <div className="cover-placeholder">
            <span>📷</span>
          </div>
        )}
        <div className="cover-overlay-info">
          <span className="reading-time-large">{readingTime} min read</span>
        </div>
      </div>
      
      {/* Content Section - No preview text, just title and author */}
      <div className="story-card-details">
        <div className="story-meta">
          <div className="author-info">
            <div className="author-avatar-story">
              {post.author_name?.charAt(0).toUpperCase()}
            </div>
            <div className="author-name-story">{post.author_name}</div>
          </div>
          <div className="story-date">
            {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
          </div>
        </div>
        
        <h3 className="story-title-expanded">{post.title}</h3>
        
        {/* No content preview here - removed completely */}
        
        <div className="story-footer">
          <div className="story-stats">
            <span className="story-stat">❤️ {post.likes || 0}</span>
            <span className="story-stat">💬 {post.comments?.length || 0}</span>
          </div>
          
          <button onClick={handleReadMore} className="story-read-btn">
            Read Story
            <svg className="read-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
