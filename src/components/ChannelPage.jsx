import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChannel, subscribeToChannel } from '../api';

function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isOwnChannel, setIsOwnChannel] = useState(false);

  useEffect(() => {
    loadChannel();
  }, [id]);

  const loadChannel = async () => {
    try {
      const response = await getChannel(id);
      setChannel(response.data);
      setSubscriberCount(response.data.subscriber_count || 0);
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && response.data.owner_id === user._id) {
        setIsOwnChannel(true);
      }
    } catch (err) {
      console.error('Failed to load channel:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const confirmLogin = window.confirm('Please sign in to follow insights');
      if (confirmLogin) navigate('/login');
      return;
    }
    
    try {
      await subscribeToChannel(id);
      setIsSubscribed(true);
      setSubscriberCount(prev => prev + 1);
    } catch (err) {
      console.error('Failed to subscribe:', err);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Extract key insight from post content
  const extractKeyInsight = (content) => {
    if (!content || typeof content !== 'string') return null;
    try {
      const insightMatch = content.match(/<div style="background: #fef5e8;.*?>.*?<h3.*?>.*?<\/h3>\s*<p>(.*?)<\/p>/s);
      if (insightMatch && insightMatch[1]) {
        return insightMatch[1].substring(0, 120) + (insightMatch[1].length > 120 ? '...' : '');
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  // Get template type
  const getTemplateType = (postType) => {
    if (!postType) return 'Insight';
    const templateMap = {
      growth: 'Growth Experiment',
      failure: 'Failure Story',
      startup: 'Startup Update',
      lesson: 'Lesson Learned',
      journey: 'Journey Update'
    };
    return templateMap[postType] || 'Insight';
  };

  // Template colors
  const templateColors = {
    'Growth Experiment': '#2c5f2d',
    'Failure Story': '#c97e5a',
    'Startup Update': '#e8a04c',
    'Lesson Learned': '#6b8c5c',
    'Journey Update': '#b87a9c',
    'Insight': '#d4a373'
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-animation">
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
        </div>
      </div>
    );
  }

  if (!channel) {
    return <div className="error-container">Channel not found</div>;
  }

  return (
    <div className="channel-page">
      {/* Channel Header */}
      <div className="channel-header">
        <div className="channel-cover">
          <div className="channel-avatar-large">
            {channel.profile_image_base64 ? (
              <img src={`data:image/jpeg;base64,${channel.profile_image_base64}`} alt={channel.name} />
            ) : (
              <span>{channel.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
        <div className="channel-info">
          <h1 className="channel-name">{channel.name}</h1>
          <p className="channel-positioning">
            Sharing structured learnings and real experiences
          </p>
          <p className="channel-description">
            {channel.description || 'This creator shares structured insights from their experience.'}
          </p>
          <div className="channel-meta">
            <span className="meta-item">🌿 {subscriberCount} followers</span>
            <span className="meta-item">🧠 {channel.posts?.length || 0} insights</span>
            <span className="meta-item">👤 Creator</span>
          </div>
          {!isOwnChannel && (
            <button 
              onClick={handleSubscribe}
              className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
            >
              {isSubscribed ? '✓ Following Insights' : '+ Follow Insights'}
            </button>
          )}
          {isOwnChannel && (
            <button className="own-channel-badge">📡 Your Knowledge Channel</button>
          )}
        </div>
      </div>

      {/* Insights Section - Updated from "Stories" to "Insights" */}
      <div className="channel-posts">
        <h2 className="section-title">🧠 All Insights</h2>
        
        {channel.posts?.length === 0 ? (
          <div className="empty-posts">
            <div className="empty-icon">📝</div>
            <p>No insights shared yet.</p>
            {isOwnChannel && (
              <button onClick={() => navigate('/create')} className="write-first-btn">
                Create Your First Learning
              </button>
            )}
          </div>
        ) : (
          <div className="channel-posts-grid">
            {channel.posts.map((post) => {
              const keyInsight = extractKeyInsight(post.content);
              const templateType = getTemplateType(post.postType);
              const templateColor = templateColors[templateType];
              
              return (
                <div key={post._id} className="channel-post-card" onClick={() => handlePostClick(post._id)}>
                  {post.cover_image_base64 && (
                    <div className="post-cover">
                      <img src={`data:image/jpeg;base64,${post.cover_image_base64}`} alt={post.title} />
                    </div>
                  )}
                  <div className="post-info">
                    {/* Template Badge */}
                    <div className="template-badge-channel" style={{ background: templateColor + '15', color: templateColor }}>
                      {templateType}
                    </div>
                    
                    <h3 className="post-title">{post.title}</h3>
                    
                    {/* Key Insight Preview - GAME CHANGER */}
                    {keyInsight && (
                      <div className="insight-preview-channel">
                        <span className="insight-icon">💡</span>
                        <span className="insight-text">{keyInsight}</span>
                      </div>
                    )}
                    
                    <div className="post-meta">
                      <span>❤️ {post.likes || 0}</span>
                      <span>💬 {post.comments || 0}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelPage;
