import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostCard({ post, index }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getImageUrl = () => {
    if (imgError) return null;
    if (post.cover_image_base64) {
      return `data:image/jpeg;base64,${post.cover_image_base64}`;
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const readingTime = Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200);
  const daysAgo = Math.floor((new Date() - new Date(post.created_at)) / (1000 * 60 * 60 * 24));

  // Extract key insight from content
  const extractKeyInsight = (content) => {
    const insightMatch = content.match(/<div style="background: #fef5e8;.*?>.*?<h3.*?>.*?<\/h3>\s*<p>(.*?)<\/p>/s);
    if (insightMatch) {
      return insightMatch[1].substring(0, 120) + (insightMatch[1].length > 120 ? '...' : '');
    }
    return null;
  };

  const keyInsight = extractKeyInsight(post.content);
  
  // Determine template type
  // Update the getTemplateType function
const getTemplateType = () => {
  if (post.postType) {
    const templateMap = {
      growth: 'Growth Experiment',
      failure: 'Failure Story',
      startup: 'Startup Update',
      lesson: 'Lesson Learned',
      journey: 'Journey Update'
    };
    return templateMap[post.postType] || 'Insight';
  }
  return 'Insight';
};
  const templateType = getTemplateType();
  
  // Template colors
  const templateColors = {
    'Growth Experiment': '#2c5f2d',
    'Failure Story': '#c97e5a',
    'Startup Update': '#e8a04c',
    'Lesson Learned': '#6b8c5c',
    'Journey Update': '#b87a9c',
    'Insight': '#d4a373'
  };

  const handleChannelClick = (e) => {
    e.stopPropagation();
    if (post.channel_id) {
      navigate(`/channel/${post.channel_id}`);
    }
  };

  const handleReadMore = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const confirmLogin = window.confirm('Please sign in to read full insights.');
      if (confirmLogin) navigate('/login');
    } else {
      navigate(`/post/${post._id}`);
    }
  };

  // Get channel initial
  const channelInitial = post.channel_name?.charAt(0).toUpperCase() || 'C';
  
  const getAvatarColor = (name) => {
    const colors = [
      '#d4a373', '#2c5f2d', '#4a7c4b', '#b87a4a', '#6b8c5c',
      '#e8a04c', '#c97e5a', '#8b6b4a', '#5c8a6e', '#a0784c'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getAvatarColor(post.channel_name || post.author_name);

  return (
    <div 
      className={`insight-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Thumbnail Image */}
      {imageUrl && (
        <div className="insight-card-image">
          <img 
            src={imageUrl} 
            alt={post.title} 
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="reading-badge">{readingTime} min read</div>
        </div>
      )}
      
      {/* Content */}
      <div className="insight-card-content">
        {/* Template Badge - Top Priority */}
        <div className="template-badge-insight" style={{ background: templateColors[templateType] + '15', color: templateColors[templateType] }}>
          {templateType}
        </div>

        {/* Channel Info */}
        <div className="channel-info-row">
          <button 
            onClick={handleChannelClick}
            className="channel-avatar-btn"
          >
            <div 
              className="channel-avatar-small" 
              style={{ backgroundColor: avatarColor }}
            >
              <span className="avatar-initial">{channelInitial}</span>
            </div>
          </button>
          
          <div className="channel-text-info">
            <button onClick={handleChannelClick} className="channel-name-link">
              {post.channel_name || post.author_name}
            </button>
            <div className="video-meta">
              <span className="post-date">
                {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="insight-title">{post.title}</h3>
        
        {/* Key Insight Box - Game Changer */}
        {keyInsight && (
          <div className="key-insight-box">
            <div className="insight-icon">💡</div>
            <div className="insight-text">{keyInsight}</div>
          </div>
        )}
        
        {/* Meta Row - Template + Category */}
        <div className="meta-row">
          <span className="meta-template">{templateType}</span>
          <span className="meta-separator">•</span>
          <span className="meta-category">{post.category || 'Insight'}</span>
        </div>
        
        {/* Stats Row - Reduced importance */}
        <div className="insight-footer">
          <div className="insight-stats">
            <span className="stat-icon-small">❤️</span>
            <span className="stat-number-small">{post.likes || 0}</span>
            <span className="stat-icon-small">💬</span>
            <span className="stat-number-small">{post.comments?.length || 0}</span>
          </div>
          
          <button onClick={handleReadMore} className="view-insight-btn">
            View Insight
            <svg className="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
