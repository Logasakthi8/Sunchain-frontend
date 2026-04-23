import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserSubscriptions } from '../api';

function Subscriptions() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const response = await getUserSubscriptions();
      // Sort by most recently active (if last_post_date exists)
      const sortedChannels = response.data.sort((a, b) => {
        if (a.last_post_date && b.last_post_date) {
          return new Date(b.last_post_date) - new Date(a.last_post_date);
        }
        return 0;
      });
      setChannels(sortedChannels);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract key insight from post content
  const extractKeyInsight = (content) => {
    if (!content || typeof content !== 'string') return null;
    try {
      const insightMatch = content.match(/<div style="background: #fef5e8;.*?>.*?<h3.*?>.*?<\/h3>\s*<p>(.*?)<\/p>/s);
      if (insightMatch && insightMatch[1]) {
        return insightMatch[1].substring(0, 100) + (insightMatch[1].length > 100 ? '...' : '');
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-animation">
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
        </div>
        <p>Loading your learning feed...</p>
      </div>
    );
  }

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-header">
        <h1>📡 Your Learning Feed</h1>
        <p>Creators you learn from</p>
      </div>

      {channels.length === 0 ? (
        <div className="empty-subscriptions">
          <div className="empty-icon">🔔</div>
          <h3>No creators yet</h3>
          <p>Follow creators to learn from their real experiences and insights</p>
          <button onClick={() => navigate('/')} className="browse-btn">
            Explore Insights
          </button>
        </div>
      ) : (
        <div className="subscriptions-grid">
          {channels.map((channel) => {
            // Get latest post insight
            const latestPost = channel.posts && channel.posts.length > 0 ? channel.posts[0] : null;
            const keyInsight = latestPost ? extractKeyInsight(latestPost.content) : null;
            
            return (
              <div 
                key={channel._id} 
                className="subscription-card" 
                onClick={() => handleChannelClick(channel._id)}
              >
                <div className="subscription-avatar">
                  {channel.profile_image_base64 ? (
                    <img src={`data:image/jpeg;base64,${channel.profile_image_base64}`} alt={channel.name} />
                  ) : (
                    <span>{channel.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="subscription-info">
                  <h3>{channel.name}</h3>
                  <div className="learning-label">
                    📘 Insights & Learnings
                  </div>
                  <p className="subscription-description">
                    {channel.description || 'This creator shares structured insights and experiences'}
                  </p>
                  
                  {/* Key Insight Preview - Why you should follow */}
                  {keyInsight && (
                    <div className="channel-insight-preview">
                      <span className="preview-icon">💡</span>
                      <span className="preview-text">{keyInsight}</span>
                    </div>
                  )}
                  
                  <div className="subscription-stats">
                    <span> {channel.subscriber_count || 0} followers</span>
                    <span>🧠 {channel.posts?.length || 0} insights</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
