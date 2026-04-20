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
      
      // Check if this is the user's own channel
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
      const confirmLogin = window.confirm('Please sign in to subscribe to channels.');
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
          <p className="channel-description">{channel.description || 'No description yet.'}</p>
          <div className="channel-meta">
            <span className="meta-item">🌿 {subscriberCount} subscribers</span>
            <span className="meta-item">📝 {channel.posts?.length || 0} stories</span>
            <span className="meta-item">👤 Created by {channel.owner_name}</span>
          </div>
          {!isOwnChannel && (
            <button 
              onClick={handleSubscribe}
              className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
            >
              {isSubscribed ? '✓ Subscribed' : '+ Subscribe'}
            </button>
          )}
          {isOwnChannel && (
            <button className="own-channel-badge">📡 Your Channel</button>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="channel-posts">
        <h2 className="section-title">All Stories</h2>
        {channel.posts?.length === 0 ? (
          <div className="empty-posts">
            <div className="empty-icon">📝</div>
            <p>No stories published yet.</p>
            {isOwnChannel && (
              <button onClick={() => navigate('/create')} className="write-first-btn">
                Write Your First Story
              </button>
            )}
          </div>
        ) : (
          <div className="channel-posts-grid">
            {channel.posts.map((post) => (
              <div key={post._id} className="channel-post-card" onClick={() => handlePostClick(post._id)}>
                {post.cover_image_base64 && (
                  <div className="post-cover">
                    <img src={`data:image/jpeg;base64,${post.cover_image_base64}`} alt={post.title} />
                  </div>
                )}
                <div className="post-info">
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-meta">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelPage;
