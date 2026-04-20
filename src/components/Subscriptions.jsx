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
      console.log('Subscriptions loaded:', response.data);
      setChannels(response.data);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
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
        <p>Loading your subscriptions...</p>
      </div>
    );
  }

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-header">
        <h1>📡 Your Subscriptions</h1>
        <p>Channels you're following</p>
      </div>

      {channels.length === 0 ? (
        <div className="empty-subscriptions">
          <div className="empty-icon">🔔</div>
          <h3>No subscriptions yet</h3>
          <p>Subscribe to channels to see their stories in your feed</p>
          <button onClick={() => navigate('/')} className="browse-btn">
            Browse Channels
          </button>
        </div>
      ) : (
        <div className="subscriptions-grid">
          {channels.map((channel) => (
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
                <p>{channel.description?.substring(0, 100) || 'No description yet'}</p>
                <div className="subscription-stats">
                  <span> {channel.subscriber_count || 0} subscribers</span>
                  <span>👤 {channel.owner_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
