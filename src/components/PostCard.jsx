import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostCard({ post, index }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const getImageUrl = () => {
    if (imgError) return null;
    if (post.cover_image_base64) {
      return `data:image/jpeg;base64,${post.cover_image_base64}`;
    }
    return null;
  };

  const getChannelLogoUrl = () => {
    if (logoError) return null;
    if (post.channel_logo_base64) {
      return `data:image/jpeg;base64,${post.channel_logo_base64}`;
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const channelLogoUrl = getChannelLogoUrl();
  const readingTime = Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200);
  const daysAgo = Math.floor((new Date() - new Date(post.created_at)) / (1000 * 60 * 60 * 24));

  const handleChannelClick = (e) => {
    e.stopPropagation();
    if (post.channel_id) {
      navigate(`/channel/${post.channel_id}`);
    }
  };

  const handleReadMore = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const confirmLogin = window.confirm('Please sign in to read full stories. Would you like to login?');
      if (confirmLogin) navigate('/login');
    } else {
      navigate(`/post/${post._id}`);
    }
  };

  // Get channel initial
  const channelInitial = post.channel_name?.charAt(0).toUpperCase() || 'C';
  
  // Generate consistent color
  const getAvatarColor = (name) => {
    const colors = [
      '#d4a373', '#2c5f2d', '#4a7c4b', '#b87a4a', '#6b8c5c',
      '#e8a04c', '#c97e5a', '#8b6b4a', '#5c8a6e', '#a0784c',
      '#3d6b4f', '#c49a6c', '#e0a878', '#6e9f6e', '#b88a5a'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getAvatarColor(post.channel_name || post.author_name);

  // Debug log
  console.log('Post:', post.title);
  console.log('Has channel_logo_base64:', !!post.channel_logo_base64);
  console.log('Channel name:', post.channel_name);

  return (
    <div 
      className={`story-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Thumbnail Image */}
      {imageUrl && (
        <div className="story-card-image">
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
      <div className="story-card-content">
        {/* YouTube-style Channel Info */}
        <div className="channel-info-row">
          <button 
            onClick={handleChannelClick}
            className="channel-avatar-btn"
          >
            <div 
              className="channel-avatar-small" 
              style={{ backgroundColor: avatarColor }}
            >
              {channelLogoUrl ? (
                <img 
                  src={channelLogoUrl} 
                  alt={post.channel_name}
                  onError={() => {
                    console.log('Logo failed to load for:', post.channel_name);
                    setLogoError(true);
                  }}
                  onLoad={() => console.log('Logo loaded for:', post.channel_name)}
                />
              ) : (
                <span className="avatar-initial">{channelInitial}</span>
              )}
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
        <h3 className="story-title">{post.title}</h3>
        
        {/* Stats Row */}
        <div className="story-footer">
          <div className="story-stats">
            <button className="stat-btn">
              <span>❤️</span> {post.likes || 0}
            </button>
            <button className="stat-btn">
              <span>💬</span> {post.comments?.length || 0}
            </button>
          </div>
          
          <button onClick={handleReadMore} className="read-more-btn">
            Read Story
            <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
